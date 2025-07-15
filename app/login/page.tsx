'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoginForm } from '@/components/admin/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      // If user is already authenticated, redirect to admin page
      const redirect = searchParams.get('redirect') || '/admin';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleLoginSuccess = () => {
    // After successful login, redirect to admin page or specified redirect
    const redirect = searchParams.get('redirect') || '/admin';
    router.push(redirect);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Show loading while redirecting
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
