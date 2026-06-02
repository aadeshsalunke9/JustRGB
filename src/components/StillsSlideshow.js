'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StillsSlideshow() {
  const containerRef = useRef(null);
  const ribbonRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [counter, setCounter] = useState({ current: '01', total: '00' });
  const activeRef = useRef(true);

  useEffect(() => {
    fetch('/stills_photos.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) {
          setPhotos(data);
          setCounter(prev => ({ ...prev, total: String(Math.min(18, data.length)).padStart(2, '0') }));
        }
      })
      .catch((e) => console.error('Failed to load stills JSON', e));
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const ribbon = ribbonRef.current;
    if (!container || !ribbon) return;

    const frames = [...ribbon.children];
    const N = Math.min(18, photos.length);

    let rotation = 0;
    let scrollExtra = 0;

    let frameW = 280;
    let gap = 24;

    const updateSpacing = () => {
      if (window.innerWidth <= 480) {
        frameW = 200;
        gap = 16;
      } else {
        frameW = 280;
        gap = 24;
      }
    };

    updateSpacing();
    window.addEventListener('resize', updateSpacing);

    let scrollTriggerInstance = ScrollTrigger.create({
      trigger: '#wi-4',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate(self) {
        scrollExtra = self.progress * 520;
      }
    });

    let animId;

    const tick = () => {
      if (!activeRef.current) return;
      rotation += 0.8;
      const currentRotation = rotation + scrollExtra;
      const step = frameW + gap;
      const totalW = N * step;

      for (let i = 0; i < N; i++) {
        const frame = frames[i];
        if (!frame) continue;
        let x = (i * step + currentRotation) % totalW;
        if (x < 0) x += totalW;
        x -= step;

        frame.style.transform = `translateX(${x}px) translateZ(0px) rotateY(-14deg) rotateZ(3deg)`;
      }

      // Update slide counter
      const containerW = container.offsetWidth || 600;
      const targetCenter = containerW / 2;
      let closestIdx = 0;
      let minDist = Infinity;
      for (let i = 0; i < N; i++) {
        let x = (i * step + currentRotation) % totalW;
        if (x < 0) x += totalW;
        x -= step;
        const dist = Math.abs(x + frameW / 2 - targetCenter);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }

      setCounter((prev) => ({
        ...prev,
        current: String(closestIdx + 1).padStart(2, '0')
      }));

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    const onVisibilityChange = () => {
      activeRef.current = !document.hidden;
      if (activeRef.current) {
        animId = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', updateSpacing);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(animId);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, [photos]);

  const N = Math.min(18, photos.length);

  return (
    <div className="wi-img">
      <div className="filmstrip-3d-container" id="stills-slideshow" ref={containerRef}>
        <div className="filmstrip-3d-ribbon" ref={ribbonRef}>
          {photos.slice(0, N).map((photo, i) => (
            <div className="film-frame" key={i}>
              <img src={`/images/collage/${photo}`} alt={`Grading Still ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="stills-slideshow-overlay" />
      <div className="stills-slide-counter">
        <span id="stills-current">{counter.current}</span>/
        <span id="stills-total">{counter.total}</span>
      </div>
    </div>
  );
}
