import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

console.log('🔧 API configurada para:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  console.log(`➡️ Requisição: ${config.method.toUpperCase()} ${config.url}`);
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('❌ Erro no interceptor de request:', error);
  return Promise.reject(error);
});

// Interceptor de resposta para debug
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
