'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Tabs, Tab } from '@heroui/react';
import { 
  LayoutGrid, 
  Folder, 
  Tag, 
  LogOut, 
  Home, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/lib/contexts/ThemeContext';

// 导航项配置
const navItems = [
  { key: '/admin/links', label: '链接管理', icon: LayoutGrid, description: '添加、编辑、删除导航链接' },
  { key: '/admin/categories', label: '分类管理', icon: Folder, description: '创建和管理链接分类，支持拖拽排序' },
  { key: '/admin/tags', label: '标签管理', icon: Tag, description: '管理标签：重命名、删除、合并' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const confirmLogout = useCallback(() => {
    setShowLogoutConfirm(false);
    logout();
  }, [logout]);

  const handleSelectionChange = useCallback((key: React.Key) => {
    router.push(key as string);
  }, [router]);

  // 获取当前选中的 key
  const getSelectedKey = () => {
    for (const item of navItems) {
      if (pathname.startsWith(item.key)) {
        return item.key;
      }
    }
    return navItems[0].key;
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
            <Settings className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* 左侧边栏 */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? 80 : 280 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            "h-full flex flex-col",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
            "border-r border-gray-200/50 dark:border-gray-700/50",
            "shadow-xl"
          )}
        >
          {/* Logo 区域 */}
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0"
              >
                <span className="text-white font-bold text-lg">E</span>
              </motion.div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                      管理后台
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      EyeSeas Navigation
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* 导航标签 */}
          <div className="flex-1 overflow-y-auto py-4">
            <Tabs
              aria-label="管理导航"
              selectedKey={getSelectedKey()}
              onSelectionChange={handleSelectionChange}
              isVertical
              variant="light"
              color="primary"
              classNames={{
                base: "w-full",
                tabList: cn(
                  "gap-2 w-full px-3",
                  "bg-transparent"
                ),
                tab: cn(
                  "h-auto py-3 px-3",
                  "justify-start",
                  "data-[selected=true]:bg-teal-500/10 dark:data-[selected=true]:bg-teal-500/20",
                  "data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700/50",
                  "rounded-xl transition-all duration-200"
                ),
                cursor: "bg-teal-500/10 dark:bg-teal-500/20 rounded-xl",
                tabContent: "group-data-[selected=true]:text-teal-600 dark:group-data-[selected=true]:text-teal-400",
              }}
            >
              {navItems.map((item) => (
                <Tab
                  key={item.key}
                  title={
                    <div className={cn(
                      "flex items-center gap-3 w-full",
                      sidebarCollapsed && "justify-center"
                    )}>
                      <item.icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        pathname.startsWith(item.key)
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-gray-500 dark:text-gray-400"
                      )} />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-start overflow-hidden"
                          >
                            <span className={cn(
                              "font-medium text-sm whitespace-nowrap",
                              pathname.startsWith(item.key)
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-gray-700 dark:text-gray-300"
                            )}>
                              {item.label}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                              {item.description}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </div>

          {/* 底部操作区 */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
            {/* 折叠按钮 */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-gray-600 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                "transition-colors duration-200",
                sidebarCollapsed && "justify-center"
              )}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">收起侧边栏</span>
                </>
              )}
            </button>

            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-gray-600 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                "transition-colors duration-200",
                sidebarCollapsed && "justify-center"
              )}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm"
                  >
                    {theme === 'dark' ? '浅色模式' : '深色模式'}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* 返回首页 */}
            <Link
              href="/"
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-gray-600 dark:text-gray-400",
                "hover:bg-gray-100 dark:hover:bg-gray-700/50",
                "transition-colors duration-200",
                sidebarCollapsed && "justify-center"
              )}
            >
              <Home className="w-5 h-5" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm"
                  >
                    返回首页
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* 退出登录 */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-red-600 dark:text-red-400",
                "hover:bg-red-50 dark:hover:bg-red-900/20",
                "transition-colors duration-200",
                sidebarCollapsed && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                  >
                    退出登录
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.aside>

        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto">
          {/* 顶部标题栏 */}
          <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {navItems.find(item => pathname.startsWith(item.key))?.label || '管理后台'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {navItems.find(item => pathname.startsWith(item.key))?.description || '欢迎使用管理后台'}
                  </p>
                </div>
                
                {/* 移动端菜单按钮 - 可扩展 */}
                <div className="flex items-center gap-2">
                  {/* 可以添加更多操作按钮 */}
                </div>
              </div>
            </div>
          </header>

          {/* 页面内容 */}
          <div className="p-6">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      {/* 退出确认对话框 */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="确认退出"
        message="确定要退出登录吗？"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
