'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const containerRef = useRef(null);
  const rRef = useRef(null);
  const gRef = useRef(null);
  const bRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const rDot = rRef.current;
    const gDot = gRef.current;
    const bDot = bRef.current;

    if (!container || !rDot || !gDot || !bDot) return;

    let targetX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let targetY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    
    // Interpolated positions for smooth movement
    let gX = targetX;
    let gY = targetY;
    let rX = targetX;
    let rY = targetY;
    let bX = targetX;
    let bY = targetY;

    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      container.style.opacity = '1';
    };

    const hide = () => {
      visible = false;
      container.style.opacity = '0';
    };

    container.style.opacity = '0';

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      show();
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    let animId;
    const tick = () => {
      // Smooth tracking for green (center)
      gX += (targetX - gX) * 0.15;
      gY += (targetY - gY) * 0.15;

      // Calculate velocity / distance to target
      const dx = targetX - gX;
      const dy = targetY - gY;

      // Red offsets slightly forward/ahead of the center
      const rTargetX = gX + dx * 0.6;
      const rTargetY = gY + dy * 0.6;
      rX += (rTargetX - rX) * 0.12;
      rY += (rTargetY - rY) * 0.12;

      // Blue offsets slightly backward/behind the center
      const bTargetX = gX - dx * 0.6;
      const bTargetY = gY - dy * 0.6;
      bX += (bTargetX - bX) * 0.12;
      bY += (bTargetY - bY) * 0.12;

      // Apply transforms
      container.style.transform = `translate3d(${gX}px, ${gY}px, 0)`;
      rDot.style.transform = `translate3d(${rX - gX}px, ${rY - gY}px, 0)`;
      bDot.style.transform = `translate3d(${bX - gX}px, ${bY - gY}px, 0)`;

      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    // Dynamic hover scaling on links/buttons
    const addHover = () => {
      container.classList.add('cursor-hover');
    };
    const removeHover = () => {
      container.classList.remove('cursor-hover');
    };

    const updateHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], .rgb-hover, input, textarea, select');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    };

    // Run hover updates and watch for DOM mutations (e.g. modal open)
    updateHoverListeners();
    const observer = new MutationObserver(updateHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div id="custom-cursor" className="custom-cursor" ref={containerRef} aria-hidden="true">
      <div className="cursor-dot dot-r" ref={rRef} />
      <div className="cursor-dot dot-g" ref={gRef} />
      <div className="cursor-dot dot-b" ref={bRef} />
    </div>
  );
}
