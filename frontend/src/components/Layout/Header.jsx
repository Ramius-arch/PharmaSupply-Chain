import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faSignOutAlt,
  faShoppingCart,
  faSearch,
  faCube,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const totalCartItems = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="header-logo-mobile">
          <Link to="/" aria-label="Go to home">
            <FontAwesomeIcon icon={faCube} className="mobile-logo-icon" />
            <span className="logo-text">PharmaSupply</span>
          </Link>
        </div>

        <div className="header-badge-pill hidden-mobile">
          <span className="pulse-dot emerald"></span>
          <span className="badge-text">Decentralized Provenance Verified</span>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Search trigger */}
        <button 
          className="header-action-btn hidden-mobile" 
          onClick={() => navigate('/products')}
          title="Search verified products"
          aria-label="Search catalog"
        >
          <FontAwesomeIcon icon={faSearch} />
          <span className="action-text">Search Drugs</span>
        </button>

        {/* Cart Quick Button */}
        <Link to="/cart" className="header-cart-btn" aria-label="View Cart">
          <FontAwesomeIcon icon={faShoppingCart} />
          {totalCartItems > 0 && (
            <span className="header-cart-badge">{totalCartItems}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <div className="user-profile-menu">
            <Link to={user?.role === 'admin' || user?.role === 'supplier' ? '/admin' : '/dashboard'} className="profile-trigger" aria-label="User profile">
              <div className="header-avatar-circle">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="user-header-text hidden-mobile">
                <span className="user-name-small">{user?.firstName || 'User'}</span>
                <span className="user-role-micro">{user?.role?.toUpperCase()}</span>
              </div>
            </Link>
            <button
              onClick={logout}
              className="logout-btn-header"
              title="Exit Session"
              aria-label="Sign out"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span className="logout-label">Exit</span>
            </button>
          </div>
        ) : (
          <div className="auth-actions-header">
            <Link to="/login" className="login-link-header">Authenticate</Link>
            <Link to="/register" className="register-link-header hidden-mobile">Join</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
