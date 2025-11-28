'use client';

import { DashboardStats } from '@/lib/types';
import { Link, Building, Globe, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-16 h-4 bg-muted rounded"></div>
                  <div className="w-8 h-8 bg-muted rounded"></div>
                </div>
                <div className="w-8 h-8 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
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
      color: 'text-blue-600',
    },
    {
      title: 'External',
      value: stats.externalLinks,
      icon: <Globe className="w-8 h-8" />,
      color: 'text-teal-600',
    },
    {
      title: 'Active',
      value: stats.activeLinks,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'text-green-600',
    },
    {
      title: 'Inactive',
      value: stats.inactiveLinks,
      icon: <XCircle className="w-8 h-8" />,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              <div className={item.color}>
                {item.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
