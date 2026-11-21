import api from './api.js';

export const assessmentService = {
  getAssessments: () => api.get('/assessments'),
  getAssessment: (id) => api.get(`/assessments/${id}`),
  submitAttempt: (id, answers, timeTaken) =>
    api.post(`/assessments/${id}/submit`, { answers, timeTaken }),
};