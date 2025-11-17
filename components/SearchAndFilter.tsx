"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Command, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
}

const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

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
    <div className="relative flex-1 max-w-xl">
      <div
        className={cn(
          "relative rounded-xl transition-all duration-300",
          "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
          "border",
          isFocused
            ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10"
            : "border-gray-200/50 dark:border-gray-700/50"
        )}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search
            className={cn(
              "w-4 h-4 transition-colors",
              isFocused ? "text-indigo-500 dark:text-indigo-400" : "text-gray-400"
            )}
          />
        </div>

        <input
          ref={inputRef}
          type="search"
          placeholder="搜索导航链接..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full h-10 pl-10 pr-20 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                type="button"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div
            className={cn(
              "hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-md",
              "bg-gray-100 dark:bg-gray-700/50",
              "border border-gray-200 dark:border-gray-600",
              isFocused && "opacity-0"
            )}
            animate={{ opacity: isFocused ? 0 : 1 }}
          >
            {isMac ? (
              <Command className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            ) : (
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Ctrl</span>
            )}
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">K</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
