const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.id, provider: 'google' },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // Update provider info if needed
        if (user.provider !== 'google') {
          user.provider = 'google';
          user.providerId = profile.id;
        }
        await user.updateLastLogin();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        email: profile.emails[0].value,
        displayName: profile.displayName,
        avatar: profile.photos[0]?.value,
        provider: 'google',
        providerId: profile.id
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Get primary email from GitHub
      const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

      // Check if user exists
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.id, provider: 'github' },
          { email: email }
        ]
      });

      if (user) {
        if (user.provider !== 'github') {
          user.provider = 'github';
          user.providerId = profile.id;
        }
        await user.updateLastLogin();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        email: email,
        displayName: profile.displayName || profile.username,
        avatar: profile.photos[0]?.value,
        provider: 'github',
        providerId: profile.id
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

module.exports = passport;
