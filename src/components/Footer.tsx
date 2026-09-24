import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        
        {/* Brand & Socials */}
        <div className="footer-brand">
          <div className="brand" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Trust<span className="text-blue">Space</span>
          </div>
          <div className="social-icons" style={{ display: 'flex', gap: '1.5rem', marginTop: 'auto' }}>
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', flex: 1, justifyContent: 'end' }}>
          
          <div className="link-column">
            <h4>Popular Cities</h4>
            <Link to="/cities">Mumbai</Link>
            <Link to="/cities">Chennai</Link>
            <Link to="/cities">Banglore</Link>
          </div>

          <div className="link-column">
            <h4>Property Types</h4>
            <Link to="/properties">Hall</Link>
            <Link to="/properties">Banquets</Link>
          </div>

          <div className="link-column">
            <h4>About Us</h4>
            <Link to="/about">Contact Us</Link>
            <Link to="/privacy">Privacy Policies</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;