"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";

interface AdminHeaderProps {
  onLogout: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                管理后台
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">导航链接管理系统</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Home className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">首页</span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="px-3 sm:px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">退出</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
