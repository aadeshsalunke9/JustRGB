'use client';
import Link from 'next/link';
import BeforeAfterWipe from '@/components/BeforeAfterWipe';

export default function Home() {
  const projects = [
    {
      id: 'shilp-siddhi',
      num: '01',
      title: 'Shilp Siddhi (Documentary Stills)',
      beforeImg: '/images/arri_1_raw.jpg',
      afterImg: '/images/arri_1_graded.jpg',
      route: '/stills'
    },
    {
      id: 'nfai-nfdc',
      num: '02',
      title: 'NFAI / NFDC (Archival Restoration)',
      beforeImg: '/images/arri_2_raw.jpg',
      afterImg: '/images/arri_2_graded.jpg',
      route: '/stills'
    },
    {
      id: 'trakin-tech',
      num: '03',
      title: 'Trakin Tech & Creators (DI Grading)',
      beforeImg: '/images/sony_1_raw.jpg',
      afterImg: '/images/sony_1_graded.jpg',
      route: '/trakin-tech'
    },
    {
      id: 'paper-pixel',
      num: '04',
      title: 'Paper to Pixel (Animation Grading)',
      beforeImg: '/images/sony_2_raw.jpg',
      afterImg: '/images/sony_2_graded.jpg',
      route: '/paper-pixel'
    }
  ];

  const experiences = [
    {
      role: 'Freelance Colorist',
      company: 'Self-Employed',
      period: 'July 2025 — Present',
      details: [
        'Provided end-to-end color grading and cinematography services for prominent YouTube creators and diverse indie clients.',
        'Collaborated closely with creators to define and execute a cohesive visual style that enhanced brand identity.'
      ]
    },
    {
      role: 'Colorist',
      company: 'NFAI – NFDC (National Film Archive / Film Development Corp, Government of India)',
      period: 'July 2025 — March 2026',
      details: [
        'Engaged as Colorist on a prestigious government film restoration and digitization project.',
        'Restored and color-corrected historical archival film footage to modern delivery standards while maintaining visual consistency.'
      ]
    },
    {
      role: 'DI-Colorist',
      company: 'Armoks Media PVT.',
      period: 'July 2024 — June 2025',
      details: [
        'Collaborated on high-performing YouTube channels (Trakin Tech, Shorts Break, Kay Vishay) with 10M+ combined subscribers.',
        'Maintained visual quality standards and post-production workflows across rapid-turnaround digital media deliveries.'
      ]
    },
    {
      role: 'Assistant-Colorist',
      company: 'The Wedding Filmer',
      period: 'October 2023 — June 2024',
      details: [
        'Assisted senior colorists with project preparation, camera log setup, media organization, and initial grading passes.'
      ]
    },
    {
      role: 'DOP — Cinematographer',
      company: 'Armoks Media PVT.',
      period: 'January 2020 — December 2020',
      details: [
        'Served as DP for various popular YouTube channels, managing lighting, composition, camera operations, and visual storytelling.'
      ]
    }
  ];

  const awards = [
    {
      title: 'Second Position, Short Documentary Category',
      event: 'Avlokan Film Festival 2025',
      work: 'Shilp Siddhi (Director of Photography)'
    },
    {
      title: 'Quarter-Finalist, Documentary Category',
      event: 'Golden Femi Film Festival 2024',
      work: 'Shilp Siddhi (Director of Photography)'
    },
    {
      title: 'Lead DOP & Featured Production',
      event: 'Maadhyam Season 3 | Parul University',
      work: '\"Lights, Camera, and Action\" (DOP)'
    }
  ];

  return (
    <div className="container">
      
      {/* 1. Hero Section */}
      <section id="hero" className="hero">
        <h1 className="hero-title">AADESH SALUNKE</h1>
        <p className="hero-tagline">Color Grading &amp; Cinematography</p>
        <div className="scroll-cue">SCROLL</div>
      </section>

      {/* 2. Showreel Section */}
      <section id="showreel" className="showreel-section">
        <h2>Showreel</h2>
        <div className="showreel-player">
          <video
            controls
            playsInline
            preload="metadata"
            poster=""
            className="showreel-video"
          >
            <source src="/Showreel.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* 3. Work Grid Section */}
      <section id="work" style={{ paddingBottom: '80px' }}>
        <h2>Selected Work</h2>
        <div className="work-grid">
          {projects.map((project) => (
            <Link 
              href={project.route} 
              key={project.id} 
              className="project-link-wrapper"
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <BeforeAfterWipe 
                beforeImg={project.beforeImg}
                afterImg={project.afterImg}
              />
              <div 
                className="project-caption"
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--parchment-muted)',
                  borderBottom: '1px solid rgba(234, 226, 210, 0.05)',
                  paddingBottom: '10px'
                }}
              >
                <span>{project.num} &#47;&#47; {project.title}</span>
                <span className="caption-arrow" style={{ transition: 'transform 0.3s ease' }}>VIEW WORK →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. About Section */}
      <section id="about" className="about-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="scrim-card about-card">
          <h3 className="about-header">Look Development</h3>
          <p className="about-copy">
            I shape emotion through the language of light and color. With over five years in the color suite, 
            I have engineered the look for high-profile digital channels, independent documentaries, and 
            premium cinematic productions.
          </p>
          <p className="about-copy">
            Specializing in DaVinci Resolve (Certified User) with hands-on expertise on the Resolve Mini Panel and 
            Tangent Elements controllers. I bridge technical DI workflow management with creative lookup-table look development, 
            transforming raw log profiles into unforgettable filmic experiences.
          </p>
        </div>
      </section>

      {/* 4. Experience & Awards Section */}
      <section id="resume" style={{ paddingTop: '80px', paddingBottom: '120px' }}>
        <div className="scrim-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div className="resume-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px' }}>
            
            {/* Experience Column */}
            <div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '30px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '12px' }}>
                EXPERIENCE
              </h3>
              <div className="exp-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {experiences.map((exp, idx) => (
                  <div key={idx} className="exp-item" style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--parchment)' }}>
                        {exp.role}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--parchment-muted)', fontStyle: 'italic' }}>
                        {exp.period}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--parchment-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                      {exp.company}
                    </div>
                    <ul style={{ paddingLeft: '16px', listStyleType: 'square', color: 'var(--parchment-muted)', fontSize: '0.95rem' }}>
                      {exp.details.map((detail, dIdx) => (
                        <li key={dIdx} style={{ marginBottom: '6px' }}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards & Skills Column */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
              
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '12px' }}>
                  AWARDS &amp; RECOGNITION
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {awards.map((award, idx) => (
                    <div key={idx} style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '16px' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '4px' }}>
                        {award.title}
                      </h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--parchment-muted)', textTransform: 'uppercase' }}>
                        {award.event}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--parchment-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                        {award.work}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '12px' }}>
                  SKILLS &amp; EXPERTISE
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', color: 'var(--parchment-muted)' }}>
                  <div>
                    <strong style={{ color: 'var(--parchment)', fontSize: '0.85rem', letterSpacing: '0.08em', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Color Grading
                    </strong>
                    DaVinci Resolve, DI Color Grading, Shot Matching, Color Theory
                  </div>
                  <div>
                    <strong style={{ color: 'var(--parchment)', fontSize: '0.85rem', letterSpacing: '0.08em', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Cinematography
                    </strong>
                    Composition &amp; Framing, Lighting, Camera Operation, Directing Photography (DOP)
                  </div>
                  <div>
                    <strong style={{ color: 'var(--parchment)', fontSize: '0.85rem', letterSpacing: '0.08em', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Tools &amp; Software
                    </strong>
                    DaVinci Resolve (Certified User), Resolve Mini Panel, Tangent Elements, Premiere Pro, Photoshop
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
