const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  try {
    // Check for session-based authentication (Passport)
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }

    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Please log in to access this resource' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token', 
        message: 'Please log in again' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired', 
        message: 'Please log in again' 
      });
    }
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to require terms acceptance
const requireTermsAccepted = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.termsAccepted) {
      return res.status(403).json({
        error: 'Terms not accepted',
        message: 'You must accept the Terms and Conditions to use this feature',
        termsRequired: true
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify terms acceptance' });
  }
};

// Middleware to require admin role
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization error' });
  }
};

module.exports = {
  isAuthenticated,
  requireTermsAccepted,
  isAdmin
};
