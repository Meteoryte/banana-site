import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getOracleStatus, askOracle, generateStory } from '../services/api';
import './Oracle.css';

const Oracle = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [activeTab, setActiveTab] = useState('ask');
  const [storyParams, setStoryParams] = useState({ theme: '', era: '', location: '' });

  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['oracleStatus'],
    queryFn: getOracleStatus,
  });

  const askMutation = useMutation({
    mutationFn: askOracle,
    onSuccess: (data) => {
      setConversation(prev => [...prev, 
        { type: 'question', content: question },
        { type: 'answer', content: data.answer }
      ]);
      setQuestion('');
      refetchStatus();
    },
    onError: (error) => {
      setConversation(prev => [...prev, 
        { type: 'question', content: question },
        { type: 'error', content: error.message || 'The Oracle is unavailable' }
      ]);
    }
  });

  const storyMutation = useMutation({
    mutationFn: generateStory,
    onSuccess: (data) => {
      setConversation(prev => [...prev, 
        { type: 'story-request', content: `Theme: ${storyParams.theme || 'Any'}, Era: ${storyParams.era || 'Any'}, Location: ${storyParams.location || 'Any'}` },
        { type: 'story', content: data.story }
      ]);
      setStoryParams({ theme: '', era: '', location: '' });
      refetchStatus();
    },
  });

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim() || askMutation.isPending) return;
    askMutation.mutate(question);
  };

  const handleGenerateStory = (e) => {
    e.preventDefault();
    if (storyMutation.isPending) return;
    storyMutation.mutate(storyParams);
  };

  const suggestedQuestions = [
    "How were bananas invented?",
    "What's the rarest banana variety?",
    "Tell me about banana mythology",
    "Why are bananas yellow?",
    "What's the most nutritious banana?",
  ];

  return (
    <div className="oracle-page">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="oracle-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="oracle-icon">🔮</span>
          <h1>The Banana Oracle</h1>
          <p>Ask the mystical Oracle any banana-related question</p>
        </motion.div>

        {/* Status */}
        {status && (
          <motion.div 
            className="oracle-status glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="status-item">
              <span className="status-icon">⚡</span>
              <span>{status.available ? 'Oracle Active' : 'Oracle Unavailable'}</span>
            </div>
            <div className="status-item">
              <span className="status-icon">🎫</span>
              <span>{status.queriesRemaining} / {status.dailyLimit} queries remaining</span>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="oracle-tabs">
          <button 
            className={`tab-btn ${activeTab === 'ask' ? 'active' : ''}`}
            onClick={() => setActiveTab('ask')}
          >
            🗣️ Ask Question
          </button>
          <button 
            className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            📖 Generate Story
          </button>
        </div>

        {/* Main Content */}
        <div className="oracle-content">
          {/* Conversation */}
          <div className="conversation-panel glass-card">
            {conversation.length === 0 ? (
              <div className="conversation-empty">
                <span>🍌</span>
                <p>The Oracle awaits your questions...</p>
                <div className="suggested-questions">
                  <p>Try asking:</p>
                  {suggestedQuestions.map((q, i) => (
                    <button 
                      key={i} 
                      className="suggested-btn"
                      onClick={() => setQuestion(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="conversation-list">
                {conversation.map((msg, index) => (
                  <motion.div 
                    key={index}
                    className={`message ${msg.type}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="message-icon">
                      {msg.type === 'question' && '👤'}
                      {msg.type === 'answer' && '🔮'}
                      {msg.type === 'story-request' && '📝'}
                      {msg.type === 'story' && '📖'}
                      {msg.type === 'error' && '⚠️'}
                    </div>
                    <div className="message-content">
                      <p>{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {(askMutation.isPending || storyMutation.isPending) && (
                  <div className="message answer thinking">
                    <div className="message-icon">🔮</div>
                    <div className="message-content">
                      <div className="thinking-dots">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Panel */}
          <div className="input-panel glass-card">
            {activeTab === 'ask' ? (
              <form onSubmit={handleAsk} className="ask-form">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask the Banana Oracle..."
                  disabled={askMutation.isPending || status?.queriesRemaining <= 0}
                  aria-label="Your question for the Oracle"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!question.trim() || askMutation.isPending || status?.queriesRemaining <= 0}
                >
                  {askMutation.isPending ? 'Consulting...' : 'Ask Oracle'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleGenerateStory} className="story-form">
                <div className="story-inputs">
                  <input
                    type="text"
                    value={storyParams.theme}
                    onChange={(e) => setStoryParams(p => ({ ...p, theme: e.target.value }))}
                    placeholder="Theme (e.g., mystery, adventure)"
                    aria-label="Story theme"
                  />
                  <input
                    type="text"
                    value={storyParams.era}
                    onChange={(e) => setStoryParams(p => ({ ...p, era: e.target.value }))}
                    placeholder="Era (e.g., ancient, futuristic)"
                    aria-label="Story era"
                  />
                  <input
                    type="text"
                    value={storyParams.location}
                    onChange={(e) => setStoryParams(p => ({ ...p, location: e.target.value }))}
                    placeholder="Location (e.g., tropical island)"
                    aria-label="Story location"
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={storyMutation.isPending || status?.queriesRemaining <= 0}
                >
                  {storyMutation.isPending ? 'Generating...' : 'Generate Story'}
                </button>
              </form>
            )}

            {status?.queriesRemaining <= 0 && (
              <p className="limit-warning">
                Daily query limit reached. Resets at midnight.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oracle;
