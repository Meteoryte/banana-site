const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Banana = require('../models/Banana');
const { isAuthenticated } = require('../middleware/auth');
const { mockBananas, getRandomMockBanana, filterMockBananas, getMockBananaById } = require('../utils/mockData');

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/banana - Get all bananas
router.get('/', async (req, res) => {
  try {
    const { rarity, taste, limit = 20, page = 1 } = req.query;
    
    // Use mock data if DB not connected
    if (!isDbConnected()) {
      const filtered = filterMockBananas({ rarity, taste });
      return res.json({
        bananas: filtered,
        pagination: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 },
        _demo: true
      });
    }

    const query = {};
    if (rarity) query.rarity = rarity;
    if (taste) query.taste = taste;

    const bananas = await Banana.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Banana.countDocuments(query);

    res.json({
      bananas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    // Fallback to mock data on error
    const filtered = filterMockBananas(req.query);
    res.json({
      bananas: filtered,
      pagination: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 },
      _demo: true
    });
  }
});

// GET /api/banana/random - Get a random banana
router.get('/random', async (req, res) => {
  try {
    // Use mock data if DB not connected
    if (!isDbConnected()) {
      return res.json({ ...getRandomMockBanana(), _demo: true });
    }

    const banana = await Banana.getRandom();
    if (!banana) {
      return res.json({ ...getRandomMockBanana(), _demo: true });
    }
    res.json(banana);
  } catch (error) {
    // Fallback to mock data on error
    res.json({ ...getRandomMockBanana(), _demo: true });
  }
});

// GET /api/banana/:id - Get banana by ID
router.get('/:id', async (req, res) => {
  try {
    // Check for mock ID first
    if (req.params.id.startsWith('mock-')) {
      const mockBanana = getMockBananaById(req.params.id);
      if (mockBanana) return res.json({ ...mockBanana, _demo: true });
    }

    // Use mock data if DB not connected
    if (!isDbConnected()) {
      const mockBanana = getMockBananaById(req.params.id) || getRandomMockBanana();
      return res.json({ ...mockBanana, _demo: true });
    }

    const banana = await Banana.findById(req.params.id);
    if (!banana) {
      return res.status(404).json({ error: 'Banana not found' });
    }
    res.json(banana);
  } catch (error) {
    const mockBanana = getMockBananaById(req.params.id) || getRandomMockBanana();
    res.json({ ...mockBanana, _demo: true });
  }
});

// POST /api/banana - Create new banana (authenticated)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const banana = new Banana(req.body);
    await banana.save();
    res.status(201).json(banana);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create banana', message: error.message });
  }
});

// PUT /api/banana/:id - Update banana (authenticated)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const banana = await Banana.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!banana) {
      return res.status(404).json({ error: 'Banana not found' });
    }
    res.json(banana);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update banana', message: error.message });
  }
});

// DELETE /api/banana/:id - Delete banana (authenticated)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const banana = await Banana.findByIdAndDelete(req.params.id);
    if (!banana) {
      return res.status(404).json({ error: 'Banana not found' });
    }
    res.json({ message: 'Banana deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete banana', message: error.message });
  }
});

// POST /api/banana/:id/favorite - Add banana to favorites
router.post('/:id/favorite', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    const bananaId = req.params.id;

    if (!user.favoriteBananas.includes(bananaId)) {
      user.favoriteBananas.push(bananaId);
      await user.save();
    }

    res.json({ message: 'Banana added to favorites', favorites: user.favoriteBananas });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite', message: error.message });
  }
});

// DELETE /api/banana/:id/favorite - Remove banana from favorites
router.delete('/:id/favorite', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    user.favoriteBananas = user.favoriteBananas.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: 'Banana removed from favorites', favorites: user.favoriteBananas });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite', message: error.message });
  }
});

module.exports = router;
