'use client';

import { useState, useEffect } from 'react';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { NavigationCard } from './NavigationCard';
import { SearchAndFilter } from './SearchAndFilter';
import { Settings, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NavigationDashboard() {
  const {
    filteredLinks,
    isLoading,
    error,
    fetchLinks,
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
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>Error: {error}</span>
              <Button size="sm" onClick={handleRefresh}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">EyeSeas Navigation</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login?redirect=/admin">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
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
              <div key={i} className="bg-card border rounded-lg shadow-sm animate-pulse p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <div className="w-24 h-4 bg-muted rounded"></div>
                </div>
                <div className="w-full h-8 bg-muted rounded mb-3"></div>
                <div className="w-20 h-3 bg-muted rounded"></div>
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
            <div className="text-muted-foreground mb-4">
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
              <h3 className="text-lg font-semibold mb-2 text-foreground">No navigation links found</h3>
              <p className="text-sm">
                {currentCategory === 'all'
                  ? 'No navigation links have been added yet.'
                  : `No ${currentCategory} navigation links found.`}
              </p>
            </div>
            <Button asChild>
              <Link href="/login?redirect=/admin">
                Add Navigation Links
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
