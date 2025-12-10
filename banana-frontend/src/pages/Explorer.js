import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getBananas, getBananaById } from '../services/api';
import BananaCard from '../components/BananaCard';
import './Explorer.css';

const Explorer = () => {
  const [filters, setFilters] = useState({ rarity: '', taste: '' });
  const [selectedBanana, setSelectedBanana] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['bananas', filters],
    queryFn: () => getBananas(filters),
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBananaClick = async (banana) => {
    setDetailsLoading(true);
    try {
      const fullBanana = await getBananaById(banana._id);
      setSelectedBanana(fullBanana);
    } catch (error) {
      console.error('Failed to fetch banana details:', error);
      setSelectedBanana(banana);
    }
    setDetailsLoading(false);
  };

  const closeDetails = () => setSelectedBanana(null);

  return (
    <div className="explorer-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="explorer-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>🍌 Banana Explorer</h1>
          <p>Discover all the legendary banana varieties and their invention stories</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="explorer-filters glass-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="filter-group">
            <label htmlFor="rarity-filter">Rarity</label>
            <select 
              id="rarity-filter"
              value={filters.rarity}
              onChange={(e) => handleFilterChange('rarity', e.target.value)}
            >
              <option value="">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="taste-filter">Taste</label>
            <select 
              id="taste-filter"
              value={filters.taste}
              onChange={(e) => handleFilterChange('taste', e.target.value)}
            >
              <option value="">All Tastes</option>
              <option value="sweet">Sweet</option>
              <option value="tangy">Tangy</option>
              <option value="mild">Mild</option>
              <option value="rich">Rich</option>
              <option value="tropical">Tropical</option>
            </select>
          </div>

          <button 
            className="btn btn-ghost"
            onClick={() => setFilters({ rarity: '', taste: '' })}
          >
            Clear Filters
          </button>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="explorer-loading">
            <div className="spinner" />
            <p>Loading bananas...</p>
          </div>
        ) : error ? (
          <div className="explorer-error glass-card">
            <span>⚠️</span>
            <p>Failed to load bananas. Is the backend running?</p>
            <code>npm run dev</code> in banana-backend
          </div>
        ) : data?.bananas?.length === 0 ? (
          <div className="explorer-empty glass-card">
            <span>🍌</span>
            <p>No bananas found matching your filters</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setFilters({ rarity: '', taste: '' })}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="banana-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data?.bananas?.map((banana, index) => (
              <BananaCard 
                key={banana._id} 
                banana={banana} 
                onClick={() => handleBananaClick(banana)}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination Info */}
        {data?.pagination && (
          <div className="pagination-info">
            Showing {data.bananas.length} of {data.pagination.total} bananas
          </div>
        )}
      </div>

      {/* Banana Details Modal */}
      <AnimatePresence>
        {selectedBanana && (
          <motion.div 
            className="banana-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetails}
          >
            <motion.div 
              className="banana-modal glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeDetails} aria-label="Close">
                ✕
              </button>

              <div className="modal-header">
                <span className="modal-emoji">🍌</span>
                <div>
                  <h2>{selectedBanana.name}</h2>
                  <span className={`badge badge-${selectedBanana.rarity}`}>
                    {selectedBanana.rarity}
                  </span>
                </div>
              </div>

              <div className="modal-content">
                <div className="modal-meta">
                  <div className="meta-item">
                    <span className="meta-label">Origin</span>
                    <span className="meta-value">{selectedBanana.origin}</span>
                  </div>
                  {selectedBanana.yearDiscovered && (
                    <div className="meta-item">
                      <span className="meta-label">Year Discovered</span>
                      <span className="meta-value">
                        {selectedBanana.yearDiscovered < 0 
                          ? `${Math.abs(selectedBanana.yearDiscovered)} BCE`
                          : selectedBanana.yearDiscovered
                        }
                      </span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span className="meta-label">Taste</span>
                    <span className="meta-value">{selectedBanana.taste}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Color</span>
                    <span className="meta-value">{selectedBanana.color}</span>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>📜 Invention Story</h3>
                  <p>{selectedBanana.inventionStory}</p>
                </div>

                {selectedBanana.funFact && (
                  <div className="modal-section fun-fact">
                    <h3>💡 Fun Fact</h3>
                    <p>{selectedBanana.funFact}</p>
                  </div>
                )}

                {selectedBanana.nutritionFacts && (
                  <div className="modal-section">
                    <h3>🥗 Nutrition Facts</h3>
                    <div className="nutrition-grid">
                      <div className="nutrition-item">
                        <span className="nutrition-value">{selectedBanana.nutritionFacts.calories}</span>
                        <span className="nutrition-label">Calories</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-value">{selectedBanana.nutritionFacts.potassium}</span>
                        <span className="nutrition-label">Potassium</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-value">{selectedBanana.nutritionFacts.fiber}</span>
                        <span className="nutrition-label">Fiber</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-value">{selectedBanana.nutritionFacts.sugar}</span>
                        <span className="nutrition-label">Sugar</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedBanana.culturalSignificance && (
                  <div className="modal-section">
                    <h3>🌍 Cultural Significance</h3>
                    <p>{selectedBanana.culturalSignificance}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explorer;
