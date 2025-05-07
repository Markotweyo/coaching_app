import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Resource not found');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export const runService = {
  // Get all runs for a user
  getRuns: (userId) => api.get(`/runs/${userId}`),
  
  // Add a new run
  addRun: (runData) => api.post('/runs', runData),
  
  // Update a run
  updateRun: (runId, runData) => api.patch(`/runs/${runId}`, runData),
  
  // Delete a run
  deleteRun: (runId) => api.delete(`/runs/${runId}`),
  
  // Get weekly stats
  getWeeklyStats: (userId, year, week) => 
    api.get(`/runs/${userId}/weekly/${year}/${week}`),
};

export const feedbackService = {
  // Get recommendations
  getRecommendations: (userId) => 
    api.get(`/feedback/recommendations/${userId}`),
  
  // Get pace analysis
  getPaceAnalysis: (userId) => 
    api.get(`/feedback/pace-analysis/${userId}`),
};

export default api; 