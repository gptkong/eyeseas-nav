/**
 * QuickTagFilter 组件
 *
 * 快速标签筛选器，支持：
 * - 显示热门标签芯片
 * - 点击切换选中状态
 * - 显示已选标签数量
 */

"use client";

import { motion } from "framer-motion";
import { Tag as TagIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickTagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClear?: () => void;
  maxDisplay?: number;
  className?: string;
}

export function QuickTagFilter({
  tags,
  selectedTags,
  onTagToggle,
  onClear,
  maxDisplay = 15,
  className,
}: QuickTagFilterProps) {
  // 如果没有标签，显示空状态
  if (tags.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
          <TagIcon className="w-4 h-4" />
          <span className="text-sm">暂无可用标签</span>
        </div>
      </div>
    );
  }

  const displayTags = tags.slice(0, maxDisplay);
  const hasMore = tags.length > maxDisplay;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-3">
        {/* 标签图标和标题 */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <TagIcon className="w-4 h-4" />
          <span className="text-sm font-medium">快速筛选：</span>
        </div>

        {/* 标签芯片列表 */}
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          {displayTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);

            return (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTagToggle(tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border",
                  isSelected
                    ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {tag}
              </motion.button>
            );
          })}

          {hasMore && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{tags.length - maxDisplay} 更多
            </span>
          )}
        </div>

        {/* 清除按钮 */}
        {selectedTags.length > 0 && onClear && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <X className="w-3 h-3" />
            清除 ({selectedTags.length})
          </motion.button>
        )}
      </div>
    </div>
  );
}
