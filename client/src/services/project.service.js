import api from './api.js';

export const projectService = {
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  startProject: (id) => api.post(`/projects/${id}/start`),
};