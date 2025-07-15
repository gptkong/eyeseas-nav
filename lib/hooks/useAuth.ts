'use client';

import { useState, useEffect } from 'react';
import { AdminSession, ApiResponse } from '@/lib/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AdminSession | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    session: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          session: null,
        });
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: ApiResponse = await response.json();
        if (data.success) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            session: data.data,
          });
        } else {
          localStorage.removeItem('admin_token');
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            session: null,
          });
        }
      } else {
        localStorage.removeItem('admin_token');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          session: null,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('admin_token');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        session: null,
      });
    }
  };

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.data?.token) {
        localStorage.setItem('admin_token', data.data.token);
        await checkAuthStatus();

        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      session: null,
    });

    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    getAuthHeaders,
  };
}
