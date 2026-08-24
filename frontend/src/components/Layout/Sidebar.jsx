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
  faChevronLeft,
  faChevronRight,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, isCollapsed, onToggleCollapse, onClose }) => {
  const { user, isAuthenticated, logout, isGuestDemo, resetDemoSession } = useContext(AuthContext);
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
        title={isCollapsed ? label : undefined}
      >
        <div className="nav-item-icon-wrapper">
          <FontAwesomeIcon icon={icon} className="nav-icon" />
          {isCollapsed && badge !== null && badge > 0 && (
            <span className="rail-badge-dot">{badge}</span>
          )}
        </div>
        <span className="nav-item-label">{label}</span>
        {!isCollapsed && badge !== null && badge > 0 && (
          <span className="nav-item-badge">{badge}</span>
        )}
      </NavLink>
    </li>
  );

  return (
    <aside 
      className={`modern-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`} 
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-brand-section">
        <div className="brand-header-flex">
          <NavLink to="/" className="brand-logo-container" onClick={handleLinkClick} title="PharmaSupply Platform">
            <div className="brand-icon-box">
              <FontAwesomeIcon icon={faCube} className="brand-cube-icon" />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">PharmaSupply</span>
              <span className="brand-subtitle">Blockchain Trace</span>
            </div>
          </NavLink>

          {/* Desktop Collapse Toggle Button (Emil Kowalski Tactile Spring) */}
          <button 
            type="button"
            className="sidebar-collapse-btn hidden-mobile" 
            onClick={onToggleCollapse} 
            title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} className="collapse-icon" />
          </button>

          {/* Mobile Close Button */}
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Live Network Telemetry */}
        <div className="network-pill-card">
          <div className="network-status-line">
            <span className="pulse-dot success"></span>
            <span className="network-name">Sepolia Testnet</span>
          </div>
          <div className="network-sub-stats">
            <span className="network-latency">24ms</span>
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

        <div className="nav-section-group">
          <span className="nav-group-title">Supply Chain Ops</span>
          <ul className="nav-item-list">
            <NavItem to="/cart" icon={faShoppingCart} label="Shipment Cart" badge={totalCartCount} />
            <NavItem to="/my-orders" icon={faBoxOpen} label="My Shipments" />
            <NavItem to="/blockchain-transaction" icon={faLink} label="Ledger Explorer" />
            <NavItem to="/generate-wallet" icon={faKey} label="Node Key Vault" />
          </ul>
        </div>

        <div className="nav-section-group">
          <span className="nav-group-title">Station Governance</span>
          <ul className="nav-item-list">
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => `sidebar-nav-item ${isActive || isAdminRoute ? 'active' : ''}`}
                onClick={handleLinkClick}
                title={isCollapsed ? "Admin Control Center" : undefined}
              >
                <div className="nav-item-icon-wrapper admin-icon">
                  <FontAwesomeIcon icon={faShieldAlt} className="nav-icon" />
                </div>
                <span className="nav-item-label">Admin Control Center</span>
                <span className="admin-status-tag">DEMO</span>
              </NavLink>
            </li>
          </ul>
        </div>

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
        <div className="user-profile-card">
          <div className="user-card-header">
            <div className="user-avatar-circle" title={`${user?.firstName} ${user?.lastName} (${isGuestDemo ? 'Demo Operator' : user?.role})`}>
              {user?.firstName?.charAt(0) || 'D'}
            </div>
            <div className="user-card-info">
              <span className="user-display-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-role-badge status-chip success">
                <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '0.65rem' }} />
                {isGuestDemo ? 'DEMO ACCESS' : user?.role || 'NODE'}
              </span>
            </div>
          </div>
          
          {isGuestDemo ? (
            <button
              onClick={resetDemoSession}
              className="btn btn-outline btn-sm user-signout-btn"
              title="Reset demonstrative session to defaults"
              aria-label="Reset session defaults"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span className="signout-text">Reset Session</span>
            </button>
          ) : (
            <button
              onClick={() => { logout(); handleLinkClick(); }}
              className="btn btn-outline btn-sm user-signout-btn"
              title="Exit current session"
              aria-label="Exit current session"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="signout-text">Exit Session</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
