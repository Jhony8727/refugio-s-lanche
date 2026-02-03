import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('adminToken', response.data.token);
  localStorage.setItem('adminData', JSON.stringify(response.data.admin));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};
