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
  { key: '/admin/links', label: '链接管理', icon: LayoutGrid },
  { key: '/admin/categories', label: '分类管理', icon: Folder },
  { key: '/admin/tags', label: '标签管理', icon: Tag },
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
          animate={{ width: sidebarCollapsed ? 64 : 180 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            "h-full flex flex-col",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
            "border-r border-gray-200/50 dark:border-gray-700/50",
            "shadow-xl"
          )}
        >
          {/* Logo 区域 */}
          <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0"
              >
                <span className="text-white font-bold text-sm">E</span>
              </motion.div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold text-gray-900 dark:text-white text-sm"
                  >
                    管理后台
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* 导航标签 */}
          <div className="flex-1 overflow-y-auto py-2">
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
                  "gap-1 w-full px-2",
                  "bg-transparent"
                ),
                tab: cn(
                  "h-auto py-2 px-2",
                  "justify-start",
                  "data-[selected=true]:bg-teal-500/10 dark:data-[selected=true]:bg-teal-500/20",
                  "data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700/50",
                  "rounded-lg transition-all duration-200"
                ),
                cursor: "bg-teal-500/10 dark:bg-teal-500/20 rounded-lg",
                tabContent: "group-data-[selected=true]:text-teal-600 dark:group-data-[selected=true]:text-teal-400",
              }}
            >
              {navItems.map((item) => (
                <Tab
                  key={item.key}
                  title={
                    <div className={cn(
                      "flex items-center gap-2 w-full",
                      sidebarCollapsed && "justify-center"
                    )}>
                      <item.icon className={cn(
                        "w-4 h-4 flex-shrink-0",
                        pathname.startsWith(item.key)
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-gray-500 dark:text-gray-400"
                      )} />
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "font-medium text-sm whitespace-nowrap",
                              pathname.startsWith(item.key)
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-gray-700 dark:text-gray-300"
                            )}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </div>

          {/* 底部操作区 */}
          <div className="p-2 border-t border-gray-200/50 dark:border-gray-700/50">
            {/* 图标按钮组 */}
            <div className={cn(
              "flex items-center gap-1 p-1 rounded-lg",
              "bg-gray-100/80 dark:bg-gray-700/50",
              sidebarCollapsed ? "flex-col" : "justify-center"
            )}>
              {/* 折叠按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={cn(
                  "p-2 rounded-md",
                  "text-gray-500 dark:text-gray-400",
                  "hover:text-gray-700 dark:hover:text-gray-200",
                  "hover:bg-white dark:hover:bg-gray-600",
                  "transition-all duration-200"
                )}
                title={sidebarCollapsed ? "展开" : "收起"}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </motion.button>

              {/* 主题切换 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-md",
                  "text-gray-500 dark:text-gray-400",
                  "hover:text-amber-500 dark:hover:text-amber-400",
                  "hover:bg-white dark:hover:bg-gray-600",
                  "transition-all duration-200"
                )}
                title={theme === 'dark' ? "浅色模式" : "深色模式"}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </motion.button>

              {/* 返回首页 */}
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-2 rounded-md",
                    "text-gray-500 dark:text-gray-400",
                    "hover:text-teal-600 dark:hover:text-teal-400",
                    "hover:bg-white dark:hover:bg-gray-600",
                    "transition-all duration-200"
                  )}
                  title="返回首页"
                >
                  <Home className="w-4 h-4" />
                </motion.div>
              </Link>

              {/* 退出登录 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogoutConfirm(true)}
                className={cn(
                  "p-2 rounded-md",
                  "text-gray-500 dark:text-gray-400",
                  "hover:text-red-500 dark:hover:text-red-400",
                  "hover:bg-white dark:hover:bg-gray-600",
                  "transition-all duration-200"
                )}
                title="退出登录"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.aside>

        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto">
          {/* 顶部标题栏 */}
          <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {navItems.find(item => pathname.startsWith(item.key))?.label || '管理后台'}
              </h2>
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
