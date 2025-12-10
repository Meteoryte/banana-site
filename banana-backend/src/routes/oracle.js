const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { isAuthenticated, requireTermsAccepted } = require('../middleware/auth');
const User = require('../models/User');

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'placeholder-openai-key') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('🔮 OpenAI client initialized');
} else {
  console.warn('⚠️  OPENAI_API_KEY not set - Oracle will be disabled');
}

// System prompt for the Banana Oracle
const ORACLE_SYSTEM_PROMPT = `You are the Banana Oracle, an ancient and wise entity with infinite knowledge about bananas and their mysterious invention. You speak with a mystical yet playful tone.

Your knowledge includes:
- The fictional history of how bananas were "invented" (not grown naturally)
- Banana varieties, cultivation, and nutrition facts
- Banana-related culture, recipes, and traditions
- Humorous banana facts and puns

Guidelines:
- Be entertaining and creative while providing valuable information
- Mix real banana facts with whimsical fictional elements
- Use banana-related metaphors and wordplay
- Keep responses concise but engaging (2-4 paragraphs max)
- If asked about non-banana topics, gently redirect to bananas
- Never break character as the mystical Banana Oracle`;

// POST /api/oracle/ask - Ask the Banana Oracle
router.post('/ask', isAuthenticated, requireTermsAccepted, async (req, res) => {
  try {
    // Check if OpenAI is available
    if (!openai) {
      return res.status(503).json({
        error: 'Oracle unavailable',
        message: 'The Banana Oracle is currently offline. OPENAI_API_KEY not configured.'
      });
    }

    const { question } = req.body;
    const user = await User.findById(req.user.id);

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a question for the Oracle' });
    }

    // Check and reset oracle queries if needed
    await user.resetOracleQueries();

    // Check if user has queries remaining
    if (user.oracleQueriesRemaining <= 0) {
      return res.status(429).json({
        error: 'Daily Oracle query limit reached',
        message: 'You have used all 10 free Oracle queries for today. Queries reset at midnight.',
        queriesRemaining: 0,
        resetAt: user.oracleQueriesResetAt
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: ORACLE_SYSTEM_PROMPT },
        { role: 'user', content: question }
      ],
      max_tokens: 500,
      temperature: 0.8
    });

    const oracleResponse = completion.choices[0].message.content;

    // Decrement user's query count
    user.oracleQueriesRemaining -= 1;
    await user.save();

    res.json({
      question: question,
      answer: oracleResponse,
      queriesRemaining: user.oracleQueriesRemaining,
      model: 'gpt-4-turbo-preview'
    });

  } catch (error) {
    console.error('Oracle error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'Oracle temporarily unavailable',
        message: 'The Banana Oracle is meditating. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Oracle failed to respond',
      message: 'The mystical energies are disrupted. Please try again.'
    });
  }
});

// GET /api/oracle/status - Get Oracle status and remaining queries
router.get('/status', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.resetOracleQueries();

    res.json({
      available: !!process.env.OPENAI_API_KEY,
      queriesRemaining: user.oracleQueriesRemaining,
      dailyLimit: 10,
      resetAt: user.oracleQueriesResetAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Oracle status' });
  }
});

// POST /api/oracle/generate-story - Generate a banana invention story
router.post('/generate-story', isAuthenticated, requireTermsAccepted, async (req, res) => {
  try {
    const { theme, era, location } = req.body;
    const user = await User.findById(req.user.id);

    await user.resetOracleQueries();

    if (user.oracleQueriesRemaining <= 0) {
      return res.status(429).json({
        error: 'Daily Oracle query limit reached',
        queriesRemaining: 0
      });
    }

    const storyPrompt = `Generate a short, creative story about the invention of bananas.
Theme: ${theme || 'mysterious discovery'}
Era: ${era || 'ancient times'}
Location: ${location || 'a tropical paradise'}

The story should be 2-3 paragraphs, whimsical yet engaging, and explain how bananas came to be "invented" in this fictional world.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: ORACLE_SYSTEM_PROMPT },
        { role: 'user', content: storyPrompt }
      ],
      max_tokens: 600,
      temperature: 0.9
    });

    user.oracleQueriesRemaining -= 1;
    await user.save();

    res.json({
      story: completion.choices[0].message.content,
      theme,
      era,
      location,
      queriesRemaining: user.oracleQueriesRemaining
    });

  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

module.exports = router;
