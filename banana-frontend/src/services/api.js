// Use Render backend in production, localhost in development
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://banana-site.onrender.com/api'
  : (process.env.REACT_APP_API_URL || 'http://localhost:4000/api');

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiService();
export default api;

// Convenience exports
export const getBananas = (params) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/banana${query ? `?${query}` : ''}`);
};

export const getRandomBanana = () => api.get('/banana/random');
export const getBananaById = (id) => api.get(`/banana/${id}`);
export const getTerms = () => api.get('/terms');
export const getTermsVersion = () => api.get('/terms/version');
export const getOracleStatus = () => api.get('/oracle/status');
export const askOracle = (question) => api.post('/oracle/ask', { question });
export const generateStory = (params) => api.post('/oracle/generate-story', params);
