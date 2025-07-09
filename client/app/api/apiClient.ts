import axios from 'axios';
import { getCookie } from 'cookies-next';
import { SecurityUtils } from '../utils/security';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL,
  withCredentials: true, 
});

apiClient.interceptors.request.use(async (config) => {
  // Cookies are automatically included with withCredentials: true
  // Add CSRF token for state-changing operations
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
    config.headers = await SecurityUtils.addCSRFHeader(config.headers || {});
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to extract data from axios response and handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Extract data from axios response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to unified login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;