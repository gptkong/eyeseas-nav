'use client';

import { useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { NavigationLink } from '@/lib/types';
import { NavigationLinkFormData } from '@/lib/validations';
import { LinkForm } from '@/components/admin/LinkForm';
import { LinksTable } from '@/components/admin/LinksTable';
import { SearchBar } from '@/components/admin/SearchBar';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/toast';

export default function LinksPage() {
  const { links, isLoading, error, createLink, updateLink, deleteLink, fetchLinks } = useNavigation();
  const { success, error: showError } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<NavigationLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateLink = useCallback(async (data: NavigationLinkFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createLink(data);
      if (result.success) {
        setShowForm(false);
        success('链接创建成功');
      } else {
        showError(result.error || '创建失败');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [createLink, success, showError]);

  const handleUpdateLink = useCallback(async (data: NavigationLinkFormData) => {
    if (!editingLink) return;
    setIsSubmitting(true);
    try {
      const result = await updateLink(editingLink.id, data);
      if (result.success) {
        setEditingLink(null);
        success('链接更新成功');
      } else {
        showError(result.error || '更新失败');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editingLink, updateLink, success, showError]);

  const handleDeleteLink = useCallback(async (id: string) => {
    const result = await deleteLink(id);
    if (result.success) {
      setDeleteConfirm(null);
      success('链接删除成功');
    } else {
      showError(result.error || '删除失败');
    }
  }, [deleteLink, success, showError]);

  const filteredLinks = useMemo(
    () => links.filter((link) => link.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [links, searchQuery]
  );

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-red-800 shadow-xl p-6 text-center"
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
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索链接..." />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
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

      {(showForm || editingLink) && (
        <LinkForm
          link={editingLink || undefined}
          onSubmit={editingLink ? handleUpdateLink : handleCreateLink}
          onCancel={() => {
            setShowForm(false);
            setEditingLink(null);
          }}
          isLoading={isSubmitting}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="确认删除"
        message="确定要删除这个链接吗？此操作无法撤销。"
        onConfirm={() => deleteConfirm && handleDeleteLink(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
