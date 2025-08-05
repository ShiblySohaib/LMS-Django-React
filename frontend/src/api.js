
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper to refresh token
async function refreshToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;
  try {
    const res = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh });
    localStorage.setItem('access', res.data.access);
    return res.data.access;
  } catch (err) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    return null;
  }
}

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for auto-refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;
      const newAccess = await refreshToken();
      if (newAccess) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
