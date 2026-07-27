'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e, targetId) => {
    if (isHome && targetId) {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <div className="nav-container">
        {/* Left: Brand Logo */}
        <Link href="/" className="nav-logo" onClick={(e) => handleNavLinkClick(e, 'hero')}>
          AADESH SALUNKE
        </Link>

        {/* Right: Flat Links */}
        <ul className="nav-links" role="list">
          <li>
            <Link 
              href="/#showreel" 
              onClick={(e) => handleNavLinkClick(e, 'showreel')} 
              className="nav-link-item"
            >
              Showreel
            </Link>
          </li>
          <li>
            <Link 
              href="/#work" 
              onClick={(e) => handleNavLinkClick(e, 'work')} 
              className="nav-link-item"
            >
              Work
            </Link>
          </li>
          <li>
            <Link 
              href="/#about" 
              onClick={(e) => handleNavLinkClick(e, 'about')} 
              className="nav-link-item"
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              href="/#contact" 
              onClick={(e) => handleNavLinkClick(e, 'contact')} 
              className="nav-link-item"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
