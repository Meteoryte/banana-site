const express = require('express');
const router = express.Router();

// Current terms version
const TERMS_VERSION = '1.0';
const TERMS_LAST_UPDATED = '2025-12-09';

// Terms and Conditions content
const termsContent = {
  version: TERMS_VERSION,
  lastUpdated: TERMS_LAST_UPDATED,
  title: 'Terms and Conditions - The Invention of the Banana',
  sections: [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `By accessing and using "The Invention of the Banana" website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`
    },
    {
      id: 'description',
      title: '2. Description of Service',
      content: `"The Invention of the Banana" provides an educational and entertainment platform featuring fictional stories about the invention of bananas, an AI Oracle for banana-related queries, and a community for banana enthusiasts.`
    },
    {
      id: 'user-accounts',
      title: '3. User Accounts',
      content: `To access certain features, you must create an account using Google or GitHub OAuth. You are responsible for maintaining the confidentiality of your account and all activities under it. You must be at least 13 years old to use this service.`
    },
    {
      id: 'ai-oracle',
      title: '4. AI Oracle Usage',
      content: `The AI Oracle feature uses artificial intelligence to generate responses about bananas. These responses are for entertainment purposes only and should not be considered factual information. Free tier users are limited to 10 Oracle queries per day.`
    },
    {
      id: 'content',
      title: '5. User Content',
      content: `You retain ownership of content you submit. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on our platform.`
    },
    {
      id: 'prohibited',
      title: '6. Prohibited Conduct',
      content: `You agree not to: (a) use the service for illegal purposes, (b) attempt to gain unauthorized access, (c) interfere with the service's operation, (d) submit false or misleading information, (e) impersonate others.`
    },
    {
      id: 'disclaimer',
      title: '7. Disclaimer',
      content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not warrant that the service will be uninterrupted, error-free, or secure. All banana invention stories are fictional and for entertainment purposes.`
    },
    {
      id: 'limitation',
      title: '8. Limitation of Liability',
      content: `IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.`
    },
    {
      id: 'changes',
      title: '9. Changes to Terms',
      content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or prominent notice on the website. Continued use after changes constitutes acceptance.`
    },
    {
      id: 'contact',
      title: '10. Contact Information',
      content: `For questions about these Terms and Conditions, please contact us at legal@banana-site.com.`
    }
  ],
  summary: `By using The Invention of the Banana, you agree to use the service responsibly, understand that all content is fictional and for entertainment, and accept the limitations of our AI Oracle feature.`
};

// Privacy Policy content
const privacyPolicy = {
  version: TERMS_VERSION,
  lastUpdated: TERMS_LAST_UPDATED,
  title: 'Privacy Policy - The Invention of the Banana',
  sections: [
    {
      id: 'collection',
      title: '1. Information We Collect',
      content: `We collect: (a) Account information from OAuth providers (email, name, avatar), (b) Usage data and analytics, (c) Content you submit, (d) AI Oracle query history.`
    },
    {
      id: 'use',
      title: '2. How We Use Information',
      content: `We use your information to: (a) Provide and improve our services, (b) Personalize your experience, (c) Communicate with you, (d) Ensure security and prevent abuse.`
    },
    {
      id: 'sharing',
      title: '3. Information Sharing',
      content: `We do not sell your personal information. We may share data with: (a) Service providers who assist our operations, (b) Law enforcement when required, (c) In connection with a business transfer.`
    },
    {
      id: 'security',
      title: '4. Data Security',
      content: `We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.`
    },
    {
      id: 'rights',
      title: '5. Your Rights',
      content: `You have the right to: (a) Access your data, (b) Correct inaccuracies, (c) Delete your account, (d) Export your data. Contact us to exercise these rights.`
    }
  ]
};

// GET /api/terms - Get full terms and conditions
router.get('/', (req, res) => {
  res.json(termsContent);
});

// GET /api/terms/version - Get current terms version
router.get('/version', (req, res) => {
  res.json({
    version: TERMS_VERSION,
    lastUpdated: TERMS_LAST_UPDATED
  });
});

// GET /api/terms/summary - Get terms summary
router.get('/summary', (req, res) => {
  res.json({
    version: TERMS_VERSION,
    summary: termsContent.summary
  });
});

// GET /api/terms/privacy - Get privacy policy
router.get('/privacy', (req, res) => {
  res.json(privacyPolicy);
});

module.exports = router;
