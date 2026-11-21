import api from './api.js';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
};