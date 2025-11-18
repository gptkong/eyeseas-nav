'use client';

import { useContext } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';

/**
 * useAuth Hook
 *
 * 从 AuthContext 获取认证状态和方法的便捷 Hook
 * 所有认证状态现在集中在 AuthProvider 中管理，避免多次调用 /api/auth/verify
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
