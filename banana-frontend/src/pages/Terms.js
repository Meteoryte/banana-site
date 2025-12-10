import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTerms } from '../services/api';
import './Terms.css';

const Terms = () => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('acceptance');

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

  if (loading) {
    return (
      <div className="terms-page">
        <div className="container">
          <div className="terms-loading">
            <div className="spinner" />
            <p>Loading Terms & Conditions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terms-page">
      <div className="container">
        <motion.div 
          className="terms-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>📜 Terms & Conditions</h1>
          <p className="terms-meta">
            Version {terms?.version} • Last updated: {terms?.lastUpdated}
          </p>
        </motion.div>

        <div className="terms-layout">
          {/* Table of Contents */}
          <motion.nav 
            className="terms-nav glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Contents</h3>
            <ul>
              {terms?.sections?.map((section) => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`}
                    className={activeSection === section.id ? 'active' : ''}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Content */}
          <motion.div 
            className="terms-content glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Summary Box */}
            {terms?.summary && (
              <div className="terms-summary">
                <h3>📋 Summary</h3>
                <p>{terms.summary}</p>
              </div>
            )}

            {/* Sections */}
            {terms?.sections?.map((section) => (
              <section 
                key={section.id} 
                id={section.id}
                className="terms-section"
              >
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </section>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
