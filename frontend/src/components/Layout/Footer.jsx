import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCube,
  faShieldAlt,
  faLink,
  faBolt,
  faLock,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="modern-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-icon-box">
                <FontAwesomeIcon icon={faCube} />
              </div>
              <span className="footer-brand-name">PharmaSupply</span>
            </div>
            <p className="footer-tagline">
              Autonomous cryptographic provenance, anti-counterfeit batch verification, and real-time smart logistics for global pharmaceuticals.
            </p>
            <div className="footer-standards">
              <span className="standard-chip">
                <FontAwesomeIcon icon={faShieldAlt} /> DSCSA Compliant
              </span>
              <span className="standard-chip">
                <FontAwesomeIcon icon={faLock} /> 21 CFR Part 11
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-list">
              <li><Link to="/">Network Overview</Link></li>
              <li><Link to="/products">Medicine Catalog</Link></li>
              <li><Link to="/blockchain-transaction">Ledger Explorer</Link></li>
              <li><Link to="/generate-wallet">Node Key Generator</Link></li>
            </ul>
          </div>

          {/* Network Telemetry */}
          <div className="footer-telemetry-col">
            <h4 className="footer-heading">Ledger Architecture</h4>
            <div className="telemetry-box">
              <div className="telemetry-row">
                <span className="telemetry-label">Smart Contract:</span>
                <span className="telemetry-val mono-text">0x5FbD...aa3B</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">Consensus:</span>
                <span className="telemetry-val">PoA / EVM Hardhat</span>
              </div>
              <div className="telemetry-row">
                <span className="telemetry-label">State:</span>
                <span className="telemetry-val text-emerald">
                  <span className="pulse-dot success" style={{ width: '6px', height: '6px', marginRight: '4px' }}></span>
                  100% Synchronized
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} PharmaSupply Blockchain Network. Built for transparent, tamper-proof healthcare.
          </p>
          <div className="footer-bottom-links">
            <Link to="/products">Catalog</Link>
            <span>·</span>
            <Link to="/blockchain-transaction">Transactions</Link>
            <span>·</span>
            <span className="mono-text" style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>v2.4.0-kinetic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
