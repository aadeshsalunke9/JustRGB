'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import VideoLightbox from '@/components/VideoLightbox';
import './paper.css';

export default function PaperPixelPage() {
  const [videos, setVideos] = useState([]);
  const [activeMonth, setActiveMonth] = useState('all');
  const [lightboxVideoId, setLightboxVideoId] = useState(null);
  
  const containerRef = useRef(null);

  // Fetch paper to pixel videos JSON
  useEffect(() => {
    fetch('/paper-pixel-videos.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) {
          setVideos(data);
        }
      })
      .catch((err) => console.error('Failed to load Paper to Pixel videos', err));
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    if (videos.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.back-btn', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
      );

      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl.fromTo('.timeline-badge', 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
      )
      .fromTo('.case-title', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4'
      )
      .fromTo('.meta-item', 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.5'
      )
      .fromTo('.gallery-section, .timeline-slider-section', 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.3'
      )
      .fromTo('.video-card', 
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: { amount: 0.6 }, ease: 'power2.out' },
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [videos]);

  // Filter logic
  const filteredVideos = videos.filter((video) => {
    return activeMonth === 'all' || video.monthCode === activeMonth;
  });

  const months = [
    { code: 'all', label: 'All Months' },
    { code: 'aug24', label: "Aug '24" },
    { code: 'dec24', label: "Dec '24" },
    { code: 'feb25', label: "Feb '25" },
    { code: 'mar25', label: "Mar '25" },
    { code: 'jul25', label: "Jul '25" },
    { code: 'aug25', label: "Aug '25" },
    { code: 'sep25', label: "Sep '25" },
    { code: 'oct25', label: "Oct '25" },
    { code: 'nov25', label: "Nov '25" },
  ];

  return (
    <div className="case-study-page" ref={containerRef}>

      {/* Hero Section */}
      <section className="case-hero">
        <span className="timeline-badge">Project Tenure: August 2024 — November 2025</span>
        <h1 className="case-title">Paper to <br/><span>Pixel</span></h1>
        
        <div className="case-meta-grid">
          <div className="meta-item">
            <span className="meta-lbl">Role</span>
            <span className="meta-val">DI Colorist</span>
          </div>
          <div className="meta-item">
            <span className="meta-lbl">Channel Graded</span>
            <span className="meta-val">Take A Break</span>
          </div>
          <div className="meta-item">
            <span className="meta-lbl">Total Graded Videos</span>
            <span className="meta-val meta-val--highlight">{videos.length ? `${videos.length}+` : '10+'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-lbl">Combined Audience</span>
            <span className="meta-val meta-val--highlight">1.5M+</span>
          </div>
        </div>
      </section>

      {/* Timeline Slider (Filter by Month) */}
      <section className="timeline-slider-section">
        <span className="timeline-title">Filter by Timeline</span>
        <div className="months-track">
          {months.map((m) => (
            <div 
              key={m.code}
              className={`month-item ${activeMonth === m.code ? 'active' : ''}`}
              onClick={() => setActiveMonth(m.code)}
            >
              {m.label}
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <main className="gallery-section">
        <div className="filter-wrap" style={{ justifyContent: 'flex-start', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'var(--fh)', textTransform: 'uppercase', fontSize: '1.25rem', fontWeight: 700, color: 'var(--white)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--R)', display: 'inline-block' }}></span>
            DI Graded Animation Reels
          </h2>
        </div>

        {/* Video Grid */}
        <div className="video-grid" id="video-grid">
          {videos.length === 0 ? (
            <div className="video-loading-placeholder">
              <div className="loader-circle"></div>
              <p>Color grading reels loading...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="video-loading-placeholder" style={{ gridColumn: '1 / -1' }}>
              <p>No graded videos found for this timeline range.</p>
            </div>
          ) : (
            filteredVideos.map((video) => (
              <article 
                className="video-card" 
                key={video.id}
                onClick={() => setLightboxVideoId(video.id)}
              >
                <div className="card-media">
                  <img src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} alt={video.title} loading="lazy" />
                  <div className="card-overlay">
                    <div className="play-icon-mini">
                      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                        <path d="M0 0L12 7L0 14V0Z" fill="var(--void)"/>
                      </svg>
                    </div>
                  </div>
                  <span className="card-badge">Take A Break</span>
                  <span className="card-date">{video.dateText}</span>
                </div>
                <div className="card-info">
                  <span className="card-ch-name">{video.creditLine}</span>
                  <h2 className="card-title">{video.title}</h2>
                  <p className="card-desc">{video.description}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Video Lightbox Player */}
      <VideoLightbox 
        isOpen={lightboxVideoId !== null} 
        videoId={lightboxVideoId} 
        onClose={() => setLightboxVideoId(null)} 
      />
    </div>
  );
}
