import api from './api.js';

export const learningService = {
  getPaths: () => api.get('/learning-paths'),
  getPath: (id) => api.get(`/learning-paths/${id}`),
  getCourses: () => api.get('/courses'),
  getCourse: (id) => api.get(`/courses/${id}`),
  getModuleLessons: (moduleId) => api.get(`/modules/${moduleId}/lessons`),
  getLesson: (id) => api.get(`/lessons/${id}`),
};