'use client';

import { useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { useCategories } from '@/lib/hooks/useCategories';
import { NavigationLink } from '@/lib/types';
import { NavigationLinkFormData } from '@/lib/validations';
import { LinkForm } from '@/components/admin/LinkForm';
import { LinksTable } from '@/components/admin/LinksTable';
import { SearchBar } from '@/components/admin/SearchBar';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Trash2, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/toast';
import { Select, SelectItem, Button, Chip } from '@heroui/react';

export default function LinksPage() {
  const { links, isLoading, error, createLink, updateLink, deleteLink, deleteLinks, fetchLinks } = useNavigation();
  const { categories } = useCategories();
  const { success, error: showError } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<NavigationLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤状态
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 批量选择状态
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

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
      // 从选中列表中移除
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      success('链接删除成功');
    } else {
      showError(result.error || '删除失败');
    }
  }, [deleteLink, success, showError]);

  // 批量删除处理
  const handleBatchDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;

    setIsBatchDeleting(true);
    try {
      const result = await deleteLinks(Array.from(selectedIds));
      if (result.success) {
        setBatchDeleteConfirm(false);
        setSelectedIds(new Set());
        success(`成功删除 ${result.deletedCount} 个链接`);
      } else {
        showError(result.error || '批量删除失败');
      }
    } finally {
      setIsBatchDeleting(false);
    }
  }, [selectedIds, deleteLinks, success, showError]);

  // 清除所有过滤器
  const clearFilters = useCallback(() => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  }, []);

  // 检查是否有活跃的过滤器
  const hasActiveFilters = categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery !== '';

  // 过滤链接
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // 搜索过滤
      if (searchQuery && !link.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // 分类过滤
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'uncategorized') {
          if (link.categoryId) return false;
        } else {
          if (link.categoryId !== categoryFilter) return false;
        }
      }
      // 状态过滤
      if (statusFilter !== 'all') {
        if (statusFilter === 'active' && !link.isActive) return false;
        if (statusFilter === 'inactive' && link.isActive) return false;
      }
      return true;
    });
  }, [links, searchQuery, categoryFilter, statusFilter]);

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
      {/* 顶部操作栏 */}
      <div className="mb-6 space-y-4">
        {/* 搜索和添加按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
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

        {/* 过滤器和批量操作 */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* 过滤器 */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">筛选:</span>
            </div>

            <Select
              label="分类"
              placeholder="选择分类"
              selectedKeys={[categoryFilter]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setCategoryFilter(selected || 'all');
              }}
              size="sm"
              className="w-40"
              classNames={{
                trigger: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
              }}
              items={[
                { key: 'all', label: '全部分类' },
                { key: 'uncategorized', label: '未分类' },
                ...categories.map((cat) => ({ key: cat.id, label: cat.name })),
              ]}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            <Select
              label="状态"
              placeholder="选择状态"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setStatusFilter(selected || 'all');
              }}
              size="sm"
              className="w-32"
              classNames={{
                trigger: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
              }}
              items={[
                { key: 'all', label: '全部状态' },
                { key: 'active', label: '启用' },
                { key: 'inactive', label: '禁用' },
              ]}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>

            {hasActiveFilters && (
              <Button
                size="sm"
                variant="flat"
                color="default"
                onPress={clearFilters}
                startContent={<X className="w-3 h-3" />}
              >
                清除筛选
              </Button>
            )}
          </div>

          {/* 批量操作 */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3"
              >
                <Chip color="primary" variant="flat" size="sm">
                  已选择 {selectedIds.size} 项
                </Chip>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => setBatchDeleteConfirm(true)}
                  startContent={<Trash2 className="w-4 h-4" />}
                >
                  批量删除
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setSelectedIds(new Set())}
                >
                  取消选择
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 过滤结果统计 */}
        {hasActiveFilters && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            共找到 <span className="font-medium text-gray-700 dark:text-gray-300">{filteredLinks.length}</span> 条结果
            {filteredLinks.length !== links.length && (
              <span>（共 {links.length} 条）</span>
            )}
          </div>
        )}
      </div>

      <LinksTable
        links={filteredLinks}
        categories={categories}
        isLoading={isLoading}
        onEdit={setEditingLink}
        onDelete={setDeleteConfirm}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
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

      {/* 单个删除确认 */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="确认删除"
        message="确定要删除这个链接吗？此操作无法撤销。"
        onConfirm={() => deleteConfirm && handleDeleteLink(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* 批量删除确认 */}
      <ConfirmDialog
        isOpen={batchDeleteConfirm}
        title="确认批量删除"
        message={`确定要删除选中的 ${selectedIds.size} 个链接吗？此操作无法撤销。`}
        confirmText={isBatchDeleting ? "删除中..." : "确认删除"}
        onConfirm={handleBatchDelete}
        onCancel={() => setBatchDeleteConfirm(false)}
      />
    </>
  );
}
