"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigation } from "@/lib/hooks/useNavigation";
import { useCategories } from "@/lib/hooks/useCategories";
import { NavigationCard } from "./NavigationCard";
import { SearchAndFilter } from "./SearchAndFilter";
import { CategorySidebar } from "./CategorySidebar";
import { QuickTagFilter } from "./QuickTagFilter";
import { NetworkModeToggle } from "./NetworkModeToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Settings, RefreshCw, Inbox, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavigationLink, Category } from "@/lib/types";

interface NavigationDashboardProps {
  initialLinks?: NavigationLink[];
  /** 服务端预取的分类数据，实现首屏即渲染 */
  initialCategories?: Category[];
}

export function NavigationDashboard({ initialLinks, initialCategories }: NavigationDashboardProps) {
  const { isLoading, error, fetchLinks, filterLinks, getAllTags, links } =
    useNavigation(initialLinks);
  const { categories, isLoading: categoriesLoading } = useCategories({ 
    initialData: initialCategories 
  });

  // 分类和标签筛选状态
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 侧边栏状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 检查当前选中的分类是否仍然存在，如果不存在则重置为"全部"
  const prevCategoriesRef = useRef<string[] | null>(null);
  useEffect(() => {
    const currentCategoryIds = categories.map(cat => cat.id);
    const prevCategoryIds = prevCategoriesRef.current;

    // 首次加载时记录初始状态
    if (prevCategoriesRef.current === null) {
      prevCategoriesRef.current = currentCategoryIds;
      return;
    }

    // 检测分类数量是否减少（表示有分类被删除）
    if (prevCategoryIds && prevCategoryIds.length > currentCategoryIds.length) {
      console.log("检测到分类删除，刷新数据...");
      // 强制刷新链接数据
      fetchLinks();
      // 检查当前分类是否被删除
      if (activeCategory && !currentCategoryIds.includes(activeCategory)) {
        setActiveCategory(null);
        setSelectedTags([]);
      }
    }

    prevCategoriesRef.current = currentCategoryIds;
  }, [categories, activeCategory, fetchLinks]);

  // 计算每个分类的链接数量
  const linkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    links.forEach(link => {
      if (link.categoryId) {
        counts[link.categoryId] = (counts[link.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [links]);

  // 获取所有唯一标签（独立标签筛选）
  const currentTags = getAllTags();

  // 使用 useMemo 计算过滤后的链接
  const filteredLinks = useMemo(() => {
    return filterLinks({
      categoryId: activeCategory || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      query: searchQuery,
    });
  }, [filterLinks, activeCategory, selectedTags, searchQuery]);

  // 处理分类切换
  const handleCategoryChange = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    setSelectedTags([]); // 切换分类时清空标签筛选
    setMobileMenuOpen(false); // 移动端选择后关闭菜单
  };

  // 处理标签切换
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 清除标签筛选
  const handleClearTags = () => {
    setSelectedTags([]);
  };

  const handleRefresh = () => {
    fetchLinks();
  };

  // 获取当前分类名称
  const getCurrentCategoryName = () => {
    if (!activeCategory) return "全部";
    const category = categories.find(c => c.id === activeCategory);
    return category?.name || "全部";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex flex-col">
      {/* Fixed Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      >
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* 移动端菜单按钮 + Logo */}
            <div className="flex items-center gap-3">
              {/* 移动端菜单按钮 */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </motion.button>

              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex items-center gap-3 flex-shrink-0"
              >
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                    {process.env.NEXT_PUBLIC_APP_TITLE || "EyeSeas Navigation"}
                  </h1>
                </div>
              </motion.div>
            </div>

            {/* Search Bar - 居中 */}
            <div className="flex-1 max-w-xl mx-4 hidden sm:block">
              <SearchAndFilter onSearch={handleSearch} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <NetworkModeToggle />
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isLoading}
                className={cn(
                  "p-2 rounded-xl",
                  "bg-gray-100 dark:bg-gray-800",
                  "hover:bg-gray-200 dark:hover:bg-gray-700",
                  "border border-gray-200 dark:border-gray-700"
                )}
                title="刷新"
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4 text-gray-600 dark:text-gray-300",
                    isLoading && "animate-spin"
                  )}
                />
              </motion.button>
              <Link href="/login?redirect=/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/20"
                  title="管理后台"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>

          {/* 移动端搜索栏 */}
          <div className="sm:hidden mt-3">
            <SearchAndFilter onSearch={handleSearch} />
          </div>
        </div>
      </motion.header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex">
        {/* 桌面端侧边栏 - 固定定位，不随页面滚动 */}
        {!categoriesLoading && (
          <aside 
            className={cn(
              "hidden lg:block fixed left-0 top-[57px] bottom-0 z-40",
              "transition-[width] duration-300 ease-in-out",
              sidebarCollapsed ? "w-[64px]" : "w-[240px]"
            )}
          >
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              linkCounts={linkCounts}
              totalCount={links.length}
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-full"
            />
          </aside>
        )}

        {/* 移动端侧边栏遮罩 */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed left-0 top-0 h-full z-50 w-[280px]"
              >
                <CategorySidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  linkCounts={linkCounts}
                  totalCount={links.length}
                  className="h-full pt-16"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content - 大屏幕为固定侧边栏留出空间 */}
        <main 
          className={cn(
            "flex-1 min-h-[calc(100vh-57px)] transition-[margin] duration-300",
            !categoriesLoading && "lg:ml-[240px]",
            !categoriesLoading && sidebarCollapsed && "lg:!ml-[64px]"
          )}
        >
          <div className="px-4 lg:px-8 py-6">
            {/* 面包屑导航 & 当前分类 */}
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <span>导航</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {getCurrentCategoryName()}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium">
                  {filteredLinks.length} 个链接
                </span>
              </motion.div>
            </div>

            {/* Quick Tag Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <QuickTagFilter
                tags={currentTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                onClear={handleClearTags}
              />
            </motion.div>

            {/* Navigation Links Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse"
                    />
                  ))}
                </motion.div>
              ) : filteredLinks.length > 0 ? (
                <motion.div
                  key="links"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
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
                  className="text-center py-16 lg:py-24"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.2,
                    }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center shadow-inner"
                  >
                    <Inbox className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    暂无导航链接
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                    {activeCategory
                      ? "当前分类下还没有任何链接"
                      : "还没有添加任何导航链接，点击下方按钮开始添加"}
                  </p>
                  <Link href="/login?redirect=/admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium shadow-lg shadow-teal-500/20 transition-all duration-200"
                    >
                      添加导航链接
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
            <div className="px-4 lg:px-8 py-6">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>© 2025 {process.env.NEXT_PUBLIC_APP_TITLE || "EyeSeas Navigation"}. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
