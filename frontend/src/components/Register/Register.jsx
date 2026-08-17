import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleNodes,
  faEnvelope,
  faLock,
  faUser,
  faArrowRight,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.email.trim()) newErrors.email = 'Valid email required';
    if (formData.password.length < 8) newErrors.password = 'Min 8 characters required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Security keys do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Node Station Registration Successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Try another identifier.');
    }
  };

  return (
    <div className="auth-page-container container animate-fade-in">
      <div className="auth-glass-card register-wide card animate-scale-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-badge">
            <FontAwesomeIcon icon={faCircleNodes} />
          </div>
          <span className="section-eyebrow">Decentralized Onboarding</span>
          <h1 className="auth-title">Register Node Station</h1>
          <p className="auth-subtitle">
            Join the cryptographic pharmaceutical network as an authorized receiver or supplier.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="grid-2">
            <div className="input-group">
              <label>First Name</label>
              <div className="input-icon-wrap">
                <FontAwesomeIcon icon={faUser} className="input-inner-icon" />
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Dr. Sarah"
                  className="input-with-icon"
                  required
                />
              </div>
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <div className="input-icon-wrap">
                <FontAwesomeIcon icon={faUser} className="input-inner-icon" />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Jenkins"
                  className="input-with-icon"
                  required
                />
              </div>
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="input-group">
            <label>Station Communication ID (Email)</label>
            <div className="input-icon-wrap">
              <FontAwesomeIcon icon={faEnvelope} className="input-inner-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="s.jenkins@stjude.org"
                className="input-with-icon"
                required
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label>Security Key</label>
              <div className="input-icon-wrap">
                <FontAwesomeIcon icon={faLock} className="input-inner-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-with-icon input-with-toggle"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="input-group">
              <label>Confirm Security Key</label>
              <div className="input-icon-wrap">
                <FontAwesomeIcon icon={faLock} className="input-inner-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-with-icon"
                  required
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading}
          >
            <span>{loading ? 'Minting Station Identity...' : 'Initialize Station On-Chain'}</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have a registered node?{' '}
            <Link to="/login" className="auth-footer-link">Authenticate Session</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
