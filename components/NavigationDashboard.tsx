"use client";

import { useNavigation } from "@/lib/hooks/useNavigation";
import { NavigationCard } from "./NavigationCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { NetworkModeToggle } from "./NetworkModeToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Settings, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NavigationDashboard() {
  const { filteredLinks, isLoading, error, fetchLinks, filterLinks } =
    useNavigation();

  const handleSearch = (query: string) => {
    filterLinks({ query });
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
      <div className="border-b bg-card shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">
                <span className="hidden sm:inline">ENav</span>
                <span className="sm:hidden">ENav</span>
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Network Mode Toggle */}
              <div className="hidden xs:block">
                <NetworkModeToggle size="sm" showLabel={false} />
              </div>
              <div className="xs:hidden">
                <NetworkModeToggle
                  size="sm"
                  showLabel={false}
                  className="scale-90"
                />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle
                variant="ghost"
                size="sm"
                className="px-2 sm:px-3"
              />

              {/* Refresh Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-2 sm:px-3"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""} ${
                    isLoading ? "" : "sm:mr-2"
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {/* Admin Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="px-2 sm:px-3"
                title="Admin Panel"
              >
                <Link href="/login?redirect=/admin">
                  <Settings className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4">
        {/* Search and Filter */}
        <SearchAndFilter onSearch={handleSearch} />

        {/* Navigation Links Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-card border rounded-lg shadow-sm animate-pulse p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <div className="w-24 h-4 bg-muted rounded"></div>
                </div>
                <div className="w-full h-6 sm:h-8 bg-muted rounded mb-2 sm:mb-3"></div>
                <div className="w-20 h-3 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredLinks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredLinks.map((link) => (
              <NavigationCard key={link.id} link={link} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-muted-foreground mb-4 sm:mb-6">
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"
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
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">
                No navigation links found
              </h3>
              <p className="text-sm sm:text-base max-w-md mx-auto">
                No navigation links have been added yet.
              </p>
            </div>
            <Button asChild size="sm" className="sm:size-default">
              <Link href="/login?redirect=/admin">Add Navigation Links</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
