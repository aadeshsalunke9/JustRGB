'use client';
import { useState, useRef, useEffect } from 'react';

export default function BeforeAfterSlider({ beforeImg, afterImg, labelBefore = "RAW", labelAfter = "GRADED" }) {
  const [position, setPosition] = useState(50);
  const shellRef = useRef(null);
  const isDragging = useRef(false);

  const updatePosition = (clientX) => {
    const shell = shellRef.current;
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(98, Math.max(2, pct));
    setPosition(clamped);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="slider-shell" ref={shellRef}>
      <div className="s-bef">
        <img src={beforeImg} alt={`${labelBefore} frame`} draggable="false" />
      </div>
      <div className="s-aft" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <img src={afterImg} alt={`${labelAfter} frame`} draggable="false" />
      </div>
      <div 
        className="s-handle" 
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <span className="s-pill" />
      </div>
      <div className="ba-labels">
        <span className="ba-l">{labelBefore}</span>
        <span className="ba-r">{labelAfter}</span>
      </div>
    </div>
  );
}
