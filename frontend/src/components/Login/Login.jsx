import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHalved,
  faEye,
  faEyeSlash,
  faLock,
  faEnvelope,
  faArrowRight,
  faCube,
} from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both node identifier and security key.');
      return;
    }
    try {
      await login(email, password);
      navigate('/');
      toast.success('Access Granted - Node Handshake Established');
    } catch (error) {
      toast.error(error.message || 'Authentication failed. Verify credentials.');
    }
  };

  return (
    <div className="auth-page-container container animate-fade-in">
      <div className="auth-glass-card card animate-scale-in">
        {/* Header Lockup */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <FontAwesomeIcon icon={faShieldHalved} />
          </div>
          <span className="section-eyebrow">Zero-Trust Node Security</span>
          <h1 className="auth-title">Station Authentication</h1>
          <p className="auth-subtitle">
            Sign in with your registered station identity to access decentralized pharmaceutical logs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Station Identity (Email)</label>
            <div className="input-icon-wrap">
              <FontAwesomeIcon icon={faEnvelope} className="input-inner-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. pharmacist@hospital.net"
                className="input-with-icon"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-flex-row">
              <label htmlFor="password">Station Security Key</label>
              <Link to="/forgot-password" className="forgot-link">Recover Key?</Link>
            </div>
            <div className="input-icon-wrap">
              <FontAwesomeIcon icon={faLock} className="input-inner-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-with-icon input-with-toggle"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading}
          >
            <span>{loading ? 'Validating Node Signature...' : 'Establish Session'}</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            New node station in the network?{' '}
            <Link to="/register" className="auth-footer-link">Register Station</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
