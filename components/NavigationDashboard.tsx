'use client';

import { useState, useEffect } from 'react';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { NavigationCard } from './NavigationCard';
import { SearchAndFilter } from './SearchAndFilter';
import { StatsCards } from './StatsCards';
import { Settings, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export function NavigationDashboard() {
  const {
    filteredLinks,
    stats,
    isLoading,
    error,
    fetchLinks,
    fetchStats,
    filterLinks,
  } = useNavigation();

  const [currentCategory, setCurrentCategory] = useState<'all' | 'internal' | 'external'>('all');

  const handleSearch = (query: string) => {
    filterLinks(query, currentCategory);
  };

  const handleCategoryChange = (category: 'all' | 'internal' | 'external') => {
    setCurrentCategory(category);
    filterLinks('', category);
  };

  const handleRefresh = () => {
    fetchLinks();
    fetchStats();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="container mx-auto">
          <div className="alert alert-error">
            <span>Error: {error}</span>
            <button className="btn btn-sm" onClick={handleRefresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
        <div className="container mx-auto">
          <div className="flex-1">
            <h1 className="text-xl font-bold">EyeSeas Navigation</h1>
          </div>
          <div className="flex-none gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link href="/admin" className="btn btn-ghost btn-sm">
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Stats Cards */}
        <StatsCards stats={stats} isLoading={isLoading} />

        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          currentCategory={currentCategory}
        />

        {/* Navigation Links Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-md animate-pulse">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-base-300 rounded"></div>
                    <div className="w-24 h-4 bg-base-300 rounded"></div>
                  </div>
                  <div className="w-full h-8 bg-base-300 rounded mb-3"></div>
                  <div className="w-20 h-3 bg-base-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLinks.map((link) => (
              <NavigationCard key={link.id} link={link} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-base-content/60 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2">No navigation links found</h3>
              <p className="text-sm">
                {currentCategory === 'all'
                  ? 'No navigation links have been added yet.'
                  : `No ${currentCategory} navigation links found.`}
              </p>
            </div>
            <Link href="/admin" className="btn btn-primary">
              Add Navigation Links
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
