/**
 * TagSelector 组件
 *
 * 用于表单中的多标签选择器，支持：
 * - 输入新标签
 * - 从现有标签选择
 * - 删除已选标签
 * - 最大标签数量限制
 */

"use client";

import { useState, KeyboardEvent, useCallback } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface TagSelectorProps {
  selectedTags: string[];
  allTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

export function TagSelector({
  selectedTags,
  allTags,
  onChange,
  maxTags = 10,
  placeholder = "新建标签",
  className,
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const { warning } = useToast();

  // 可选标签（排除已选中的）
  const availableTags = allTags.filter((tag) => !selectedTags.includes(tag));

  // 添加标签
  const addTag = useCallback((tag: string) => {
    if (!tag.trim()) return;

    if (selectedTags.length >= maxTags) {
      warning(`最多只能添加 ${maxTags} 个标签`);
      return;
    }

    if (selectedTags.includes(tag.trim())) {
      warning("标签已存在");
      return;
    }

    onChange([...selectedTags, tag.trim()]);
    setInputValue("");
  }, [selectedTags, maxTags, onChange, warning]);

  // 处理键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      onChange(selectedTags.slice(0, -1));
    }
  }, [inputValue, selectedTags, addTag, onChange]);

  // 删除标签
  const removeTag = useCallback((tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag));
  }, [selectedTags, onChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {/* 已选标签 + 可选标签 */}
      <div className="flex flex-wrap gap-1.5">
        {/* 已选标签 */}
        <AnimatePresence mode="popLayout">
          {selectedTags.map((tag) => (
            <motion.button
              key={`selected-${tag}`}
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => removeTag(tag)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
                "hover:bg-emerald-200 dark:hover:bg-emerald-900/50",
                "transition-colors duration-150"
              )}
            >
              <span>{tag}</span>
              <X className="w-3 h-3" />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* 可选标签 */}
        {availableTags.slice(0, 8).map((tag) => (
          <motion.button
            key={`available-${tag}`}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addTag(tag)}
            disabled={selectedTags.length >= maxTags}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              "border border-dashed border-gray-300 dark:border-gray-600",
              "text-gray-500 dark:text-gray-400",
              "hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400",
              "hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Plus className="w-3 h-3" />
            <span>{tag}</span>
          </motion.button>
        ))}

        {/* 新建标签输入框 */}
        {selectedTags.length < maxTags && (
          <div className="inline-flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                "w-20 px-2 py-1 rounded-md text-xs",
                "bg-gray-50 dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700",
                "text-gray-900 dark:text-white placeholder-gray-400",
                "focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20",
                "transition-all duration-150"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
