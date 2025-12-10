import React from 'react';
import { motion } from 'framer-motion';
import './BananaCard.css';

const BananaCard = ({ banana, onClick }) => {
  const rarityColors = {
    common: 'var(--text-secondary)',
    uncommon: 'var(--tropical-green)',
    rare: 'var(--ocean-blue)',
    legendary: 'var(--banana-yellow)'
  };

  return (
    <motion.div 
      className={`banana-card glass-card rarity-${banana.rarity}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="banana-card-header">
        <span className="banana-emoji">🍌</span>
        <span 
          className={`badge badge-${banana.rarity}`}
          style={{ '--rarity-color': rarityColors[banana.rarity] }}
        >
          {banana.rarity}
        </span>
      </div>

      <div className="banana-card-content">
        <h3 className="banana-name">{banana.name}</h3>
        <p className="banana-origin">
          <span className="label">Origin:</span> {banana.origin}
        </p>
        <p className="banana-story">
          {banana.inventionStory?.substring(0, 120)}...
        </p>
      </div>

      <div className="banana-card-footer">
        <div className="banana-tags">
          <span className="tag tag-taste">{banana.taste}</span>
          <span className="tag tag-color">{banana.color}</span>
        </div>
        <button className="read-more-btn">Read Story →</button>
      </div>
    </motion.div>
  );
};

export default BananaCard;
