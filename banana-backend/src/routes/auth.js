const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// GET /api/auth/me - Get current user
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteBananas');
    res.json({
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      provider: user.provider,
      role: user.role,
      termsAccepted: user.termsAccepted,
      favoriteBananas: user.favoriteBananas,
      oracleQueriesRemaining: user.oracleQueriesRemaining
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
  });
});

// ========== Google OAuth ==========
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login?error=google_failed` }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&provider=google`);
  }
);

// ========== GitHub OAuth ==========
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login?error=github_failed` }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&provider=github`);
  }
);

// POST /api/auth/accept-terms - Accept terms and conditions
router.post('/accept-terms', isAuthenticated, async (req, res) => {
  try {
    const { version } = req.body;
    const user = await User.findById(req.user.id);

    user.termsAccepted = true;
    user.termsAcceptedAt = new Date();
    user.termsVersion = version || '1.0';
    await user.save();

    res.json({ 
      message: 'Terms accepted successfully',
      termsAccepted: true,
      termsVersion: user.termsVersion,
      termsAcceptedAt: user.termsAcceptedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept terms', message: error.message });
  }
});

// GET /api/auth/check-terms - Check if user has accepted terms
router.get('/check-terms', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      termsAccepted: user.termsAccepted,
      termsVersion: user.termsVersion,
      termsAcceptedAt: user.termsAcceptedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check terms status', message: error.message });
  }
});

module.exports = router;
