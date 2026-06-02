'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import Accordion from '@/components/Accordion';
import StillsSlideshow from '@/components/StillsSlideshow';
import './globals.css';

export default function Home() {
  const [introActive, setIntroActive] = useState(true);
  const [weddingModalOpen, setWeddingModalOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState('IDLE'); // 'IDLE', 'SENDING', 'SENT'
  
  const landingRef = useRef(null);
  const introTimeline = useRef(null);

  // Initialize intro and scroll animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // If intro was already skipped or completed, unlock body scroll
    if (!introActive) {
      document.body.classList.remove('intro-active');
      showMainContent();
      return;
    }

    document.body.classList.add('intro-active');

    const justLine = document.getElementById('il-just');
    const rgbLine = document.getElementById('il-rgb');
    const overlay = document.getElementById('intro-overlay');

    let completed = false;

    const completeIntro = () => {
      if (completed) return;
      completed = true;
      setIntroActive(false);
      document.body.classList.remove('intro-active');
      document.body.classList.add('intro-complete');
      showMainContent();
      
      // Refresh scroll trigger coordinates
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    };

    const doBurst = () => {
      // Blur and fade out text elements with tracking expansion (luxurious cinematic exit)
      gsap.to(justLine, {
        opacity: 0,
        filter: 'blur(30px)',
        letterSpacing: '0.45em',
        scale: 0.94,
        duration: 1.2,
        ease: 'power3.inOut'
      });

      gsap.to(rgbLine, {
        opacity: 0,
        filter: 'blur(30px)',
        letterSpacing: '0.45em',
        scale: 0.94,
        duration: 1.2,
        ease: 'power3.inOut'
      });



      // fade whole overlay
      gsap.to(overlay, {
        opacity: 0,
        duration: 1.4,
        delay: 0.2,
        ease: 'power2.out',
        onComplete() {
          completeIntro();
        },
      });
    };

    // Build intro timeline
    const tl = gsap.timeline();
    introTimeline.current = tl;

    // 1. JUST blurs and fades in with expanding letter-spacing
    tl.fromTo(justLine,
      { opacity: 0, filter: 'blur(20px)', letterSpacing: '0.12em', scale: 1.08 },
      { opacity: 1, filter: 'blur(0px)', letterSpacing: '0.26em', scale: 1.0, duration: 2.0, ease: 'power3.out' }
    );

    // 2. RGB blurs and fades in with expanding letter-spacing (overlaps beautifully)
    tl.fromTo(rgbLine,
      { opacity: 0, filter: 'blur(20px)', letterSpacing: '0.12em', scale: 1.08 },
      { opacity: 1, filter: 'blur(0px)', letterSpacing: '0.26em', scale: 1.0, duration: 2.0, ease: 'power3.out' },
      '-=1.5'
    );

    // 3. Wait for WebGL floating hold state to complete
    tl.to({}, { duration: 1.2 });

    // 4. Trigger burst transition to enter website
    tl.call(doBurst);

    // Skip trigger
    const skip = () => {
      if (tl.isActive()) {
        tl.kill();
      }
      gsap.set(justLine, { opacity: 1, filter: 'blur(0px)', letterSpacing: '0.26em', scale: 1.0 });
      gsap.set(rgbLine, { opacity: 1, filter: 'blur(0px)', letterSpacing: '0.26em', scale: 1.0 });
      doBurst();
    };

    overlay.addEventListener('click', skip, { once: true });
    document.addEventListener('keydown', skip, { once: true });

    return () => {
      if (tl) tl.kill();
      overlay.removeEventListener('click', skip);
      document.removeEventListener('keydown', skip);
    };
  }, [introActive]);

  const showMainContent = () => {
    gsap.set('.name-inner', { clipPath: 'inset(110% 0% -10% 0%)' });
    gsap.set('.hero-sub', { opacity: 0, y: 20 });
    gsap.set('.hero-meta', { opacity: 0, y: 14 });
    gsap.set('.hero-side-label', { opacity: 0 });
    gsap.set('.hero-year-label', { opacity: 0 });

    gsap.to('#main-content', { opacity: 1, duration: 0.6, delay: 0.05, ease: 'power2.out' });

    const nav = document.getElementById('nav');
    if (nav) {
      nav.classList.add('nav-visible');
      gsap.fromTo(nav,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }

    gsap.delayedCall(0.4, runHeroCascade);
    gsap.to('#scroll-cue', { opacity: 1, duration: 0.8, delay: 1.8 });
  };

  const runHeroCascade = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 })
      .to('.name-inner', { clipPath: 'inset(0% 0% -10% 0%)', duration: 1.2, stagger: 0.16 }, '-=0.5')
      .to('.hero-meta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.55')
      .to('.hero-side-label', { opacity: 1, duration: 0.6 }, '-=0.4')
      .to('.hero-year-label', { opacity: 1, duration: 0.6 }, '-=0.4');
  };

  // Setup homepage ScrollTrigger and Parallax animations
  useEffect(() => {
    if (introActive) return;

    const ctx = gsap.context(() => {
      // 1. Reveal transitions
      gsap.utils.toArray('[data-reveal="fade"]').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 44 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1.1, 
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' } 
          }
        );
      });

      gsap.utils.toArray('[data-reveal="wipe"]').forEach((el) => {
        gsap.fromTo(el,
          { clipPath: 'inset(100% 0 0 0)' },
          { 
            clipPath: 'inset(0% 0 0 0)', 
            duration: 1.3, 
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' } 
          }
        );
      });

      // Character splits text reveal
      gsap.utils.toArray('[data-reveal="lines"]').forEach((el) => {
        const chars = [];
        const html = el.innerHTML;
        el.innerHTML = '';
        html.split(/(<[^>]+>)/).forEach((part) => {
          if (part.startsWith('<')) {
            el.insertAdjacentHTML('beforeend', part);
            return;
          }
          [...part].forEach((ch) => {
            if (ch === '\n') return;
            if (ch === ' ' || ch === '\u00a0') {
              el.insertAdjacentText('beforeend', '\u00a0');
              return;
            }
            const outer = document.createElement('span');
            outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.12;padding-bottom:0.06em';
            const inner = document.createElement('span');
            inner.style.display = 'inline-block';
            inner.textContent = ch;
            outer.appendChild(inner);
            el.appendChild(outer);
            chars.push(inner);
          });
        });
        if (!chars.length) return;
        gsap.fromTo(chars,
          { yPercent: 110 },
          { 
            yPercent: 0, 
            duration: 0.72, 
            ease: 'power3.out', 
            stagger: 0.022,
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } 
          }
        );
      });

      // Selected Work details reveals
      gsap.utils.toArray('.work-item').forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 75%', toggleActions: 'play none none none' },
        });
        const num = item.querySelector('.wi-num');
        const title = item.querySelector('.wi-title');
        const meta = item.querySelector('.wi-meta');
        const desc = item.querySelector('.wi-desc');
        const link = item.querySelector('.wi-link');

        if (num) tl.fromTo(num, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 0);
        if (title) tl.fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.1);
        if (meta) tl.fromTo(meta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.25);
        if (desc) tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.35);
        if (link) tl.fromTo(link, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.5);
      });

      // Awards list entries reveal
      gsap.utils.toArray('.award-row').forEach((row, i) => {
        gsap.fromTo(row,
          { x: -50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 0.7, 
            ease: 'power3.out', 
            delay: (i % 6) * 0.07,
            scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none none' } 
          }
        );
      });

      // Camera systems list entries reveal
      gsap.utils.toArray('.grading-item').forEach((item, i) => {
        gsap.fromTo(item,
          { x: i % 2 === 0 ? -30 : 30, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: 1.1, 
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none none' } 
          }
        );
      });

      // 2. Parallax effects
      const heroBg = document.querySelector('.hero-bg-image-wrap img');
      if (heroBg) {
        gsap.to(heroBg, { 
          yPercent: 12, 
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } 
        });
      }

      const bgWord = document.querySelector('.hero-bg-word');
      if (bgWord) {
        gsap.to(bgWord, { 
          yPercent: -22, 
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2 } 
        });
      }

      const hContent = document.querySelector('.hero-content');
      if (hContent) {
        gsap.to(hContent, { 
          yPercent: 16, 
          opacity: 0.4, 
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } 
        });
      }

      const scrollCue = document.getElementById('scroll-cue');
      if (scrollCue) {
        gsap.to(scrollCue, { 
          opacity: 0, 
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: '200px top', scrub: true } 
        });
      }

      // Parallax for work items
      gsap.utils.toArray('.wi-img img:not(.wedding-logo-img):not(.paper-logo-img):not(.trakin-logo-img)').forEach((img) => {
        gsap.to(img, { 
          yPercent: 10, 
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.work-item'), start: 'top bottom', end: 'bottom top', scrub: 1 } 
        });
      });

      // Parallax for sliders
      gsap.utils.toArray('.slider-shell img').forEach((img) => {
        gsap.to(img, { 
          yPercent: 8, 
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.slider-shell'), start: 'top bottom', end: 'bottom top', scrub: 1 } 
        });
      });

      // 3. Pinned Horizontal Bio
      const sec = document.getElementById('bio');
      const slides = document.getElementById('bio-slides');
      if (sec && slides) {
        const n = slides.children.length;
        slides.style.width = `${n * 100}vw`;

        let quoteAnim = false;
        let statsDone = false;

        gsap.to(slides, {
          x: () => -(window.innerWidth * (n - 1)),
          ease: 'none',
          scrollTrigger: {
            trigger: sec,
            start: 'top top',
            end: () => `+=${window.innerWidth * (n - 1)}`,
            pin: '.bio-pin-wrap',
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const bar = document.getElementById('bio-bar');
              if (bar) bar.style.transform = `scaleX(${self.progress})`;

              if (self.progress < 0.18 && !quoteAnim) {
                quoteAnim = true;
                gsap.fromTo('.bq-inner',
                  { yPercent: 110 },
                  { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.14 }
                );
              }

              if (self.progress >= 0.38 && !statsDone) {
                statsDone = true;
                gsap.utils.toArray('.stat-num').forEach((el) => {
                  const target = parseInt(el.dataset.target, 10);
                  if (isNaN(target)) return;
                  const sup = el.querySelector('sup');
                  const suffix = sup ? sup.outerHTML : '';
                  const obj = { v: 0 };
                  gsap.to(obj, { 
                    v: target, 
                    duration: 2.2, 
                    ease: 'power2.out',
                    onUpdate() { el.innerHTML = Math.round(obj.v) + suffix; } 
                  });
                });
              }
            },
          },
        });
      }
    }, landingRef);

    return () => ctx.revert();
  }, [introActive]);

  // Form Submission Handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactStatus('SENDING');
    setTimeout(() => {
      setContactStatus('SENT');
      e.target.reset();
      setTimeout(() => {
        setContactStatus('IDLE');
      }, 3000);
    }, 1500);
  };

  return (
    <div ref={landingRef}>
      {/* Intro Overlay */}
      {introActive && (
        <div id="intro-overlay">
          <div className="intro-bg-glow" aria-hidden="true"></div>
          
          {/* Fullscreen Video Background */}
          <div className="intro-canvas-container">
            <video
              src="/Intro.mp4"
              autoPlay
              muted
              playsInline
              loop
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Fullscreen Overlay Content */}
          <div className="intro-content-overlay">
            {/* JUST blurs and fades in */}
            <h1 className="intro-line" id="il-just">
              JUST
            </h1>

            {/* Vertical Gap for the overlapping RGB spheres to emerge */}
            <div style={{ height: '140px' }} aria-hidden="true"></div>

            {/* RGB blurs and fades in */}
            <h1 className="intro-line" id="il-rgb">
              <span className="c-b">R</span>
              <span className="c-g">G</span>
              <span className="c-r">B</span>
            </h1>
          </div>

          <p id="skip-hint">CLICK TO SKIP</p>
        </div>
      )}

      {/* Scroll indicator cue */}
      <div id="scroll-cue" aria-hidden="true">
        <div className="sc-line"></div>
        <span>SCROLL</span>
      </div>

      {/* Main Home Content */}
      <main id="main-content" style={{ opacity: introActive ? 0 : 1 }}>
        {/* HERO SECTION */}
        <section id="hero">
          <div className="hero-bg-image-wrap">
            <img src="/images/grading_setup.png" alt="DaVinci Resolve setup background"/>
            <div className="hero-bg-gradient" aria-hidden="true"></div>
          </div>
          <div className="hero-bg-word" aria-hidden="true">COLOR</div>
          <div className="hero-content">
            <p className="hero-sub">DI Colorist · Cinematographer</p>
            <h1 className="hero-name">
              <span className="name-line"><span className="name-inner rgb-hover">AADESH</span></span>
              <span className="name-line"><span className="name-inner rgb-hover">SALUNKE</span></span>
            </h1>
            <div className="hero-meta">
              <span>Available for Projects</span>
            </div>
          </div>
          <div className="hero-side-label" aria-hidden="true">JUST RGB</div>
          <div className="hero-year-label" aria-hidden="true">2025</div>
        </section>

        {/* BIO SECTION - Horizontal Slides */}
        <section id="bio">
          <div className="bio-pin-wrap">
            <div className="bio-slides" id="bio-slides">
              {/* Slide 1: Quote */}
              <div className="bio-slide bio-slide--quote">
                <div className="slide-collage-bg">
                  <div className="collage-bg-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <img key={i} src={`/images/collage/photo_${String(i + 1).padStart(3, '0')}.jpg`} alt="" />
                    ))}
                  </div>
                  <div className="collage-bg-overlay"></div>
                </div>
                <div className="bio-slide-inner">
                  <p className="slide-tag">01 / 03</p>
                  <blockquote className="bio-quote">
                    <span className="bq-line"><span className="bq-inner rgb-hover">"Color is the</span></span>
                    <span className="bq-line"><span className="bq-inner rgb-hover">first thing</span></span>
                    <span className="bq-line"><span className="bq-inner rgb-hover">you feel."</span></span>
                  </blockquote>
                  <p className="bio-attr">— Aadesh Salunke, Colorist</p>
                </div>
              </div>

              {/* Slide 2: Stats */}
              <div className="bio-slide bio-slide--stats">
                <div className="slide-collage-bg">
                  <div className="collage-bg-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <img key={i} src={`/images/collage/photo_${String(i + 13).padStart(3, '0')}.jpg`} alt="" />
                    ))}
                  </div>
                  <div className="collage-bg-overlay"></div>
                </div>
                <div className="bio-slide-inner">
                  <p className="slide-tag">02 / 03</p>
                  <p className="eyebrow" style={{ marginBottom: '24px' }}>By the Numbers</p>
                  <div className="stats-stack">
                    <div className="stat-row">
                      <div className="stat-num" data-target="50">0<sup>+</sup></div>
                      <div className="stat-lbl">Projects Graded</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-num" data-target="10">0<sup>M+</sup></div>
                      <div className="stat-lbl">YouTube Combined Audience</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-num" data-target="5">0<sup>+</sup></div>
                      <div className="stat-lbl">Years Experience</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-num" data-target="3000">0<sup>+</sup></div>
                      <div className="stat-lbl">Hours in the Suite</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 3: About */}
              <div className="bio-slide bio-slide--about">
                <div className="slide-collage-bg">
                  <div className="collage-bg-grid">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <img key={i} src={`/images/collage/photo_${String(i + 25).padStart(3, '0')}.jpg`} alt="" />
                    ))}
                  </div>
                  <div className="collage-bg-overlay"></div>
                </div>
                <div className="bio-slide-inner">
                  <p className="slide-tag">03 / 03</p>
                  <p className="eyebrow" style={{ marginBottom: '28px' }}>About</p>
                  <p className="bio-copy">
                    I shape <em>emotion</em> through the language of light and color. With over five years in the color suite, I have engineered the look for high-profile digital channels (10M+ combined audience), independent documentaries, and premium wedding cinema. I bridge technical grading with creative storytelling, transforming raw footage into <em>unforgettable cinematic experiences</em>.
                  </p>
                  <div className="tools-list">
                    <div className="tool-item"><span className="tool-n">01</span><span className="tool-name rgb-hover">DaVinci Resolve Studio</span></div>
                    <div className="tool-item"><span className="tool-n">02</span><span className="tool-name rgb-hover">DI Color Grading</span></div>
                    <div className="tool-item"><span className="tool-n">03</span><span className="tool-name rgb-hover">Primary &amp; Secondary Grading</span></div>
                    <div className="tool-item"><span className="tool-n">04</span><span className="tool-name rgb-hover">Shot Matching &amp; Consistency</span></div>
                    <div className="tool-item"><span className="tool-n">05</span><span className="tool-name rgb-hover">YouTube / Digital Content Grading</span></div>
                    <div className="tool-item"><span className="tool-n">06</span><span className="tool-name rgb-hover">LUT Design &amp; Delivery</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bio-progress-bar-wrap" aria-hidden="true">
              <div className="bio-progress-bar" id="bio-bar"></div>
            </div>
            <p className="bio-hint" aria-hidden="true">← SCROLL →</p>
          </div>
        </section>

        {/* WORK SECTION */}
        <section id="work">
          <div className="work-header">
            <p className="eyebrow" data-reveal="fade">Portfolio</p>
            <h2 className="sec-title rgb-hover" data-reveal="lines">Selected<br/>Work</h2>
          </div>
          <div className="work-list">
            <article className="work-item" id="wi-1">
              <div className="wi-info">
                <span className="wi-num">01</span>
                <Link href="/trakin-tech"><h3 className="wi-title rgb-hover">Trakin Tech<br/>&amp; Creators</h3></Link>
                <div className="wi-meta">
                  <span className="wi-type">DI Colorist</span>
                  <span className="wi-year">2024</span>
                </div>
                <p className="wi-desc">Colorist for high-performing digital channels including Trakin Tech, Shorts Break, and Kay Vishay. Reaching a combined audience of 10M+ subscribers.</p>
                <Link href="/trakin-tech" className="wi-link rgb-hover">View Project →</Link>
              </div>
              <Link href="/trakin-tech" className="wi-img" data-reveal="wipe">
                <img src="/images/ember_campaign.png" alt="Trakin Tech Background" className="trakin-card-bg" />
                <div className="trakin-card-overlay"></div>
                <div className="trakin-logo-circle">
                  <img src="/images/trakin_tech_logo.jpg" alt="Trakin Tech Logo" className="trakin-logo-img" />
                </div>
              </Link>
            </article>

            <article className="work-item work-item--flip" id="wi-2">
              <div className="wi-info">
                <span className="wi-num">02</span>
                <Link href="/paper-pixel"><h3 className="wi-title rgb-hover">Paper to<br/>Pixel</h3></Link>
                <div className="wi-meta">
                  <span className="wi-type">DI Colorist</span>
                  <span className="wi-year">2024 - 2025</span>
                </div>
                <p className="wi-desc">Colorist for Take A Break. Transforming high-quality comedic and narrative sketches into visually rich stories with precise digital intermediate grading.</p>
                <Link href="/paper-pixel" className="wi-link rgb-hover">View Project →</Link>
              </div>
              <Link href="/paper-pixel" className="wi-img" data-reveal="wipe">
                <img src="/images/midnight_protocol.png" alt="Paper to Pixel Background" className="paper-card-bg" />
                <div className="paper-card-overlay"></div>
                <div className="paper-logo-circle">
                  <img src="/images/paper_to_pixel_logo.jpg" alt="Paper to Pixel Logo" className="paper-logo-img" />
                </div>
              </Link>
            </article>

            <article className="work-item" id="wi-3">
              <div className="wi-info">
                <span className="wi-num">03</span>
                <span className="wedding-filmer-trigger" onClick={() => setWeddingModalOpen(true)}>
                  <h3 className="wi-title rgb-hover">The Wedding<br/>Filmer</h3>
                </span>
                <div className="wi-meta">
                  <span className="wi-type">Assistant Colorist</span>
                  <span className="wi-year">2024</span>
                </div>
                <p className="wi-desc">Assisted senior colorists on high-end luxury wedding film projects. Managed asset pipelines and performed primary grades for broadcast and streaming.</p>
                <span className="wi-link rgb-hover wedding-filmer-trigger" onClick={() => setWeddingModalOpen(true)}>Watch Films →</span>
              </div>
              <div className="wi-img wedding-filmer-trigger" data-reveal="wipe" onClick={() => setWeddingModalOpen(true)}>
                <img src="/images/collage/photo_002.jpg" alt="The Wedding Filmer Background" className="wedding-card-bg" />
                <div className="wedding-card-overlay"></div>
                <div className="wedding-logo-circle">
                  <img src="/images/wedding_filmer_logo.jpg" alt="The Wedding Filmer Logo" className="wedding-logo-img" />
                </div>
              </div>
            </article>

            <article className="work-item work-item--flip" id="wi-4">
              <div className="wi-info">
                <span className="wi-num">04</span>
                <Link href="/stills"><h3 className="wi-title rgb-hover">DI Grading Stills</h3></Link>
                <div className="wi-meta">
                  <span className="wi-type">DI Colorist</span>
                  <span className="wi-year">2026</span>
                </div>
                <p className="wi-desc">A comprehensive visual gallery showcasing high-resolution color grading stills, log-to-graded workflows, and selected project frames.</p>
                <Link href="/stills" className="wi-link rgb-hover">View Stills →</Link>
              </div>
              <Link href="/stills" className="wi-img">
                <StillsSlideshow />
              </Link>
            </article>
          </div>
        </section>

        {/* BEFORE VS AFTER GRADING SECTION */}
        <section id="grading">
          <div className="grading-header">
            <p className="eyebrow" data-reveal="fade">Before &amp; After</p>
            <h2 className="sec-title rgb-hover" data-reveal="lines">RAW vs<br/>GRADED</h2>
          </div>

          <div className="camera-system-group">
            <h3 className="camera-system-title rgb-hover" data-reveal="fade">ARRI Log</h3>
            <div className="grading-list">
              <div className="grading-item">
                <BeforeAfterSlider 
                  beforeImg="/images/arri_1_raw.jpg"
                  afterImg="/images/arri_1_graded.jpg"
                />
                <div className="grading-meta">
                  <span className="grading-num">01</span>
                  <h3 className="grading-title rgb-hover">Shot 1</h3>
                  <p className="grading-desc">Cinematic color grading starting from an ARRI Alexa Log C space, shaping high-fidelity colors, natural skin tones, and rich highlight rolloffs.</p>
                </div>
              </div>

              <div className="grading-item grading-item--flip">
                <div className="grading-meta">
                  <span className="grading-num">02</span>
                  <h3 className="grading-title rgb-hover">Shot 2</h3>
                  <p className="grading-desc">Highlight reconstruction and natural color balancing using ARRI's wide dynamic range pipeline.</p>
                </div>
                <BeforeAfterSlider 
                  beforeImg="/images/arri_2_raw.jpg"
                  afterImg="/images/arri_2_graded.jpg"
                />
              </div>
            </div>
          </div>

          <div className="camera-system-group">
            <h3 className="camera-system-title rgb-hover" data-reveal="fade">Sony Log (S-Log3)</h3>
            <div className="grading-list">
              <div className="grading-item">
                <BeforeAfterSlider 
                  beforeImg="/images/sony_1_raw.jpg"
                  afterImg="/images/sony_1_graded.jpg"
                />
                <div className="grading-meta">
                  <span className="grading-num">03</span>
                  <h3 className="grading-title rgb-hover">Shot 1</h3>
                  <p className="grading-desc">Detailed color grading from S-Log3 profile, matching contrast curves, and balancing skin tones while preserving maximum dynamic range.</p>
                </div>
              </div>

              <div className="grading-item grading-item--flip">
                <div className="grading-meta">
                  <span className="grading-num">04</span>
                  <h3 className="grading-title rgb-hover">Shot 2</h3>
                  <p className="grading-desc">Stylized grade mapping utilizing 3D LUTs and custom color wheels in the S-Log3 color gamut.</p>
                </div>
                <BeforeAfterSlider 
                  beforeImg="/images/sony_2_raw.jpg"
                  afterImg="/images/sony_2_graded.jpg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* AWARDS SECTION */}
        <section id="awards">
          <div className="awards-body">
            <div className="awards-hdr">
              <p className="eyebrow" data-reveal="fade">Recognition</p>
              <h2 className="sec-title rgb-hover" data-reveal="lines">Awards &amp;<br/>Festivals</h2>
            </div>
            <div className="awards-list">
              <div className="award-row" id="aw-1">
                <span className="aw-yr">2025</span>
                <span className="aw-ev rgb-hover">2nd Place – Short Documentary</span>
                <span className="aw-role">DOP &amp; Color · <em>Avlokan Film Festival</em></span>
              </div>
              <div className="award-row" id="aw-2">
                <span className="aw-yr">2024</span>
                <span className="aw-ev rgb-hover">Quarter-Finalist – Documentary</span>
                <span className="aw-role">DOP &amp; Color · <em>Golden Femi Film Festival</em></span>
              </div>
              <div className="award-row" id="aw-3">
                <span className="aw-yr">2024</span>
                <span className="aw-ev rgb-hover">Lead DOP – Featured Production</span>
                <span className="aw-role">DOP · <em>Maadhyam Season 3</em></span>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section id="process">
          <div className="process-hdr">
            <p className="eyebrow" data-reveal="fade">My Process</p>
            <h2 className="sec-title rgb-hover" data-reveal="lines">How I<br/>Work</h2>
          </div>
          <Accordion />
        </section>

        {/* CONTACT SECTION */}
        <section id="contact">
          <div className="contact-inner">
            <div className="contact-layout-box">
              {/* Form panel */}
              <div className="contact-form-side">
                <div className="contact-menu-btn" aria-label="Menu decoration">
                  <span className="menu-line"></span>
                  <span className="menu-line"></span>
                  <span className="menu-line"></span>
                </div>
                <h2 className="contact-form-title">Let's Connect &amp; Add Colours in Your Story</h2>
                <p className="contact-form-sub">Feel free to contact us any time. We will get back to you as soon as we can!</p>
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <input type="text" id="form-name" required placeholder=" " />
                    <label htmlFor="form-name">Name</label>
                    <span className="form-line"></span>
                  </div>
                  <div className="form-group">
                    <input type="email" id="form-email" required placeholder=" " />
                    <label htmlFor="form-email">Email</label>
                    <span className="form-line"></span>
                  </div>
                  <div className="form-group">
                    <textarea id="form-message" required placeholder=" "></textarea>
                    <label htmlFor="form-message">Message</label>
                    <span className="form-line"></span>
                  </div>
                  <button type="submit" className="form-submit-btn" disabled={contactStatus !== 'IDLE'}>
                    <span>
                      {contactStatus === 'IDLE' && 'SEND'}
                      {contactStatus === 'SENDING' && 'SENDING...'}
                      {contactStatus === 'SENT' && 'SENT! THANK YOU.'}
                    </span>
                  </button>
                </form>
              </div>

              {/* Info panel */}
              <div className="contact-info-wrapper">
                <div className="contact-accent-strip"></div>
                <div className="contact-info-side">
                  <div className="info-accent-box" aria-hidden="true"></div>
                  <h3 className="info-title">Info</h3>
                  <div className="info-list">
                    <div className="info-item">
                      <div className="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      </div>
                      <a href="mailto:aadeshsalunke9@gmail.com" className="info-text">aadeshsalunke9@gmail.com</a>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                      <a href="tel:+919960212118" className="info-text">+91 9960212118</a>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M9 12h6"></path><path d="M9 8h6"></path></svg>
                      </div>
                      <span className="info-text">Pune, Maharashtra (Remote)</span>
                    </div>
                    <div className="info-item">
                      <div className="info-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>
                      </div>
                      <span className="info-text">Available Worldwide</span>
                    </div>
                  </div>
                  <div className="info-socials">
                    <a href="https://www.linkedin.com/in/aadesh-salunke/" target="_blank" rel="noopener" aria-label="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                    <a href="https://www.instagram.com/aadesh.salunke/" target="_blank" rel="noopener" aria-label="Instagram">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Wedding Filmer Video Modal Lightbox */}
      {weddingModalOpen && (
        <div 
          className="video-modal active" 
          role="dialog" 
          aria-modal="true" 
          aria-label="Wedding Film Reels"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWeddingModalOpen(false);
          }}
        >
          <button 
            className="video-modal-close" 
            onClick={() => setWeddingModalOpen(false)} 
            aria-label="Close video player"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="video-modal-content">
            <div className="video-modal-grid">
              <div className="video-item-wrap">
                <h4 className="video-item-title">Wedding Film 1</h4>
                <div className="video-wrapper">
                  <iframe 
                    src="https://www.youtube.com/embed/Dxn91wYgAvY?autoplay=1&loop=1&playlist=Dxn91wYgAvY" 
                    frameBorder="0" 
                    allow="autoplay; encrypted-media" 
                    allowFullScreen
                    title="Wedding Film 1"
                  ></iframe>
                </div>
              </div>
              <div className="video-item-wrap">
                <h4 className="video-item-title">Wedding Film 2</h4>
                <div className="video-wrapper">
                  <iframe 
                    src="https://www.youtube.com/embed/HSxM75_Y0mg?loop=1&playlist=HSxM75_Y0mg" 
                    frameBorder="0" 
                    allow="autoplay; encrypted-media" 
                    allowFullScreen
                    title="Wedding Film 2"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
