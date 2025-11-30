/**
 * IconPicker 组件
 *
 * 可视化图标选择器，支持：
 * - Emoji 图标（分类展示）
 * - Lucide 图标（搜索 + 网格）
 */

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { CategoryIconType } from "@/lib/types";
import {
  CategoryIcon,
  SUGGESTED_LUCIDE_ICONS,
  SUGGESTED_EMOJIS,
} from "@/components/CategoryIcon";

// PascalCase 转 kebab-case
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

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

  // 过滤 Lucide 图标
  const filteredLucideIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return SUGGESTED_LUCIDE_ICONS;
    }
    const query = searchQuery.toLowerCase();
    return SUGGESTED_LUCIDE_ICONS.filter((iconName) =>
      iconName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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

            {/* Lucide 图标网格 */}
            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              <div className="grid grid-cols-8 gap-1">
                {filteredLucideIcons.map((iconName) => (
                  <LucideIconButton
                    key={iconName}
                    iconName={iconName}
                    isSelected={value === iconName && iconType === "lucide"}
                    onClick={() => handleSelect(iconName, "lucide")}
                  />
                ))}
              </div>
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
  // 转换为 kebab-case 格式
  const kebabName = toKebabCase(iconName) as IconName;

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
      <DynamicIcon name={kebabName} size={18} />
    </motion.button>
  );
}

