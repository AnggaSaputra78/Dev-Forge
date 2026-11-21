import api from './api.js';

export const mentorService = {
  chat: (action, message, codeSnippet, mode) =>
    api.post('/mentor/chat', { action, message, codeSnippet, mode }),
  getHistory: () => api.get('/mentor/history'),
  getStatus: () => api.get('/mentor/status'),
};