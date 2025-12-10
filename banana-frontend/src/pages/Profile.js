import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <motion.div 
          className="profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName} />
            ) : (
              <span className="avatar-fallback">
                {user.displayName?.[0] || '?'}
              </span>
            )}
          </div>
          <h1>{user.displayName}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-badges">
            <span className="badge badge-provider">
              {user.provider === 'google' ? '🔵 Google' : '⚫ GitHub'}
            </span>
            {user.termsAccepted && (
              <span className="badge badge-terms">✅ Terms Accepted</span>
            )}
          </div>
        </motion.div>

        <div className="profile-grid">
          {/* Stats Card */}
          <motion.div 
            className="profile-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3>📊 Your Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{user.favoriteBananas?.length || 0}</span>
                <span className="stat-label">Favorite Bananas</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.oracleQueriesRemaining || 10}</span>
                <span className="stat-label">Oracle Queries Left</span>
              </div>
            </div>
          </motion.div>

          {/* Favorites Card */}
          <motion.div 
            className="profile-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>🍌 Favorite Bananas</h3>
            {user.favoriteBananas?.length > 0 ? (
              <div className="favorites-list">
                {user.favoriteBananas.map((banana) => (
                  <div key={banana._id} className="favorite-item">
                    <span className="banana-icon">🍌</span>
                    <span className="banana-name">{banana.name}</span>
                    <span className={`badge badge-${banana.rarity}`}>{banana.rarity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">
                You haven't added any favorites yet. 
                Visit the Explorer to find bananas you love!
              </p>
            )}
          </motion.div>

          {/* Account Card */}
          <motion.div 
            className="profile-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>⚙️ Account</h3>
            <div className="account-info">
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Last Login</span>
                <span className="info-value">
                  {new Date(user.lastLoginAt).toLocaleString()}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span className="info-value capitalize">{user.role}</span>
              </div>
            </div>
            <button className="btn btn-secondary logout-btn" onClick={logout}>
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
