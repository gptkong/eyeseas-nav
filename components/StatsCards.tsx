'use client';

import { DashboardStats } from '@/lib/types';
import { Link, Building, Globe, CheckCircle, XCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="stat bg-base-100 shadow-sm border border-base-200 animate-pulse">
            <div className="stat-figure text-primary">
              <div className="w-8 h-8 bg-base-300 rounded"></div>
            </div>
            <div className="stat-title">
              <div className="w-16 h-4 bg-base-300 rounded"></div>
            </div>
            <div className="stat-value">
              <div className="w-8 h-8 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      title: 'Total Links',
      value: stats.totalLinks,
      icon: <Link className="w-8 h-8" />,
      color: 'text-primary',
    },
    {
      title: 'Internal',
      value: stats.internalLinks,
      icon: <Building className="w-8 h-8" />,
      color: 'text-info',
    },
    {
      title: 'External',
      value: stats.externalLinks,
      icon: <Globe className="w-8 h-8" />,
      color: 'text-secondary',
    },
    {
      title: 'Active',
      value: stats.activeLinks,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'text-success',
    },
    {
      title: 'Inactive',
      value: stats.inactiveLinks,
      icon: <XCircle className="w-8 h-8" />,
      color: 'text-error',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <div key={index} className="stat bg-base-100 shadow-sm border border-base-200">
          <div className={`stat-figure ${item.color}`}>
            {item.icon}
          </div>
          <div className="stat-title text-xs">{item.title}</div>
          <div className="stat-value text-2xl">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
