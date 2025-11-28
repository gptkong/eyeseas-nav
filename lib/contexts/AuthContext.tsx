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

// 全局状态防止重复初始化
let globalHasInitialized = false;
let globalIsChecking = false;

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    session: null,
  });

  // 验证 Session
  const checkAuthStatus = useCallback(async () => {
    if (globalIsChecking) return;
    globalIsChecking = true;

    try {
      const token = localStorage.getItem('admin_session');
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          session: null,
        });
        return;
      }

      // 调用验证 API
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            session: data.data,
          });
          return;
        }
      }

      // 验证失败，清除 token
      localStorage.removeItem('admin_session');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        session: null,
      });
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

  // 初始化
  useEffect(() => {
    if (!globalHasInitialized) {
      globalHasInitialized = true;
      checkAuthStatus();
    } else {
      // 从 localStorage 快速恢复
      const token = localStorage.getItem('admin_session');
      if (token) {
        // 解析 JWT 检查过期（简单检查，实际验证在 API）
        try {
          const [, payload] = token.split('.');
          const data = JSON.parse(atob(payload));
          const now = Math.floor(Date.now() / 1000);
          
          if (data.exp && data.exp > now) {
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              session: {
                isAuthenticated: true,
                expiresAt: data.exp * 1000,
              },
            });
            return;
          }
        } catch {
          // JWT 解析失败，可能是旧格式
        }
        
        localStorage.removeItem('admin_session');
      }
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        session: null,
      });
    }
  }, [checkAuthStatus]);

  // 登录
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
        const token = data.data.session;
        localStorage.setItem('admin_session', token);

        // 解析 JWT 获取 session 信息
        try {
          const [, payload] = token.split('.');
          const sessionData = JSON.parse(atob(payload));
          
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            session: {
              isAuthenticated: true,
              expiresAt: sessionData.exp ? sessionData.exp * 1000 : Date.now() + 24 * 60 * 60 * 1000,
            },
          });
        } catch {
          // 解析失败时调用验证 API
          await checkAuthStatus();
        }

        return { success: true };
      }
      
      return { success: false, error: data.error || data.message || '登录失败' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: '网络错误' };
    }
  }, [checkAuthStatus]);

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem('admin_session');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      session: null,
    });

    // 重定向到首页
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  // 获取认证头
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = localStorage.getItem('admin_session');
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
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
