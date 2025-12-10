import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('banana_token');
      if (token) {
        try {
          api.setToken(token);
          const userData = await api.get('/auth/me');
          setUser(userData);
          setTermsAccepted(userData.termsAccepted);
        } catch (error) {
          console.error('Auth init error:', error);
          localStorage.removeItem('banana_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token, provider) => {
    try {
      localStorage.setItem('banana_token', token);
      api.setToken(token);
      const userData = await api.get('/auth/me');
      setUser(userData);
      setTermsAccepted(userData.termsAccepted);
      return { success: true };
    } catch (error) {
      localStorage.removeItem('banana_token');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('banana_token');
    setUser(null);
    setTermsAccepted(false);
  };

  const acceptTerms = async (version) => {
    try {
      await api.post('/auth/accept-terms', { version });
      setTermsAccepted(true);
      if (user) {
        setUser({ ...user, termsAccepted: true });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    termsAccepted,
    login,
    logout,
    acceptTerms,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
