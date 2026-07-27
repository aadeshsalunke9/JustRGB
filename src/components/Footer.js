'use client';
import Link from 'next/link';

export default function Footer() {
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="container footer-container">
        
        {/* Left Side: Headline & Mail link */}
        <div className="footer-left">
          <h2 className="footer-headline">Let's shape your frames.</h2>
          <a href="mailto:aadeshsalunke9@gmail.com" className="footer-email">
            aadeshsalunke9@gmail.com
          </a>
          <a href="tel:+919960212118" style={{ fontSize: '1.05rem', color: 'var(--parchment-muted)', marginTop: '8px', display: 'block' }}>
            +91 9960212118
          </a>
          <span style={{ fontSize: '0.9rem', color: 'var(--parchment-muted)', opacity: 0.8, marginTop: '4px', display: 'block' }}>
            Pune, Maharashtra, India
          </span>
        </div>

        {/* Right Side: Social links */}
        <div className="footer-right">
          <span className="footer-lbl">Connect</span>
          <ul className="footer-links" role="list">
            <li>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link-item"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-link-item"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright info */}
        <div className="copyright">
          &copy; {new Date().getFullYear()} Aadesh Salunke. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}
