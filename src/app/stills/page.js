'use client';

import { useEffect, useRef, useState } from 'react';
import './stills.css';

export default function StillsPage() {
  const [view, setView] = useState('3d'); // '3d' or 'grid'
  const [photos, setPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  
  const carouselRef = useRef(null);
  const stateRef = useRef({
    theta: 0,
    radius: 0,
    currentAngle: 0,
    targetAngle: 0,
    isDragging: false,
    autoDrift: true,
    startX: 0,
    startAngle: 0,
    hasDragged: false,
    driftTimer: null,
    activeIndex: -1,
  });

  // Load stills photos JSON data
  useEffect(() => {
    fetch('/stills_photos.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) {
          setPhotos(data);
        }
      })
      .catch((err) => console.error('Failed to load stills photos data', err));
  }, []);

  const totalPhotos = photos.length;

  // Handle Radius updates on window resize or view changes
  const updateRadius = () => {
    const carousel = carouselRef.current;
    if (!carousel || !photos.length) return;

    const N = photos.length;
    const theta = 360 / N;
    stateRef.current.theta = theta;

    // Create a temporary frame to measure width
    const tempFrame = document.createElement('div');
    tempFrame.className = 'film-frame';
    tempFrame.style.visibility = 'hidden';
    tempFrame.style.position = 'absolute';
    carousel.appendChild(tempFrame);
    const frameWidth = tempFrame.offsetWidth || 360;
    carousel.removeChild(tempFrame);

    const radius = (frameWidth / 2) / Math.tan((theta / 2) * Math.PI / 180);
    stateRef.current.radius = radius;

    // Apply starting positions
    const frames = carousel.querySelectorAll('.film-frame');
    frames.forEach((frame, i) => {
      frame.style.transform = `rotateY(${i * theta}deg) translateZ(${radius}px)`;
    });
  };

  // Run updateRadius when photos load or view shifts back to '3d'
  useEffect(() => {
    if (view === '3d' && photos.length > 0) {
      updateRadius();
      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }
  }, [view, photos]);

  // Carousel loop and tick logic
  useEffect(() => {
    if (view !== '3d' || photos.length === 0) return;

    let animId;

    const tick = () => {
      const state = stateRef.current;
      const carousel = carouselRef.current;
      if (!carousel) {
        animId = requestAnimationFrame(tick);
        return;
      }

      if (state.autoDrift && !state.isDragging) {
        state.targetAngle -= 0.022; // subtle continuous spin
      }

      state.currentAngle += (state.targetAngle - state.currentAngle) * 0.08;
      
      carousel.style.transform = `rotateX(8deg) rotateZ(-3deg) translateZ(${-state.radius}px) rotateY(${state.currentAngle}deg)`;

      const frontAngle = -state.currentAngle;
      const frames = carousel.querySelectorAll('.film-frame');
      const theta = state.theta;

      frames.forEach((frame, i) => {
        const img = frame.querySelector('img');
        if (!img) return;

        let cardAngle = i * theta;
        let diff = (cardAngle - frontAngle) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        const dist = Math.abs(diff);
        const maxActiveDistance = 140;
        const factor = Math.max(0, 1 - (dist / maxActiveDistance));

        const opacity = 0.08 + (factor * 0.92);
        const blurVal = (1 - factor) * 8;
        const brightness = 0.15 + (factor * 0.85);
        const scale = 0.78 + (factor * 0.22);

        frame.style.opacity = opacity;
        frame.style.filter = `blur(${blurVal}px) brightness(${brightness})`;
        img.style.transform = `scale(${scale})`;
        frame.style.zIndex = Math.round(factor * 100);
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [view, photos]);

  // Drag Handlers
  const dragStart = (clientX) => {
    const state = stateRef.current;
    state.isDragging = true;
    state.autoDrift = false;
    state.hasDragged = false;
    state.startX = clientX;
    state.startAngle = state.targetAngle;
    if (state.driftTimer) clearTimeout(state.driftTimer);
  };

  const dragMove = (clientX) => {
    const state = stateRef.current;
    if (!state.isDragging) return;
    const deltaX = clientX - state.startX;
    const sensitivity = 0.12;
    state.targetAngle = state.startAngle + deltaX * sensitivity;

    if (Math.abs(deltaX) > 6) {
      state.hasDragged = true;
    }
  };

  const dragEnd = () => {
    const state = stateRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;

    // Nearest item snapping
    const theta = state.theta;
    const nearestIndex = Math.round(state.targetAngle / theta);
    state.targetAngle = nearestIndex * theta;

    state.driftTimer = setTimeout(() => {
      if (!state.isDragging) state.autoDrift = true;
    }, 5000);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % totalPhotos);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, totalPhotos]);

  const openLightbox = (index) => {
    if (stateRef.current.hasDragged) return;
    setLightboxIndex(index);
  };

  const handlePrevBtn = () => {
    const state = stateRef.current;
    state.autoDrift = false;
    state.targetAngle += state.theta;
    if (state.driftTimer) clearTimeout(state.driftTimer);
    state.driftTimer = setTimeout(() => { state.autoDrift = true; }, 5000);
  };

  const handleNextBtn = () => {
    const state = stateRef.current;
    state.autoDrift = false;
    state.targetAngle -= state.theta;
    if (state.driftTimer) clearTimeout(state.driftTimer);
    state.driftTimer = setTimeout(() => { state.autoDrift = true; }, 5000);
  };

  return (
    <div className="stills-page-wrapper">
      <header className="collage-header-section">
        <p className="eyebrow">DI Portfolio</p>
        <h1 className="rgb-hover">DI Grading Stills</h1>
        <p className="collage-subtitle">
          A consolidated visual workspace displaying color grade sheets, log-to-graded stills, and finished compositions.
        </p>
      </header>

      {/* View Toggle Toolbar */}
      <div className="view-toggle-bar">
        <button 
          className={`toggle-btn ${view === '3d' ? 'active' : ''}`} 
          onClick={() => setView('3d')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          3D Film Strip
        </button>
        <button 
          className={`toggle-btn ${view === 'grid' ? 'active' : ''}`} 
          onClick={() => setView('grid')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Grid View
        </button>
      </div>

      {/* 3D Film Strip Workspace */}
      {view === '3d' && (
        <div className="film-strip-container">
          <div 
            className="film-strip-viewport"
            onMouseDown={(e) => dragStart(e.pageX)}
            onMouseMove={(e) => dragMove(e.pageX)}
            onMouseUp={dragEnd}
            onMouseLeave={dragEnd}
            onTouchStart={(e) => dragStart(e.touches[0].pageX)}
            onTouchMove={(e) => dragMove(e.touches[0].pageX)}
            onTouchEnd={dragEnd}
          >
            <div className="film-strip-carousel" ref={carouselRef}>
              {photos.map((photoName, index) => {
                const num = String(index + 1).padStart(3, '0');
                return (
                  <div 
                    className="film-frame" 
                    key={photoName}
                    onClick={() => openLightbox(index)}
                  >
                    <span className="film-label-kodak">KODAK 5072</span>
                    <img src={`/images/collage/${photoName}`} alt={`DI Grade Frame ${num}`} />
                    <span className="film-label-number">{num} A</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="film-controls">
            <button className="film-arrow-btn" onClick={handlePrevBtn} aria-label="Previous frame">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div className="film-scroll-hint">
              <span className="finger-icon">👈</span>
              <span>DRAG OR SPIN TO EXPLORE</span>
              <span className="finger-icon">👉</span>
            </div>
            <button className="film-arrow-btn" onClick={handleNextBtn} aria-label="Next frame">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Collage Grid View */}
      {view === 'grid' && (
        <main className="collage-container">
          <div className="collage-grid">
            {photos.map((photoName, index) => {
              const num = String(index + 1).padStart(3, '0');
              return (
                <div 
                  className="collage-item" 
                  key={photoName}
                  onClick={() => setLightboxIndex(index)}
                >
                  <img src={`/images/collage/${photoName}`} alt={`DI Grade Still ${num}`} loading="lazy" />
                  <div className="collage-item-overlay">
                    <span className="collage-item-num">STILL #{num}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Image Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="image-lightbox active"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
        >
          <button 
            className="image-lightbox-close" 
            onClick={() => setLightboxIndex(null)}
            aria-label="Close Lightbox"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button 
            className="image-lightbox-nav image-lightbox-prev" 
            onClick={() => setLightboxIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos)}
            aria-label="Previous Image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <button 
            className="image-lightbox-nav image-lightbox-next" 
            onClick={() => setLightboxIndex((prev) => (prev + 1) % totalPhotos)}
            aria-label="Next Image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <div className="image-lightbox-content">
            <img 
              src={`/images/collage/${photos[lightboxIndex]}`} 
              alt="Lightbox Preview" 
            />
            <span className="image-lightbox-caption">
              STILL #{String(lightboxIndex + 1).padStart(3, '0')} / {String(totalPhotos).padStart(3, '0')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
