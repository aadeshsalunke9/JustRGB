'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import VideoLightbox from '@/components/VideoLightbox';
import './trakin.css';

export default function TrakinTechPage() {
  const [videos, setVideos] = useState([]);
  const [activeChannel, setActiveChannel] = useState('all');
  const [activeMonth, setActiveMonth] = useState('all');
  const [lightboxVideoId, setLightboxVideoId] = useState(null);
  
  const containerRef = useRef(null);

  // Fetch trakin tech videos JSON
  useEffect(() => {
    fetch('/trakin-tech-videos.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) {
          setVideos(data);
        }
      })
      .catch((err) => console.error('Failed to load Trakin Tech videos', err));
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
      .fromTo('.filter-wrap, .timeline-slider-section', 
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
    const chMatch = activeChannel === 'all' || video.channel === activeChannel;
    const monthMatch = activeMonth === 'all' || video.monthCode === activeMonth;
    return chMatch && monthMatch;
  });

  const months = [
    { code: 'all', label: 'All Months' },
    { code: 'jul24', label: "Jul '24" },
    { code: 'aug24', label: "Aug '24" },
    { code: 'sep24', label: "Sep '24" },
    { code: 'oct24', label: "Oct '24" },
    { code: 'nov24', label: "Nov '24" },
    { code: 'dec24', label: "Dec '24" },
    { code: 'jan25', label: "Jan '25" },
    { code: 'feb25', label: "Feb '25" },
    { code: 'mar25', label: "Mar '25" },
    { code: 'apr25', label: "Apr '25" },
    { code: 'may25', label: "May '25" },
    { code: 'jun25', label: "Jun '25" },
  ];

  const channels = [
    { code: 'all', label: 'All Channels' },
    { code: 'hindi', label: 'Trakin Tech (Hindi)' },
    { code: 'tamil', label: 'Trakin Tech Tamil' },
    { code: 'english', label: 'Trakin Tech English' },
    { code: 'marathi', label: 'Trakin Tech Marathi' },
  ];

  return (
    <div className="case-study-page" ref={containerRef}>

      {/* Hero Section */}
      <section className="case-hero">
        <span className="timeline-badge">Project Tenure: July 2024 — June 2025</span>
        <h1 className="case-title">Trakin Tech <br/><span>&amp; Creators</span></h1>
        
        <div className="case-meta-grid">
          <div className="meta-item">
            <span class="meta-lbl">Role</span>
            <span class="meta-val">Lead DI Colorist</span>
          </div>
          <div className="meta-item">
            <span class="meta-lbl">Channels Graded</span>
            <span class="meta-val">Hindi, Tamil, English, Marathi</span>
          </div>
          <div className="meta-item">
            <span class="meta-lbl">Total Graded Videos</span>
            <span className="meta-val meta-val--highlight">{videos.length ? `${videos.length}+` : '150+'}</span>
          </div>
          <div className="meta-item">
            <span class="meta-lbl">Combined Audience</span>
            <span class="meta-val meta-val--highlight">10M+</span>
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

      {/* Filter & Videos Section */}
      <main className="gallery-section">
        <div className="filter-wrap">
          <div className="channel-tabs">
            {channels.map((c) => (
              <button 
                key={c.code}
                className={`tab-btn ${activeChannel === c.code ? 'active' : ''}`}
                onClick={() => setActiveChannel(c.code)}
              >
                {c.label}
              </button>
            ))}
          </div>
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
              <p>No graded videos found for this filter combination.</p>
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
                  <span className="card-badge">{video.channelName ? video.channelName.replace('Trakin Tech ', '') : video.channel}</span>
                  <span className="card-date">{video.dateText}</span>
                </div>
                <div className="card-info">
                  <span className="card-ch-name">{video.channelName}</span>
                  <h2 className="card-title">{video.title}</h2>
                  <p className="card-desc">{video.description}</p>
                  {video.gradingHighlights && (
                    <div className="grade-note-tag">
                      <span className="note-label">Grading Highlights</span>
                      <p className="note-text">{video.gradingHighlights}</p>
                    </div>
                  )}
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
