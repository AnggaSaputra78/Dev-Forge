import api from './api.js';

export const codingService = {
  getChallenges: () => api.get('/challenges'),
  getChallenge: (id) => api.get(`/challenges/${id}`),
  submitSolution: (id, code) => api.post(`/challenges/${id}/submit`, { code }),
  getSubmissions: () => api.get('/submissions'),
};