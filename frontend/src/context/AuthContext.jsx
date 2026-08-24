import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

const GUEST_DEMO_USER = {
  _id: 'demo-operator-guest-01',
  firstName: 'Demo',
  lastName: 'Operator',
  email: 'operator.demo@pharmasupply.io',
  role: 'admin',
  isGuestDemo: true,
  organization: 'Global Supply Chain Demonstrator Node',
  token: 'mock-jwt-demo-operator-token-session-sandboxed',
};

function AuthProvider({ children }) {
  // Load real authenticated user if available, otherwise default to full-access Demo Operator
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    return storedUser || GUEST_DEMO_USER;
  });

  const [initialLoading, setInitialLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Synchronize on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser(GUEST_DEMO_USER);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
      return true;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    try {
      const response = await authService.register(userData);
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.clear(); // Clear all sandboxed session changes
    setUser(GUEST_DEMO_USER); // Reset back to default clean Demo Operator
  };

  const resetDemoSession = () => {
    sessionStorage.clear();
    setUser(GUEST_DEMO_USER);
    window.location.reload();
  };

  const isAuthenticated = !!user;
  const isGuestDemo = Boolean(user?.isGuestDemo);
  const loading = initialLoading || authLoading;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        isAuthenticated, 
        isGuestDemo,
        resetDemoSession 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
