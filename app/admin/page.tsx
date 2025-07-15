'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowDashboard(true);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowDashboard(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!isAuthenticated || !showDashboard) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard />;
}
