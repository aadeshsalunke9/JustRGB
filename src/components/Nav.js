'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      if (isHome) {
        const sections = ['bio', 'work', 'process', 'contact'];
        let currentSec = '';
        const scrollPosition = window.scrollY + window.innerHeight * 0.45;
        
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              currentSec = id;
              break;
            }
          }
        }
        setActiveSection(currentSec);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isLinkActive = (href) => {
    if (href.startsWith('/#')) {
      return activeSection === href.split('#')[1];
    }
    return pathname === href;
  };

  const handleLogoClick = (e) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  // Mobile drawer rendered via portal directly into document.body
  // This escapes the nav's backdrop-filter stacking context which clips fixed children
  const drawerPortal = mounted && createPortal(
    <div
      className={`mobile-drawer ${menuOpen ? 'drawer-open' : ''}`}
      aria-hidden={!menuOpen}
      aria-modal={menuOpen}
      role="dialog"
      onClick={() => setMenuOpen(false)}
    >
      <ul className="mobile-nav-links" role="list">
        <li>
          <Link href="/#bio" onClick={handleNavLinkClick} className={isLinkActive('/#bio') ? 'active' : ''}>
            About
          </Link>
        </li>
        <li>
          <Link href="/#work" onClick={handleNavLinkClick} className={isLinkActive('/#work') ? 'active' : ''}>
            Work
          </Link>
        </li>
        <li>
          <Link href="/#process" onClick={handleNavLinkClick} className={isLinkActive('/#process') ? 'active' : ''}>
            Process
          </Link>
        </li>
        <li>
          <Link href="/#contact" onClick={handleNavLinkClick} className={isLinkActive('/#contact') ? 'active' : ''}>
            Contact
          </Link>
        </li>
      </ul>
    </div>,
    document.body
  );

  return (
    <>
      <nav 
        id="nav" 
        className={`nav-visible ${isHome ? 'home-nav' : 'sub-nav'} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`} 
        aria-label="Main navigation"
        style={!isHome ? { opacity: 1, pointerEvents: 'all' } : {}}
      >
        {isHome ? (
          <>
            <Link href="/" className="n-logo" id="nav-logo" onClick={handleLogoClick}>
              <span className="c-b">J</span>
              <span className="c-g">U</span>
              <span className="c-r">S</span>T
              &nbsp;<span className="c-b">R</span>
              <span className="c-g">G</span>
              <span className="c-r">B</span>
            </Link>

            {/* Desktop links */}
            <ul className="n-links" role="list">
              <li>
                <Link href="/#bio" id="nav-bio" className={`rgb-hover ${isLinkActive('/#bio') ? 'active' : ''}`} onClick={handleNavLinkClick}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/#work" id="nav-work" className={`rgb-hover ${isLinkActive('/#work') ? 'active' : ''}`} onClick={handleNavLinkClick}>
                  Work
                </Link>
              </li>
              <li>
                <Link href="/#process" id="nav-process" className={`rgb-hover ${isLinkActive('/#process') ? 'active' : ''}`} onClick={handleNavLinkClick}>
                  Process
                </Link>
              </li>
              <li>
                <Link href="/#contact" id="nav-contact" className={`rgb-hover ${isLinkActive('/#contact') ? 'active' : ''}`} onClick={handleNavLinkClick}>
                  Contact
                </Link>
              </li>
            </ul>

            {/* Hamburger button */}
            <button
              className="nav-hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
              <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
              <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
            </button>
          </>
        ) : (
          <>
            <Link href="/#work" className="back-btn rgb-hover" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--fm)', fontSize: '14px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--cream)', cursor: 'none' }}>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                <path d="M5.83333 1.66666L1.5 5.99999M1.5 5.99999L5.83333 10.3333M1.5 5.99999H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Portfolio
            </Link>
            <Link href="/" className="n-logo" id="nav-logo">
              <span className="c-b">J</span>
              <span className="c-g">U</span>
              <span className="c-r">S</span>T
              &nbsp;<span className="c-b">R</span>
              <span className="c-g">G</span>
              <span className="c-r">B</span>
            </Link>
          </>
        )}
      </nav>

      {/* Portal: drawer renders at body level, escaping nav's stacking context */}
      {drawerPortal}
    </>
  );
}
