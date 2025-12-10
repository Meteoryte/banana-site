import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthCallback.css';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => navigate('/login?error=' + error), 2000);
        return;
      }

      if (!token) {
        setStatus('error');
        setMessage('No authentication token received');
        setTimeout(() => navigate('/login?error=no_token'), 2000);
        return;
      }

      try {
        setMessage(`Logging in with ${provider}...`);
        const result = await login(token, provider);

        if (result.success) {
          setStatus('success');
          setMessage('Welcome! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setStatus('error');
          setMessage(result.error || 'Login failed');
          setTimeout(() => navigate('/login?error=login_failed'), 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred');
        setTimeout(() => navigate('/login?error=unexpected'), 2000);
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="auth-callback-page">
      <div className="callback-card glass-card">
        <div className={`callback-icon ${status}`}>
          {status === 'processing' && <div className="spinner" />}
          {status === 'success' && <span>✓</span>}
          {status === 'error' && <span>✕</span>}
        </div>
        <h2>{status === 'success' ? 'Success!' : status === 'error' ? 'Oops!' : 'Almost there...'}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
