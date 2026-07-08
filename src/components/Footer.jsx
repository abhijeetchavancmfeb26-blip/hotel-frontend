import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h5>HMS</h5>
            <p style={{ fontSize: '0.85rem' }}>Your trusted hotel management platform.</p>
          </div>
          <div>
            <h5>Quick Links</h5>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div>
            <h5>Developers</h5>
            <ul className="footer-dev-list">
              <li>Abhijeet Popat Chavan</li>
              <li>Kiran Santosh Hajare</li>
              <li>Vaibhav Pandharinath Shirsath</li>
              <li>Lekha Sanjay Dighekar</li>
              <li>Swati Subhash Shelke</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} HMS. Built with Spring Boot &amp; React.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
