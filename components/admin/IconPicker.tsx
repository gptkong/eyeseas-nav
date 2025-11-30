/**
 * IconPicker 组件
 *
 * 可视化图标选择器，支持：
 * - Emoji 图标（分类展示）
 * - Lucide 图标（搜索 + 网格）- 支持所有 Lucide 图标，分页加载
 */

"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIconType } from "@/lib/types";
import {
  CategoryIcon,
  SUGGESTED_EMOJIS,
} from "@/components/CategoryIcon";

// 每页显示的图标数量
const ICONS_PER_PAGE = 80;

// 获取所有 Lucide 图标名称（过滤掉非图标的导出）
const ALL_LUCIDE_ICONS = Object.keys(LucideIcons).filter((name) => {
  // 过滤掉工具函数、类型和非图标导出
  const nonIconExports = [
    "createLucideIcon",
    "Icon",
    "IconNode",
    "LucideIcon",
    "LucideProps",
    "icons",
    "default",
  ];
  if (nonIconExports.includes(name)) return false;
  // 图标名称应该是 PascalCase 且首字母大写
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) return false;
  // 确保是有效的 React 组件
  const icon = LucideIcons[name as keyof typeof LucideIcons];
  return typeof icon === "function" || (typeof icon === "object" && icon !== null);
}).sort();

interface IconPickerProps {
  value?: string;
  iconType?: CategoryIconType;
  onChange: (icon: string, iconType: CategoryIconType) => void;
  className?: string;
}

type TabType = "emoji" | "lucide";

export function IconPicker({
  value,
  iconType = "emoji",
  onChange,
  className,
}: IconPickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>(iconType);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEmojiCategory, setActiveEmojiCategory] = useState("常用");
  const [displayCount, setDisplayCount] = useState(ICONS_PER_PAGE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 过滤 Lucide 图标
  const filteredLucideIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return ALL_LUCIDE_ICONS;
    }
    const query = searchQuery.toLowerCase();
    return ALL_LUCIDE_ICONS.filter((iconName) =>
      iconName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 当前显示的图标（分页）
  const displayedIcons = useMemo(() => {
    return filteredLucideIcons.slice(0, displayCount);
  }, [filteredLucideIcons, displayCount]);

  // 是否还有更多图标
  const hasMore = displayCount < filteredLucideIcons.length;

  // 加载更多图标
  const loadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + ICONS_PER_PAGE, filteredLucideIcons.length));
  }, [filteredLucideIcons.length]);

  // 搜索时重置分页
  useEffect(() => {
    setDisplayCount(ICONS_PER_PAGE);
  }, [searchQuery]);

  // 滚动到底部时自动加载更多
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // 距离底部 50px 时加载更多
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore]);

  // 当前选中的 emoji 分类
  const currentEmojis = SUGGESTED_EMOJIS[activeEmojiCategory] || [];

  const handleSelect = (icon: string, type: CategoryIconType) => {
    onChange(icon, type);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tab 切换 */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("emoji")}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
            activeTab === "emoji"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <span className="text-base">😀</span>
          Emoji
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("lucide")}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
            activeTab === "lucide"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          图标
        </button>
      </div>

      {/* 当前选中预览 */}
      {value && (
        <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            当前选择:
          </span>
          <CategoryIcon icon={value} iconType={iconType} size="lg" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {iconType === "lucide" ? value : ""}
          </span>
          <button
            type="button"
            onClick={() => onChange("", "emoji")}
            className="ml-auto p-1 hover:bg-teal-100 dark:hover:bg-teal-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === "emoji" ? (
          <motion.div
            key="emoji"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Emoji 分类切换 */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(SUGGESTED_EMOJIS).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveEmojiCategory(category)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg transition-all",
                    activeEmojiCategory === category
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Emoji 网格 */}
            <div className="grid grid-cols-10 gap-1">
              {currentEmojis.map((emoji) => (
                <EmojiButton
                  key={emoji}
                  emoji={emoji}
                  isSelected={value === emoji && iconType === "emoji"}
                  onClick={() => handleSelect(emoji, "emoji")}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="lucide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索图标名称..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>

            {/* 图标数量提示 */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                显示 {displayedIcons.length} / {filteredLucideIcons.length} 个图标
              </span>
              {searchQuery && (
                <span>搜索结果</span>
              )}
            </div>

            {/* Lucide 图标网格 */}
            <div 
              ref={scrollContainerRef}
              className="max-h-64 overflow-y-auto scrollbar-thin"
              onScroll={handleScroll}
            >
              <div className="grid grid-cols-8 gap-1">
                {displayedIcons.map((iconName) => (
                  <LucideIconButton
                    key={iconName}
                    iconName={iconName}
                    isSelected={value === iconName && iconType === "lucide"}
                    onClick={() => handleSelect(iconName, "lucide")}
                  />
                ))}
              </div>
              
              {/* 加载更多提示 */}
              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="w-full mt-2 py-2 flex items-center justify-center gap-1 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  加载更多 ({filteredLucideIcons.length - displayCount} 个)
                </button>
              )}
              
              {filteredLucideIcons.length === 0 && (
                <p className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  未找到匹配的图标
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Emoji 按钮组件
function EmojiButton({
  emoji,
  isSelected,
  onClick,
}: {
  emoji: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "w-9 h-9 flex items-center justify-center text-xl rounded-lg transition-all",
        isSelected
          ? "bg-teal-100 dark:bg-teal-900/50 ring-2 ring-teal-500"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      {emoji}
    </motion.button>
  );
}

// Lucide 图标按钮组件
function LucideIconButton({
  iconName,
  isSelected,
  onClick,
}: {
  iconName: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  // 直接从导入的图标对象中获取组件
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string }>;

  if (!IconComponent) return null;

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={iconName}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-lg transition-all",
        isSelected
          ? "bg-teal-100 dark:bg-teal-900/50 ring-2 ring-teal-500 text-teal-600 dark:text-teal-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
      )}
    >
      <IconComponent size={18} />
    </motion.button>
  );
}

