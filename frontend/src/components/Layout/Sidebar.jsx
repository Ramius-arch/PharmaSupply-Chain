import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h1 className="logo">PharmaNet</h1>
          <div className="system-status">
            <span className="pulse"></span> Active Node
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <span className="group-label">Gateway</span>
            <ul>
              <li><a href="https://quixora.netlify.app" className="nav-link">🌐 Main Site</a></li>
              <li><Link to="/" className="nav-link" onClick={onClose}>🏠 Home</Link></li>
              <li><Link to="/products" className="nav-link" onClick={onClose}>💊 Products</Link></li>
            </ul>
          </div>

          {isAuthenticated && (
            <div className="nav-group">
              <span className="group-label">Operations</span>
              <ul>
                <li><Link to="/cart" className="nav-link" onClick={onClose}>🛒 Shipment Cart</Link></li>
                <li><Link to="/my-orders" className="nav-link" onClick={onClose}>📦 My Orders</Link></li>
                <li><Link to="/blockchain-transaction" className="nav-link" onClick={onClose}>⛓️ Ledger Log</Link></li>
                <li><Link to="/generate-wallet" className="nav-link" onClick={onClose}>🔑 Node Key</Link></li>
              </ul>
            </div>
          )}

          {isAuthenticated && (user?.role === 'admin' || user?.role === 'supplier') && (
            <div className="nav-group">
              <span className="group-label">System Admin</span>
              <ul>
                <li><Link to="/admin" className="nav-link" onClick={onClose}>🛡️ Control Center</Link></li>
              </ul>
            </div>
          )}

          {!isAuthenticated && (
            <div className="nav-group">
              <span className="group-label">Gateway</span>
              <ul>
                <li><Link to="/login" className="nav-link" onClick={onClose}>🔐 Authenticate</Link></li>
                <li><Link to="/register" className="nav-link" onClick={onClose}>📝 Register Node</Link></li>
              </ul>
            </div>
          )}
        </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <div className="user-token">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="user-name">{user.firstName} {user.lastName}</div>
                <div className="user-role">{user.role.toUpperCase()}</div>
              </div>
              <button
                onClick={logout}
                className="btn btn-outline"
                style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                Exit
              </button>
            </div>
          </div>
        ) : (
          <div className="guest-mode">Guest Mode</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

