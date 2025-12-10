import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand */}
          <div className="footer-brand">
            <span className="footer-logo">🍌</span>
            <h4>The Invention of the Banana</h4>
            <p>Discover the extraordinary tales of how bananas came to be.</p>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div className="footer-column">
              <h5>Explore</h5>
              <Link to="/">Home</Link>
              <Link to="/explorer">Banana Explorer</Link>
              <Link to="/oracle">AI Oracle</Link>
            </div>

            <div className="footer-column">
              <h5>Legal</h5>
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/terms#privacy">Privacy Policy</Link>
            </div>

            <div className="footer-column">
              <h5>Connect</h5>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {currentYear} The Invention of the Banana. All rights reserved.</p>
          <p className="footer-disclaimer">
            All banana invention stories are fictional and for entertainment purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
