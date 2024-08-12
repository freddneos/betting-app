// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8083/api/v1',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('@app-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
