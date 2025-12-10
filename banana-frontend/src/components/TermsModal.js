import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getTerms } from '../services/api';
import './TermsModal.css';

const TermsModal = ({ required = false, onClose }) => {
  const { acceptTerms } = useAuth();
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await getTerms();
        setTerms(data);
      } catch (error) {
        console.error('Failed to fetch terms:', error);
      }
      setLoading(false);
    };

    fetchTerms();
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    setAccepting(true);
    const result = await acceptTerms(terms?.version);
    if (result.success && onClose) {
      onClose();
    }
    setAccepting(false);
  };

  if (loading) {
    return (
      <div className="terms-modal-overlay">
        <div className="terms-modal glass-card">
          <div className="terms-loading">
            <div className="spinner" />
            <p>Loading Terms & Conditions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="terms-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="terms-modal glass-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="terms-modal-header">
          <h2>🍌 Terms & Conditions</h2>
          <p className="terms-version">Version {terms?.version} • Last updated: {terms?.lastUpdated}</p>
        </div>

        <div className="terms-modal-content" onScroll={handleScroll}>
          {terms?.sections?.map((section) => (
            <div key={section.id} className="terms-section">
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          ))}
        </div>

        <div className="terms-modal-footer">
          {required && !scrolledToBottom && (
            <p className="scroll-hint">Please scroll to read all terms before accepting</p>
          )}
          
          <div className="terms-actions">
            {!required && onClose && (
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            )}
            <button 
              className="btn btn-primary"
              onClick={handleAccept}
              disabled={required && !scrolledToBottom || accepting}
            >
              {accepting ? 'Accepting...' : 'I Accept the Terms'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TermsModal;
