const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false // Don't return password by default
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  providerId: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  termsAccepted: {
    type: Boolean,
    default: false
  },
  termsAcceptedAt: {
    type: Date
  },
  termsVersion: {
    type: String
  },
  favoriteBananas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Banana'
  }],
  oracleQueriesRemaining: {
    type: Number,
    default: 10 // Free tier limit
  },
  oracleQueriesResetAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = Date.now();
  return this.save();
};

// Reset oracle queries (daily reset)
userSchema.methods.resetOracleQueries = function() {
  const now = new Date();
  const resetTime = new Date(this.oracleQueriesResetAt);
  resetTime.setDate(resetTime.getDate() + 1);

  if (now >= resetTime) {
    this.oracleQueriesRemaining = 10;
    this.oracleQueriesResetAt = now;
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('User', userSchema);
