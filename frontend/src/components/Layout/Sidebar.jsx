import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faPills,
  faShoppingCart,
  faBoxOpen,
  faLink,
  faKey,
  faShieldAlt,
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faCube,
  faCircleCheck,
  faTimes,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const [blockHeight, setBlockHeight] = useState(1984201);

  // Subtle simulated blockchain block ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const totalCartCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

  const NavItem = ({ to, icon, label, end = false, badge = null }) => (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
        onClick={handleLinkClick}
      >
        <div className="nav-item-icon-wrapper">
          <FontAwesomeIcon icon={icon} className="nav-icon" />
        </div>
        <span className="nav-item-label">{label}</span>
        {badge !== null && badge > 0 && (
          <span className="nav-item-badge">{badge}</span>
        )}
      </NavLink>
    </li>
  );

  return (
    <aside className={`modern-sidebar ${isOpen ? 'open' : ''}`} aria-label="Main Navigation">
      {/* Brand Header */}
      <div className="sidebar-brand-section">
        <div className="brand-header-flex">
          <NavLink to="/" className="brand-logo-container" onClick={handleLinkClick}>
            <div className="brand-icon-box">
              <FontAwesomeIcon icon={faCube} className="brand-cube-icon" />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">PharmaSupply</span>
              <span className="brand-subtitle">Blockchain Trace</span>
            </div>
          </NavLink>

          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Live Network Telemetry */}
        <div className="network-pill-card">
          <div className="network-status-line">
            <span className="pulse-dot success"></span>
            <span className="network-name">Sepolia Testnet #8545</span>
          </div>
          <div className="network-sub-stats">
            <span className="network-latency">24ms Ping</span>
            <span className="network-block mono-text">#{blockHeight}</span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav-scroll">
        <div className="nav-section-group">
          <span className="nav-group-title">Public Ledger</span>
          <ul className="nav-item-list">
            <NavItem to="/" icon={faHome} label="Overview & Hero" end />
            <NavItem to="/products" icon={faPills} label="Medicine Catalog" />
          </ul>
        </div>

        {isAuthenticated && (
          <div className="nav-section-group">
            <span className="nav-group-title">Supply Chain Ops</span>
            <ul className="nav-item-list">
              <NavItem to="/cart" icon={faShoppingCart} label="Shipment Cart" badge={totalCartCount} />
              <NavItem to="/my-orders" icon={faBoxOpen} label="My Shipments" />
              <NavItem to="/blockchain-transaction" icon={faLink} label="Ledger Explorer" />
              <NavItem to="/generate-wallet" icon={faKey} label="Node Key Vault" />
            </ul>
          </div>
        )}

        {isAuthenticated && (user?.role === 'admin' || user?.role === 'supplier') && (
          <div className="nav-section-group">
            <span className="nav-group-title">Station Governance</span>
            <ul className="nav-item-list">
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `sidebar-nav-item ${isActive || isAdminRoute ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <div className="nav-item-icon-wrapper admin-icon">
                    <FontAwesomeIcon icon={faShieldAlt} className="nav-icon" />
                  </div>
                  <span className="nav-item-label">Admin Control Center</span>
                  <span className="admin-status-tag">PRO</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {!isAuthenticated && (
          <div className="nav-section-group">
            <span className="nav-group-title">Node Authentication</span>
            <ul className="nav-item-list">
              <NavItem to="/login" icon={faSignInAlt} label="Authenticate Station" />
              <NavItem to="/register" icon={faUserPlus} label="Join Network" />
            </ul>
          </div>
        )}
      </nav>

      {/* Sidebar Footer / User Profile */}
      <div className="sidebar-bottom-panel">
        {isAuthenticated ? (
          <div className="user-profile-card">
            <div className="user-card-header">
              <div className="user-avatar-circle">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="user-card-info">
                <span className="user-display-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-role-badge status-chip success">
                  <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '0.65rem' }} />
                  {user?.role || 'NODE'}
                </span>
              </div>
            </div>
            <button
              onClick={() => { logout(); handleLinkClick(); }}
              className="btn btn-outline btn-sm user-signout-btn"
              aria-label="Exit current session"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Exit Session</span>
            </button>
          </div>
        ) : (
          <div className="guest-node-banner">
            <div className="guest-node-icon">
              <FontAwesomeIcon icon={faSignInAlt} />
            </div>
            <div className="guest-node-text">
              <strong>Guest Node</strong>
              <span>Read-only telemetry</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
