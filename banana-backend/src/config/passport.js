const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const fs = require('fs');

// Helper to get secret from file or env var
const getSecret = (envVar, filename) => {
  const secretPath = `/etc/secrets/${filename}`;
  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, 'utf8').trim();
  }
  return process.env[envVar];
};

// Get OAuth credentials from secrets or env vars
const githubClientId = getSecret('GITHUB_CLIENT_ID', 'github_client_id');
const githubClientSecret = getSecret('GITHUB_CLIENT_SECRET', 'github_client_secret');
const googleClientId = getSecret('GOOGLE_CLIENT_ID', 'google_client_id');
const googleClientSecret = getSecret('GOOGLE_CLIENT_SECRET', 'google_client_secret');

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
if (googleClientId && googleClientSecret) {
  console.log('🔐 Google OAuth enabled');
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
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
if (githubClientId && githubClientSecret) {
  console.log('🐙 GitHub OAuth enabled');
  passport.use(new GitHubStrategy({
    clientID: githubClientId,
    clientSecret: githubClientSecret,
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
