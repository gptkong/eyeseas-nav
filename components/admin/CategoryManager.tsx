/**
 * CategoryManager 组件
 *
 * 管理后台的分类管理界面，支持：
 * - 分类列表展示
 * - 添加/编辑/删除分类
 * - 分类颜色和图标设置
 */

"use client";

import { useState } from "react";
import { useCategories } from "@/lib/hooks/useCategories";
import { Category, CreateCategoryData } from "@/lib/types";
import { Plus, Edit, Trash2, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// 可用颜色选项
const COLORS = [
  { value: "blue", label: "蓝色", class: "bg-blue-500" },
  { value: "green", label: "绿色", class: "bg-green-500" },
  { value: "purple", label: "紫色", class: "bg-purple-500" },
  { value: "pink", label: "粉色", class: "bg-pink-500" },
  { value: "orange", label: "橙色", class: "bg-orange-500" },
  { value: "indigo", label: "靛蓝", class: "bg-indigo-500" },
  { value: "red", label: "红色", class: "bg-red-500" },
  { value: "yellow", label: "黄色", class: "bg-yellow-500" },
];

export function CategoryManager() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    icon: "",
    color: "blue",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await createCategory(formData);
    }

    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: "", icon: "", color: "blue" });
  };

  // 开始编辑
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || "",
      color: category.color || "blue",
    });
    setShowForm(true);
  };

  // 删除分类
  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    setDeleteConfirm(null);
  };

  // 取消操作
  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: "", icon: "", color: "blue" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            分类管理
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            管理书签分类，组织您的导航链接
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          新建分类
        </motion.button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {category.icon && (
                    <span className="text-2xl">{category.icon}</span>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        COLORS.find(c => c.value === category.color)?.class || "bg-blue-500"
                      )} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {COLORS.find(c => c.value === category.color)?.label || "蓝色"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {categories.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>还没有分类，点击&quot;新建分类&quot;开始添加</p>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingCategory ? "编辑分类" : "新建分类"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    分类名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    placeholder="例如：工作、学习、娱乐"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    图标 (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    placeholder="🏢"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    颜色主题
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-all",
                          formData.color === color.value
                            ? "border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-900 dark:ring-white"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-400"
                        )}
                      >
                        <div className={cn("w-full h-6 rounded", color.class)} />
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                          {color.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
                  >
                    {editingCategory ? "更新" : "创建"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                确认删除？
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                删除分类后，该分类下的链接将变为&quot;无分类&quot;状态。此操作不可撤销。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
