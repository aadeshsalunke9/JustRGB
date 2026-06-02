'use client';
import { useEffect } from 'react';

export default function VideoLightbox({ isOpen, videoId, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('lightbox-active');
    } else {
      document.body.classList.remove('lightbox-active');
    }
    return () => {
      document.body.classList.remove('lightbox-active');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="lightbox active" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Video Player"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lightbox-content">
        <button className="close-lightbox" onClick={onClose} aria-label="Close Video">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1L11 11M11 1L1 11" strokeLinecap="round" />
          </svg>
          Close
        </button>
        <iframe 
          id="player-iframe" 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} 
          allow="autoplay; encrypted-media" 
          allowFullScreen
          title="Video Playback"
        />
      </div>
    </div>
  );
}
