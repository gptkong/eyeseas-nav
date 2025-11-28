"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        "relative w-10 h-10 rounded-xl",
        "bg-gray-100 dark:bg-gray-800",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "border border-gray-200 dark:border-gray-700",
        "flex items-center justify-center",
        "transition-colors duration-200 overflow-hidden",
        className
      )}
      title={isDark ? "切换到浅色主题" : "切换到深色主题"}
      aria-label={isDark ? "切换到浅色主题" : "切换到深色主题"}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-cyan-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glow */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl",
          isDark ? "bg-cyan-500/10" : "bg-amber-500/10"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
