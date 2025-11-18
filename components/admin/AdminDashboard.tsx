"use client";

import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNavigation } from "@/lib/hooks/useNavigation";
import { NavigationLink } from "@/lib/types";
import { NavigationLinkFormData } from "@/lib/validations";
import { LinkForm } from "./LinkForm";
import { CategoryManager } from "./CategoryManager";
import { AdminHeader } from "./AdminHeader";
import { LinksTable } from "./LinksTable";
import { SearchBar } from "./SearchBar";
import { ConfirmDialog } from "./ConfirmDialog";
import { Plus, LayoutGrid, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const { logout } = useAuth();
  const { links, isLoading, error, createLink, updateLink, deleteLink, fetchLinks } = useNavigation();

  const [activeTab, setActiveTab] = useState<"links" | "categories">("links");
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<NavigationLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateLink = useCallback(async (data: NavigationLinkFormData) => {
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
  }, [createLink]);

  const handleUpdateLink = useCallback(async (data: NavigationLinkFormData) => {
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
  }, [editingLink, updateLink]);

  const handleDeleteLink = useCallback(async (id: string) => {
    const result = await deleteLink(id);
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      alert(result.error || "删除失败");
    }
  }, [deleteLink]);

  const confirmLogout = useCallback(() => {
    setShowLogoutConfirm(false);
    logout();
  }, [logout]);

  const filteredLinks = useMemo(
    () => links.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [links, searchQuery]
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
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">加载失败</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button onClick={() => fetchLinks()} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200">
            重试
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AdminHeader onLogout={() => setShowLogoutConfirm(true)} />

      <div className="container mx-auto px-4 py-8">
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

        {activeTab === "links" && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索链接..." />
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

            <LinksTable
              links={filteredLinks}
              isLoading={isLoading}
              onEdit={setEditingLink}
              onDelete={setDeleteConfirm}
            />
          </>
        )}

        {activeTab === "categories" && <CategoryManager />}
      </div>

      {(showForm || editingLink) && (
        <LinkForm
          link={editingLink}
          onSubmit={editingLink ? handleUpdateLink : handleCreateLink}
          onClose={() => {
            setShowForm(false);
            setEditingLink(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="确认删除"
        message="确定要删除这个链接吗？此操作无法撤销。"
        onConfirm={() => deleteConfirm && handleDeleteLink(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

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
