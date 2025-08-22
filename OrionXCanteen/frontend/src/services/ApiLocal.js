import axios from 'axios';

const api_local = axios.create({
  baseURL: 'http://localhost:8000/api', // ✅ Use your actual server IP or domain
});

// Attach token to requests
api_local.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
api_local.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        sessionStorage.clear();
        window.location.href = '/login';
        return;
      }

      try {
        const { data } = await api_local.post('/auth/refresh', {
          useremail: sessionStorage.getItem('credential'),
          id: sessionStorage.getItem('id'),
          role: sessionStorage.getItem('role'),
          refreshKey: refreshToken,
        });

        sessionStorage.setItem('token', data.token);

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api_local(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api_local;
