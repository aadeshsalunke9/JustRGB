'use client';
import { useEffect, useRef } from 'react';

export default function FilmGrain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sz = 256;
    canvas.width = canvas.height = sz;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let last = 0;
    let animId;

    const loop = (t) => {
      animId = requestAnimationFrame(loop);
      if (t - last < 80) return;
      last = t;

      const img = ctx.createImageData(sz, sz);
      const data = img.data;
      const len = data.length;
      for (let i = 0; i < len; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 500,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
        opacity: 0.035,
      }}
      aria-hidden="true"
    />
  );
}
