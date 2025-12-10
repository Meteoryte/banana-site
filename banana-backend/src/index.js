require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
const rateLimit = require('express-rate-limit');

// Routes
const bananaRoutes = require('./routes/banana');
const authRoutes = require('./routes/auth');
const termsRoutes = require('./routes/terms');
const oracleRoutes = require('./routes/oracle');

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://meteoryte.github.io',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all for now - tighten in production
  },
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'banana-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/banana', bananaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/oracle', oracleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Database connection and server start
const startServer = async () => {
  let dbConnected = false;
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🍌 Connected to MongoDB');
    dbConnected = true;
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.warn('⚠️  Running in limited mode - some features may not work');
    console.warn('💡 To fix: Set MONGO_URI to a valid MongoDB connection string');
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('🍌 ==========================================');
    console.log(`🍌  Banana Backend running on port ${PORT}`);
    console.log('🍌 ==========================================');
    console.log('');
    console.log(`📍 Health:  http://localhost:${PORT}/health`);
    console.log(`📚 API:     http://localhost:${PORT}/api/banana`);
    console.log(`🔐 Auth:    http://localhost:${PORT}/api/auth`);
    console.log(`📜 Terms:   http://localhost:${PORT}/api/terms`);
    console.log(`🔮 Oracle:  http://localhost:${PORT}/api/oracle`);
    console.log('');
    console.log(`📊 Status:  Database ${dbConnected ? '✅ Connected' : '❌ Not Connected'}`);
    console.log('');
  });
};

startServer();

module.exports = app;
