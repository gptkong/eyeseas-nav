/**
 * TagManager 组件
 *
 * 管理后台的标签管理界面，支持：
 * - 查看所有标签及使用次数
 * - 重命名标签
 * - 删除标签
 * - 合并多个标签
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { useTags, TagStats } from "@/lib/hooks/useTags";
import { 
  Tag as TagIcon, 
  Edit, 
  Trash2, 
  Merge, 
  Search,
  CheckSquare,
  Square,
  X,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function TagManager() {
  const { tags, isLoading, isSubmitting, renameTag, deleteTag, mergeTags, fetchTags } = useTags();
  const { success, error: showError } = useToast();

  // 搜索和选择状态
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // 模态框状态
  const [renameModal, setRenameModal] = useState<{ tag: string; newName: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mergeModal, setMergeModal] = useState<{ targetTag: string } | null>(null);

  // 过滤标签
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter(t => t.tag.toLowerCase().includes(query));
  }, [tags, searchQuery]);

  // 切换选择
  const toggleSelect = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback(() => {
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(filteredTags.map(t => t.tag));
    }
  }, [selectedTags, filteredTags]);

  // 重命名标签
  const handleRename = useCallback(async () => {
    if (!renameModal || !renameModal.newName.trim()) return;
    
    const result = await renameTag(renameModal.tag, renameModal.newName.trim());
    
    if (result.success) {
      success(`标签 "${renameModal.tag}" 已重命名为 "${renameModal.newName}"`);
      setRenameModal(null);
    } else {
      showError(result.error || "重命名失败");
    }
  }, [renameModal, renameTag, success, showError]);

  // 删除标签
  const handleDelete = useCallback(async () => {
    if (!deleteConfirm) return;
    
    const result = await deleteTag(deleteConfirm);
    
    if (result.success) {
      success(`标签 "${deleteConfirm}" 已删除`);
      setDeleteConfirm(null);
      setSelectedTags(prev => prev.filter(t => t !== deleteConfirm));
    } else {
      showError(result.error || "删除失败");
    }
  }, [deleteConfirm, deleteTag, success, showError]);

  // 合并标签
  const handleMerge = useCallback(async () => {
    if (!mergeModal || selectedTags.length < 2) return;
    
    const result = await mergeTags(selectedTags, mergeModal.targetTag);
    
    if (result.success) {
      success(`已将 ${selectedTags.length} 个标签合并为 "${mergeModal.targetTag}"`);
      setMergeModal(null);
      setSelectedTags([]);
    } else {
      showError(result.error || "合并失败");
    }
  }, [mergeModal, selectedTags, mergeTags, success, showError]);

  // 批量删除
  const handleBatchDelete = useCallback(async () => {
    if (selectedTags.length === 0) return;
    
    let successCount = 0;
    let failCount = 0;
    
    for (const tag of selectedTags) {
      const result = await deleteTag(tag);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    if (successCount > 0) {
      success(`成功删除 ${successCount} 个标签`);
    }
    if (failCount > 0) {
      showError(`${failCount} 个标签删除失败`);
    }
    
    setSelectedTags([]);
  }, [selectedTags, deleteTag, success, showError]);

  return (
    <div className="space-y-6">
      {/* 统计和刷新 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          共 <span className="font-semibold text-gray-900 dark:text-white">{tags.length}</span> 个标签
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchTags()}
          disabled={isLoading}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="刷新"
        >
          <RefreshCw className={cn("w-5 h-5 text-gray-600 dark:text-gray-400", isLoading && "animate-spin")} />
        </motion.button>
      </div>

      {/* 搜索和批量操作 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 搜索框 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索标签..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
        
        {/* 批量操作按钮 */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              已选 {selectedTags.length} 项
            </span>
            {selectedTags.length >= 2 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMergeModal({ targetTag: selectedTags[0] })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
              >
                <Merge className="w-4 h-4" />
                合并
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBatchDelete}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </motion.button>
            <button
              onClick={() => setSelectedTags([])}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* 标签列表 */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filteredTags.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <TagIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>{searchQuery ? "未找到匹配的标签" : "还没有任何标签"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* 全选 */}
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {selectedTags.length === filteredTags.length ? (
              <CheckSquare className="w-4 h-4 text-teal-600" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            全选
          </button>
          
          {/* 标签卡片列表 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {filteredTags.map((tagStat) => (
                <TagCard
                  key={tagStat.tag}
                  tagStat={tagStat}
                  isSelected={selectedTags.includes(tagStat.tag)}
                  onToggleSelect={() => toggleSelect(tagStat.tag)}
                  onRename={() => setRenameModal({ tag: tagStat.tag, newName: tagStat.tag })}
                  onDelete={() => setDeleteConfirm(tagStat.tag)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 重命名模态框 */}
      <AnimatePresence>
        {renameModal && (
          <Modal onClose={() => setRenameModal(null)}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              重命名标签
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  原标签名
                </label>
                <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {renameModal.tag}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  新标签名
                </label>
                <input
                  type="text"
                  value={renameModal.newName}
                  onChange={(e) => setRenameModal({ ...renameModal, newName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="输入新标签名"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRenameModal(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleRename}
                  disabled={isSubmitting || !renameModal.newName.trim() || renameModal.newName === renameModal.tag}
                  className="flex-1 px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* 删除确认模态框 */}
      <AnimatePresence>
        {deleteConfirm && (
          <Modal onClose={() => setDeleteConfirm(null)}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              确认删除？
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              确定要删除标签 <span className="font-semibold text-gray-900 dark:text-white">&quot;{deleteConfirm}&quot;</span> 吗？
              此操作将从所有使用该标签的链接中移除它。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "删除中..." : "确认删除"}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* 合并模态框 */}
      <AnimatePresence>
        {mergeModal && (
          <Modal onClose={() => setMergeModal(null)}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              合并标签
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  要合并的标签 ({selectedTags.length} 个)
                </label>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  合并为
                </label>
                <input
                  type="text"
                  value={mergeModal.targetTag}
                  onChange={(e) => setMergeModal({ targetTag: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  placeholder="输入目标标签名"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setMergeModal(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleMerge}
                  disabled={isSubmitting || !mergeModal.targetTag.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "合并中..." : "确认合并"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// 标签卡片组件
interface TagCardProps {
  tagStat: TagStats;
  isSelected: boolean;
  onToggleSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
}

function TagCard({ tagStat, isSelected, onToggleSelect, onRename, onDelete }: TagCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border-2 transition-all",
        isSelected
          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSelect}
          className="flex-shrink-0"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-teal-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          )}
        </button>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium text-gray-900 dark:text-white truncate">
              {tagStat.tag}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {tagStat.count} 个链接使用
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onRename}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="重命名"
        >
          <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title="删除"
        >
          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
        </button>
      </div>
    </motion.div>
  );
}

// 模态框组件
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

