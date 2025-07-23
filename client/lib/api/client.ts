import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    try {
      // First try to get token from NextAuth.js session
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
        return config;
      }

      // Fallback to localStorage for backward compatibility
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get session token:', error);

      // Fallback to localStorage
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Transform server response to match our expected format
    const data = response.data;

    // If the response already has success field, return as is
    if (typeof data === 'object' && 'success' in data) {
      return data;
    }

    // Transform server response format to our expected format
    return {
      success: true,
      data: data.data || data,
      message: data.data?.message || data.message || 'Success'
    };
  },
  (error) => {
    // Enhanced error logging for debugging
    console.group('🔴 API Client Error');

    // Log the complete error object
    console.error('Full Error Object:', error);

    // Extract and log key error information
    const errorInfo = {
      name: error?.name,
      message: error?.message,
      isAxiosError: error?.isAxiosError,
      code: error?.code,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      responseData: error?.response?.data,
      requestMethod: error?.config?.method,
      requestURL: error?.config?.url,
      requestData: error?.config?.data
    };

    console.log('Error Summary:', errorInfo);

    // Log the response data in detail if available
    if (error?.response?.data) {
      console.log('Response Data Details:', {
        message: error.response.data.message,
        error: error.response.data.error,
        statusCode: error.response.data.statusCode,
        code: error.response.data.code,
        keyValue: error.response.data.keyValue,
        keyPattern: error.response.data.keyPattern
      });
    }

    console.groupEnd();

    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        // Clear localStorage token
        localStorage.removeItem('auth-token');

        // For NextAuth.js, we should redirect to the sign-in page
        // The NextAuth.js session will be handled automatically
        window.location.href = '/auth/login';
      }
    }

    // Ensure the error has the expected structure for our error handler
    if (error.response) {
      // Axios error with response - preserve the structure
      return Promise.reject(error);
    } else {
      // Network error or other error - wrap it
      return Promise.reject({
        message: error.message || 'Network error',
        response: null
      });
    }
  }
);

export default apiClient;
