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
import { X, Tag as TagIcon } from "lucide-react";
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
  placeholder = "输入标签并按 Enter",
  className,
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { warning } = useToast();

  // 过滤建议标签（排除已选中的）
  const suggestions = allTags.filter(
    (tag) =>
      !selectedTags.includes(tag) &&
      tag.toLowerCase().includes(inputValue.toLowerCase())
  );

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
    setShowSuggestions(false);
  }, [selectedTags, maxTags, onChange, warning]);

  // 处理键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      // 按退格键删除最后一个标签
      onChange(selectedTags.slice(0, -1));
    }
  }, [inputValue, selectedTags, addTag, onChange]);

  // 删除标签
  const removeTag = useCallback((tag: string) => {
    onChange(selectedTags.filter((t) => t !== tag));
  }, [selectedTags, onChange]);

  return (
    <div className={cn("relative", className)}>
      {/* 标签输入区域 */}
      <div className="min-h-[42px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500">
        <div className="flex flex-wrap gap-2 items-center">
          {/* 已选标签 */}
          <AnimatePresence>
            {selectedTags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium"
              >
                <TagIcon className="w-3 h-3" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-full p-0.5 transition-colors"
                  aria-label={`删除标签 ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 输入框 */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={selectedTags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={selectedTags.length >= maxTags}
          />
        </div>
      </div>

      {/* 标签建议下拉 */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && inputValue && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          >
            {suggestions.slice(0, 10).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-colors"
              >
                <TagIcon className="w-4 h-4 text-gray-400" />
                <span>{tag}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示文本 */}
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
        已选 {selectedTags.length} / {maxTags} 个标签
        {selectedTags.length < maxTags && " · 按 Enter 添加"}
      </p>
    </div>
  );
}
