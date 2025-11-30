/**
 * CategorySidebar 组件
 *
 * 左侧垂直分类导航栏
 * - 支持"全部"和自定义分类
 * - 优雅的悬浮和选中效果
 * - 响应式设计，支持折叠
 */

"use client";

import { Category, CategoryIconType } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CategoryIcon } from "@/components/CategoryIcon";

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  linkCounts?: Record<string, number>;
  totalCount?: number;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function CategorySidebar({
  categories,
  activeCategory,
  onCategoryChange,
  linkCounts = {},
  totalCount = 0,
  className,
  isCollapsed = false,
  onToggleCollapse,
}: CategorySidebarProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative flex flex-col h-full w-full",
        "bg-white/80 dark:bg-gray-900/80",
        "backdrop-blur-xl",
        "border-r border-gray-200/50 dark:border-gray-700/50",
        "overflow-hidden",
        className
      )}
    >
      {/* 分类列表 */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
        {/* 全部分类 */}
        <CategoryItem
          id={null}
          name="全部"
          icon="BookMarked"
          iconType="lucide"
          count={totalCount}
          isActive={activeCategory === null}
          isCollapsed={isCollapsed}
          isHovered={hoveredCategory === "all"}
          onHover={() => setHoveredCategory("all")}
          onLeave={() => setHoveredCategory(null)}
          onClick={() => onCategoryChange(null)}
        />

        {/* 分类分割线 */}
        {categories.length > 0 && (
          <div className="my-2 mx-2 border-t border-gray-200/50 dark:border-gray-700/50" />
        )}

        {/* 各个分类 */}
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            iconType={category.iconType}
            count={linkCounts[category.id] || 0}
            isActive={activeCategory === category.id}
            isCollapsed={isCollapsed}
            isHovered={hoveredCategory === category.id}
            onHover={() => setHoveredCategory(category.id)}
            onLeave={() => setHoveredCategory(null)}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </nav>

      {/* 底部 - 折叠按钮 */}
      {onToggleCollapse && (
        <div className="px-2 py-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <motion.button
            whileHover={{ backgroundColor: "rgba(20, 184, 166, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleCollapse}
            className={cn(
              "w-full rounded-xl py-2",
              "flex items-center justify-center gap-2",
              "text-gray-500 dark:text-gray-400",
              "hover:text-teal-600 dark:hover:text-teal-400",
              "transition-all duration-200"
            )}
            title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium">收起</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
}

interface CategoryItemProps {
  id: string | null;
  name: string;
  icon?: string;
  iconType?: CategoryIconType;
  count: number;
  isActive: boolean;
  isCollapsed: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function CategoryItem({
  name,
  icon,
  iconType,
  count,
  isActive,
  isCollapsed,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: CategoryItemProps) {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full rounded-xl transition-all duration-200",
        isCollapsed ? "p-3 justify-center" : "px-3 py-2.5",
        "flex items-center gap-3",
        isActive
          ? "bg-gradient-to-r from-teal-500/15 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/15 text-teal-700 dark:text-teal-300"
          : "hover:bg-gray-100/80 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
      )}
    >
      {/* 选中指示器 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-r-full"
          />
        )}
      </AnimatePresence>

      {/* 图标 */}
      <div
        className={cn(
          "flex-shrink-0 transition-transform duration-200",
          isHovered && "scale-110"
        )}
      >
        <CategoryIcon icon={icon} iconType={iconType} size="md" />
      </div>

      {/* 名称和计数 */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1 flex items-center justify-between min-w-0 overflow-hidden"
          >
            <span
              className={cn(
                "font-medium truncate transition-colors duration-200",
                isActive ? "text-teal-700 dark:text-teal-300" : ""
              )}
            >
              {name}
            </span>
            {count > 0 && (
              <span
                className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0",
                  isActive
                    ? "bg-teal-500/20 text-teal-700 dark:text-teal-300"
                    : "bg-gray-200/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-400"
                )}
              >
                {count}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 折叠状态下的 tooltip */}
      {isCollapsed && isHovered && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="absolute left-full ml-2 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium whitespace-nowrap z-50 shadow-lg"
        >
          {name}
          {count > 0 && (
            <span className="ml-2 text-gray-400 dark:text-gray-500">
              ({count})
            </span>
          )}
        </motion.div>
      )}
    </motion.button>
  );
}

