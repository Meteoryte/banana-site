import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRandomBanana } from '../services/api';
import BananaCard from '../components/BananaCard';
import './Home.css';

const Home = () => {
  const [featuredBanana, setFeaturedBanana] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBanana = async () => {
      try {
        const banana = await getRandomBanana();
        setFeaturedBanana(banana);
      } catch (error) {
        console.error('Failed to fetch featured banana:', error);
      }
      setLoading(false);
    };

    fetchFeaturedBanana();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          className="hero-content container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={itemVariants}>
            ✨ Discover the Mythical Origins
          </motion.div>
          
          <motion.h1 className="hero-title" variants={itemVariants}>
            The <span className="highlight">Invention</span> of the Banana
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={itemVariants}>
            Explore extraordinary tales of how bananas came to exist. 
            Consult the AI Oracle. Join a community of banana enthusiasts.
          </motion.p>
          
          <motion.div className="hero-actions" variants={itemVariants}>
            <Link to="/explorer" className="btn btn-primary">
              🍌 Explore Bananas
            </Link>
            <Link to="/oracle" className="btn btn-secondary">
              🔮 Ask the Oracle
            </Link>
          </motion.div>

          <motion.div className="hero-stats" variants={itemVariants}>
            <div className="stat">
              <span className="stat-value">10+</span>
              <span className="stat-label">Legendary Varieties</span>
            </div>
            <div className="stat">
              <span className="stat-value">∞</span>
              <span className="stat-label">Invention Stories</span>
            </div>
            <div className="stat">
              <span className="stat-value">AI</span>
              <span className="stat-label">Powered Oracle</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Bananas Animation */}
        <div className="hero-decoration">
          <span className="floating-banana" style={{ '--delay': '0s', '--x': '10%', '--y': '20%' }}>🍌</span>
          <span className="floating-banana" style={{ '--delay': '0.5s', '--x': '85%', '--y': '30%' }}>🍌</span>
          <span className="floating-banana" style={{ '--delay': '1s', '--x': '70%', '--y': '70%' }}>🍌</span>
          <span className="floating-banana" style={{ '--delay': '1.5s', '--x': '20%', '--y': '75%' }}>🍌</span>
        </div>
      </section>

      {/* Featured Banana Section */}
      <section className="featured-section container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Today's Featured Banana</h2>
          <p>Discover a new banana invention story every visit</p>
        </motion.div>

        <div className="featured-content">
          {loading ? (
            <div className="loading-placeholder glass-card">
              <div className="spinner" />
              <p>Loading today's featured banana...</p>
            </div>
          ) : featuredBanana ? (
            <motion.div 
              className="featured-banana"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="featured-card glass-card">
                <div className="featured-header">
                  <span className="featured-emoji">🍌</span>
                  <span className={`badge badge-${featuredBanana.rarity}`}>
                    {featuredBanana.rarity}
                  </span>
                </div>
                <h3>{featuredBanana.name}</h3>
                <p className="featured-origin">{featuredBanana.origin}</p>
                <p className="featured-story">{featuredBanana.inventionStory}</p>
                {featuredBanana.funFact && (
                  <div className="featured-fun-fact">
                    <span className="fun-fact-icon">💡</span>
                    <p>{featuredBanana.funFact}</p>
                  </div>
                )}
                <Link to="/explorer" className="btn btn-primary">
                  Discover More Bananas
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="no-banana glass-card">
              <p>🍌 No bananas found. The database needs seeding!</p>
              <p className="hint">Run <code>node src/utils/seed.js</code> in the backend</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>What Awaits You</h2>
            <p>Dive into the world of banana mythology</p>
          </motion.div>

          <div className="features-grid">
            <motion.div 
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="feature-icon">📚</span>
              <h3>Legendary Stories</h3>
              <p>Explore the mythical origins of bananas from across time and space. Each variety has its own unique invention tale.</p>
            </motion.div>

            <motion.div 
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="feature-icon">🔮</span>
              <h3>AI Oracle</h3>
              <p>Consult the mystical Banana Oracle powered by advanced AI. Ask any banana-related question and receive wisdom.</p>
            </motion.div>

            <motion.div 
              className="feature-card glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="feature-icon">⭐</span>
              <h3>Collect Favorites</h3>
              <p>Build your personal collection of favorite banana varieties. Track the legendary ones you've discovered.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Discover Banana Secrets?</h2>
            <p>Sign in with Google or GitHub to unlock the full experience including the AI Oracle and favorites collection.</p>
            <div className="cta-actions">
              <Link to="/login" className="btn btn-primary">
                Get Started Free
              </Link>
              <Link to="/terms" className="btn btn-ghost">
                Read Terms & Conditions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
