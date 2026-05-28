import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name required';
    if (!formData.lastName) newErrors.lastName = 'Last name required';
    if (!formData.email) newErrors.email = 'Valid email required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Keys do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Node Registration Successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (error) => `
    h-11 px-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}
  `;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-10 animate-fade-in">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-card">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Join Network</h1>
          <p className="text-slate-500">Register new station on the blockchain</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">First Name</label>
              <input 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                placeholder="John" 
                className={inputClasses(errors.firstName)}
              />
              {errors.firstName && <p className="text-xs text-red-500 font-medium">{errors.firstName}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <input 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Doe" 
                className={inputClasses(errors.lastName)}
              />
              {errors.lastName && <p className="text-xs text-red-500 font-medium">{errors.lastName}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Communication ID (Email)</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="node@pharma.net" 
              className={inputClasses(errors.email)}
            />
            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Security Key (Password)</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••" 
              className={inputClasses(errors.password)}
            />
            {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Confirm Security Key</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="••••••••" 
              className={inputClasses(errors.confirmPassword)}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full h-12 mt-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            disabled={loading}
          >
            {loading ? 'Processing Node ID...' : 'Initialize Station'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Already have a node? <Link to="/login" className="text-primary-600 font-bold hover:underline">Authenticate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
