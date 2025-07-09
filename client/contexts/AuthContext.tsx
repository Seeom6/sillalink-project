'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'employee' | 'admin' | 'operator';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Make a test API call to check if the user is authenticated
      const response = await fetch('/api/v1/website/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Auth check response:', responseData); // Debug log

        // Handle nested response structure from backend
        const userData = responseData?.data || responseData;

        if (userData && userData.id) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Authentication successful, user:', userData);
        } else {
          console.log('Invalid user data structure:', userData);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log('Auth check failed:', response.status); // Debug log
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error); // Debug log
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/v1/website/auth/log-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('AuthContext login response:', responseData);

        // Handle nested response structure
        const userData = responseData?.data?.user || responseData?.user;

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);

          // Determine redirect based on user role
          const redirectTo = ['admin', 'operator'].includes(userData.role)
            ? '/admin/dashboard'
            : '/employee/dashboard';

          console.log('AuthContext login - User role:', userData.role, 'Redirect to:', redirectTo);
          return { success: true, redirectTo };
        } else {
          console.error('AuthContext login - No user data in response');
          return { success: false, error: 'Invalid response format' };
        }
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Login failed' };
      }
    } catch (error) {
      console.error('AuthContext login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear HTTP-only cookies
      await fetch('/api/v1/website/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
