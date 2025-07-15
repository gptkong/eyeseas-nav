'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoginSuccess = () => {
    // Check if there's a redirect parameter after successful login
    const redirect = searchParams.get('redirect');
    if (redirect) {
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push(redirect);
      }, 100);
    }
    // If no redirect, stay on admin page (will show dashboard)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard />;
}
