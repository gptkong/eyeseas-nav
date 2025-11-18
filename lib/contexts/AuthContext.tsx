'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AdminSession } from '@/lib/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: AdminSession | null;
}

interface AuthContextType extends AuthState {
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// 使用模块级变量来确保全局只初始化一次，即使在 React Strict Mode 下也有效
let globalHasInitialized = false;
let globalIsChecking = false;

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    session: null,
  });

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    // 使用全局变量防止并发调用
    if (globalIsChecking) {
      return;
    }

    globalIsChecking = true;

    try {
      const sessionString = localStorage.getItem('admin_session');
      if (!sessionString) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          session: null,
        });
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Session ${sessionString}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            session: data.data,
          });
        } else {
          localStorage.removeItem('admin_session');
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            session: null,
          });
        }
      } else {
        localStorage.removeItem('admin_session');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          session: null,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('admin_session');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        session: null,
      });
    } finally {
      globalIsChecking = false;
    }
  }, []);

  // Initialize auth check on mount - 使用全局变量确保只执行一次
  useEffect(() => {
    if (!globalHasInitialized) {
      globalHasInitialized = true;
      checkAuthStatus();
    } else {
      // 即使跳过 API 调用，也需要从 localStorage 恢复状态
      const sessionString = localStorage.getItem('admin_session');
      if (sessionString) {
        // 直接从 localStorage 恢复，不调用 API
        try {
          const sessionData = JSON.parse(atob(sessionString));
          const now = Date.now();
          if (sessionData.expiresAt > now) {
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              session: sessionData,
            });
          } else {
            localStorage.removeItem('admin_session');
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              session: null,
            });
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            session: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          session: null,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success && data.data?.session) {
        const sessionString = data.data.session;
        localStorage.setItem('admin_session', sessionString);

        // 解码 session 信息并直接设置状态，避免额外的 API 调用
        try {
          const sessionData = JSON.parse(atob(sessionString));
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            session: sessionData,
          });
        } catch (decodeError) {
          console.error('Failed to decode session:', decodeError);
          // 如果解码失败，fallback 到调用 checkAuthStatus
          await checkAuthStatus();
        }

        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [checkAuthStatus]);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_session');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      session: null,
    });

    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const sessionString = localStorage.getItem('admin_session');
    if (!sessionString) {
      return {};
    }
    return { 'Authorization': `Session ${sessionString}` };
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    getAuthHeaders,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
