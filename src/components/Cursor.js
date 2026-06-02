'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    let my = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    let rx = mx;
    let ry = my;
    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const hide = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    dot.style.opacity = '0';
    ring.style.opacity = '0';

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      document.documentElement.style.setProperty('--cx', mx + 'px');
      document.documentElement.style.setProperty('--cy', my + 'px');
      show();
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);

    let animId;
    const tick = () => {
      rx = rx + (mx - rx) * 0.09;
      ry = ry + (my - ry) * 0.09;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div id="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
