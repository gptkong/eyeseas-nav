/**
 * CategoryTabs 测试组件
 *
 * 测试 HeroUI 原始 Tabs 组件的功能和样式
 */

"use client";

import { useState } from "react";
import { CategoryTabs } from "./CategoryTabs";

export function CategoryTabsTest() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    { id: "1", name: "AI工具", icon: "🤖", color: "blue", order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "2", name: "开发工具", icon: "💻", color: "green", order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "3", name: "设计资源", icon: "🎨", color: "purple", order: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "4", name: "学习平台", icon: "📚", color: "orange", order: 4, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "5", name: "项目管理", icon: "📊", color: "pink", order: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 测试标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">HeroUI 原始 Tabs 测试</h1>
        <p className="text-gray-600 dark:text-gray-400">
          测试使用 HeroUI 默认样式的分类标签切换组件
        </p>
      </div>

      {/* 测试区域 1: 基础功能 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">1. 基础功能测试</h2>
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onAddCategory={() => alert("点击了添加按钮！")}
        />
      </div>

      {/* 测试区域 2: 空分类列表 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">2. 空分类列表</h2>
        <CategoryTabs
          categories={[]}
          activeCategory={null}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* 测试区域 3: 大量分类 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">3. 大量分类（测试滚动）</h2>
        <div className="overflow-x-auto">
          <CategoryTabs
            categories={Array.from({ length: 10 }, (_, i) => ({
              id: `cat-${i}`,
              name: `分类 ${i + 1}`,
              icon: ["📌", "⭐", "🔥", "💎", "🎯", "🚀", "⚡", "🎁", "🌟", "🎪"][i],
              color: ["blue", "green", "purple", "pink", "orange", "indigo", "red", "yellow"][i % 8],
              order: i + 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }))}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </div>

      {/* 测试区域 4: 无添加按钮 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">4. 无添加按钮模式</h2>
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      {/* 当前选择状态 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-2">当前选择状态</h2>
        <p className="text-lg">
          {activeCategory === null
            ? "全部"
            : categories.find((c) => c.id === activeCategory)?.name || "未知"}
        </p>
      </div>

      {/* 特性说明 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
          ✨ 使用 HeroUI 原始样式
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span><strong>简洁设计：</strong>使用 HeroUI 默认样式，无需自定义</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span><strong>原生动画：</strong>HeroUI 内置的平滑过渡效果</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span><strong>响应式：</strong>自动适配不同屏幕尺寸</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span><strong>可访问性：</strong>完整的 ARIA 支持和键盘导航</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span><strong>高性能：</strong>无额外样式开销，渲染更快</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
