"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Command, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
}

export function SearchAndFilter({ onSearch }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && isFocused) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="mb-8 sm:mb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-3xl mx-auto"
      >
        {/* Search Container */}
        <div
          className={cn(
            "relative group",
            "rounded-2xl",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
            "border-2 transition-all duration-300",
            isFocused
              ? "border-indigo-500 dark:border-indigo-400 shadow-xl shadow-indigo-500/10"
              : "border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          )}
        >
          {/* Search Icon */}
          <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{
                scale: isFocused ? 1.1 : 1,
                rotate: isFocused ? 5 : 0,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isFocused
                    ? "text-indigo-500 dark:text-indigo-400"
                    : "text-gray-400"
                )}
              />
            </motion.div>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            placeholder="搜索导航链接..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full h-14 sm:h-16",
              "pl-12 sm:pl-14 pr-28 sm:pr-32",
              "text-base sm:text-lg font-medium",
              "text-gray-900 dark:text-white placeholder-gray-400",
              "bg-transparent",
              "outline-none",
              "transition-all duration-300"
            )}
          />

          {/* Right Section */}
          <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Clear Button */}
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClear}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  type="button"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Keyboard Shortcut */}
            <motion.div
              className={cn(
                "hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg",
                "bg-gray-100 dark:bg-gray-700/50",
                "border border-gray-200 dark:border-gray-600",
                "transition-all duration-300",
                isFocused && "opacity-0"
              )}
              animate={{ opacity: isFocused ? 0 : 1 }}
            >
              <Command className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                K
              </span>
            </motion.div>
          </div>

          {/* Bottom Glow */}
          <motion.div
            className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Search Tips */}
        <AnimatePresence>
          {isFocused && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-3 left-0 right-0 z-20"
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  💡 提示：输入关键词快速搜索您的导航链接
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
