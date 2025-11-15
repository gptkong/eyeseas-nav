"use client";

import { useNavigation } from "@/lib/hooks/useNavigation";
import { NavigationCard } from "./NavigationCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { NetworkModeToggle } from "./NetworkModeToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Settings, RefreshCw, Inbox } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavigationLink } from "@/lib/types";

interface NavigationDashboardProps {
  initialLinks?: NavigationLink[];
}

export function NavigationDashboard({ initialLinks }: NavigationDashboardProps) {
  const { filteredLinks, isLoading, error, fetchLinks, filterLinks } =
    useNavigation(initialLinks);

  const handleSearch = (query: string) => {
    filterLinks({ query });
  };

  const handleRefresh = () => {
    fetchLinks();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-red-800 shadow-xl p-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              加载失败
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              重试
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {process.env.NEXT_PUBLIC_APP_TITLE || "EyeSeas Navigation"}
                </h1>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Network Mode Toggle */}
              <NetworkModeToggle />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-xl",
                  "bg-gray-100 dark:bg-gray-800",
                  "hover:bg-gray-200 dark:hover:bg-gray-700",
                  "border border-gray-200 dark:border-gray-700",
                  "transition-colors duration-200",
                  "flex items-center gap-2"
                )}
                title="刷新"
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4 text-gray-600 dark:text-gray-300",
                    isLoading && "animate-spin"
                  )}
                />
                <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                  刷新
                </span>
              </motion.button>

              {/* Admin Button */}
              <Link href="/login?redirect=/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg transition-all duration-200 flex items-center gap-2"
                  title="管理后台"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    管理
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Search and Filter */}
        <SearchAndFilter onSearch={handleSearch} />

        {/* Navigation Links Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
                />
              ))}
            </motion.div>
          ) : filteredLinks.length > 0 ? (
            <motion.div
              key="links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
            >
              {filteredLinks.map((link, index) => (
                <NavigationCard key={link.id} link={link} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 sm:py-24"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2,
                }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center"
              >
                <Inbox className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                暂无导航链接
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                还没有添加任何导航链接，点击下方按钮开始添加
              </p>
              <Link href="/login?redirect=/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium shadow-lg transition-all duration-200"
                >
                  添加导航链接
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 {process.env.NEXT_PUBLIC_APP_TITLE || "EyeSeas Navigation"}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
