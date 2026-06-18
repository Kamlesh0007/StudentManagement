import axios from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '');

export const getImageUrl = (photoPath) => {
  if (!photoPath) return null;
  if (photoPath.startsWith('http')) return photoPath;
  return `${SERVER_BASE}${photoPath}`;
};

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const studentService = {
  // Get all students with filters & pagination
  getAll: (params = {}) => api.get('/students', { params }),

  // Get single student
  getById: (id) => api.get(`/students/${id}`),

  // Create student (multipart for photo)
  create: (formData) => api.post('/students', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Update student
  update: (id, formData) => api.put(`/students/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Delete student
  delete: (id) => api.delete(`/students/${id}`),

  // Analytics
  getAnalytics: () => api.get('/students/analytics'),

  // Activity logs
  getLogs: (params = {}) => api.get('/students/logs', { params }),
};

export default api;