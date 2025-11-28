/**
 * CategoryTabs 组件
 *
 * 使用 HeroUI 原始 Tabs 组件实现分类切换
 * - 支持"全部"和自定义分类
 * - 使用 HeroUI 默认样式和动画
 * - 简洁、高效的标签切换体验
 */

"use client";

import { Tabs, Tab } from "@heroui/react";
import { Category } from "@/lib/types";
import { Plus } from "lucide-react";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string | null; // null 表示"全部"
  onCategoryChange: (categoryId: string | null) => void;
  onAddCategory?: () => void;
  onAddCategoryClick?: () => void; // 替代 onAddCategory，向后兼容
  className?: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  onAddCategory,
  onAddCategoryClick,
  className,
}: CategoryTabsProps) {
  // 处理选择变化
  const handleSelectionChange = (key: React.Key) => {
    const categoryId = key === "all" ? null : (key as string);
    onCategoryChange(categoryId);
  };

  // 处理添加分类按钮点击
  const handleAddClick = onAddCategoryClick || onAddCategory;

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <Tabs
          aria-label="分类筛选"
          selectedKey={activeCategory || "all"}
          onSelectionChange={handleSelectionChange}
          variant="solid"
          color="primary"
          classNames={{
            tabList: "gap-2 bg-default-100 dark:bg-default-50/10 p-1 rounded-lg",
            tab: "h-10",
            cursor: "bg-primary shadow-sm"
          }}
        >
          {/* 分类 Tabs */}
          {categories.map((category) => (
            <Tab
              key={category.id}
              title={
                <div className="flex items-center gap-2">
                  {category.icon && (
                    <span className="text-base">{category.icon}</span>
                  )}
                  <span>{category.name}</span>
                </div>
              }
            />
          ))}
        </Tabs>

        {/* 添加分类按钮 */}
        {handleAddClick && (
          <button
            onClick={handleAddClick}
            className="flex-shrink-0 px-3 py-2 h-10 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/40 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
            title="新建分类"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">新建分类</span>
          </button>
        )}
      </div>
    </div>
  );
}
