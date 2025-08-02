import React from 'react';
import './Footer.css'; // Don't forget to import the CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo Section */}
        <div className="footer-logo">
          <h2>BugPilot</h2>
          <p>Your go-to bug tracking solution.</p>
        </div>
        <br/>
        {/* Links Section */}
        <div className="footer-links">
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Team</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Report Bug</a></li>
            </ul>
          </div>

          <div>
            <h4>Social</h4>
            <ul>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BugPilot. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
