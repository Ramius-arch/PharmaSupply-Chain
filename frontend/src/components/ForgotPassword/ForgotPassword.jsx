import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../api/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faEnvelope,
  faArrowLeft,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your station email address.');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success(`If an active node exists, a reset link was dispatched to ${email}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container container animate-fade-in">
      <div className="auth-glass-card card animate-scale-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <span className="section-eyebrow">Credential Recovery</span>
          <h1 className="auth-title">Reset Security Key</h1>
          <p className="auth-subtitle">
            Enter your verified node communication ID to receive an encrypted reset token.
          </p>
        </div>

        {sent ? (
          <div className="reset-sent-notice animate-scale-in">
            <h4 className="text-emerald font-bold">Recovery Token Dispatched</h4>
            <p>
              Check your inbox for <strong>{email}</strong>. Follow the instructions to reset your security credentials.
            </p>
            <Link to="/login" className="btn btn-outline" style={{ width: '100%', marginTop: '16px' }}>
              Return to Station Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Station Identity (Email)</label>
              <div className="input-icon-wrap">
                <FontAwesomeIcon icon={faEnvelope} className="input-inner-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. node@pharma.net"
                  className="input-with-icon"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              <span>{loading ? 'Transmitting Token...' : 'Send Recovery Token'}</span>
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p className="auth-footer-text">
            <Link to="/login" className="auth-footer-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
