'use client';
import { useState } from 'react';

export default function BeforeAfterWipe({ beforeImg, afterImg }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="wipe-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Color grading before and after comparison"
    >
      {/* Before Image (RAW/LOG) */}
      <img src={beforeImg} alt="Before grading" className="wipe-img before-img" loading="lazy" />

      {/* After Image (Graded final) */}
      <img 
        src={afterImg} 
        alt="After grading" 
        className="wipe-img after-img"
        style={{
          clipPath: hovered ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)'
        }}
        loading="lazy"
      />

      {/* Wipe Line Indicator */}
      <div 
        className="wipe-line"
        style={{
          left: hovered ? '0%' : '100%'
        }}
      />
    </div>
  );
}
