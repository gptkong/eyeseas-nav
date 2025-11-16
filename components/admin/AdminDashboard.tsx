"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNavigation } from "@/lib/hooks/useNavigation";
import { NavigationLink } from "@/lib/types";
import { NavigationLinkFormData } from "@/lib/validations";
import { LinkForm } from "./LinkForm";
import { CategoryManager } from "./CategoryManager";
import { ThemeToggle } from "../ThemeToggle";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Home,
  ExternalLink,
  Search,
  RefreshCw,
  LayoutGrid,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const { logout } = useAuth();
  const {
    links,
    isLoading,
    error,
    createLink,
    updateLink,
    deleteLink,
    fetchLinks,
  } = useNavigation();

  const [activeTab, setActiveTab] = useState<"links" | "categories">("links");
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<NavigationLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateLink = async (data: NavigationLinkFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createLink(data);
      if (result.success) {
        setShowForm(false);
      } else {
        alert(result.error || "创建失败");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (data: NavigationLinkFormData) => {
    if (!editingLink) return;

    setIsSubmitting(true);
    try {
      const result = await updateLink(editingLink.id, data);
      if (result.success) {
        setEditingLink(null);
      } else {
        alert(result.error || "更新失败");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    const result = await deleteLink(id);
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      alert(result.error || "删除失败");
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-red-800 shadow-xl p-6 text-center"
        >
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
            onClick={() => fetchLinks()}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            重试
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
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
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  管理后台
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  导航链接管理系统
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <Home className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    首页
                  </span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogoutConfirm(true)}
                className="px-3 sm:px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  退出
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tab Switcher */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("links")}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2",
              activeTab === "links"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            )}
          >
            <LayoutGrid className="w-5 h-5" />
            链接管理
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2",
              activeTab === "categories"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                : "bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            )}
          >
            <Folder className="w-5 h-5" />
            分类管理
          </button>
        </div>

        {/* Links Management Tab */}
        {activeTab === "links" && (
          <>
            {/* Actions Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索链接..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                />
              </div>

              {/* Add Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>添加链接</span>
              </motion.button>
            </div>

            {/* Table */}
            <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    内网地址
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    外网地址
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredLinks.length > 0 ? (
                  filteredLinks.map((link, index) => (
                    <motion.tr
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {link.favicon ? (
                            <img
                              src={link.favicon}
                              alt=""
                              className="w-8 h-8 rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : link.icon ? (
                            <span className="text-2xl">{link.icon}</span>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                          )}
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {link.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate lg:hidden">
                              {link.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <a
                          href={link.internalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          {new URL(link.internalUrl).hostname}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <a
                          href={link.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          {new URL(link.externalUrl).hostname}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex px-3 py-1 text-xs font-semibold rounded-full",
                            link.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          )}
                        >
                          {link.isActive ? "已激活" : "未激活"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingLink(link)}
                            className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors duration-200"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDeleteConfirm(link.id)}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors duration-200"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                          <LayoutGrid className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          暂无数据
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {searchQuery ? "没有找到匹配的链接" : "还没有添加任何链接"}
                        </p>
                        {!searchQuery && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowForm(true)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium transition-all duration-200"
                          >
                            添加第一个链接
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {!isLoading && filteredLinks.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  共 <span className="font-semibold text-gray-900 dark:text-white">{filteredLinks.length}</span> 条记录
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchLinks()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  刷新
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
          </>
        )}

        {/* Categories Management Tab */}
        {activeTab === "categories" && (
          <CategoryManager />
        )}
      </div>

      {/* Create/Edit Form Modal */}
      <LinkForm
        open={showForm || !!editingLink}
        link={editingLink || undefined}
        onSubmit={editingLink ? handleUpdateLink : handleCreateLink}
        onCancel={() => {
          setShowForm(false);
          setEditingLink(null);
        }}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  确认删除
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  确定要删除这个导航链接吗？此操作无法撤销。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => handleDeleteLink(deleteConfirm)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                  >
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  确认退出
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  确定要退出登录吗？您将被重定向到首页。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors duration-200"
                  >
                    退出
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
