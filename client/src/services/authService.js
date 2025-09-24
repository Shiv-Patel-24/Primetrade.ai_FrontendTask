import api from './api';

export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);
export const getCurrentUser = () => api.get('/auth/me');
export const updatePassword = (passwordData) => api.put('/auth/update-password', passwordData);