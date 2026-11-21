import api from './api.js';

export const progressService = {
  getOverview: () => api.get('/progress/overview'),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  completeLesson: (lessonId, timeSpent) => api.post('/progress/lesson', { lessonId, timeSpent }),
  updateMilestone: (projectId, milestoneIndex, completed) =>
    api.put(`/progress/project/${projectId}/milestone`, { milestoneIndex, completed }),
  getActivities: () => api.get('/activities'),
};