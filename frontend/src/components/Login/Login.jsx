import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await login(email, password);
      navigate('/');
      toast.success('Access Granted - Session Initialized');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-10 animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-card">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">PharmaSupply</h1>
          <p className="text-slate-500">Secure Node Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Node ID (Email)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@pharma.net"
              className="h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">Security Key (Password)</label>
              <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Recover Key?</Link>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full h-12 mt-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            disabled={loading}
          >
            {loading ? 'Verifying Credentials...' : 'Authenticate'}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            New node cluster? <Link to="/register" className="text-primary-600 font-bold hover:underline">Register Station</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
