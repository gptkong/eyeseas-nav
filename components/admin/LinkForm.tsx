"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  navigationLinkSchema,
  NavigationLinkFormData,
} from "@/lib/validations";
import { NavigationLink } from "@/lib/types";
import { X, Link as LinkIcon, Globe, Building, Image, Tag, Check, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/useCategories";
import { useNavigation } from "@/lib/hooks/useNavigation";
import { TagSelector } from "../TagSelector";

interface LinkFormProps {
  link?: NavigationLink;
  onSubmit: (data: NavigationLinkFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  open?: boolean;
}

export function LinkForm({
  link,
  onSubmit,
  onCancel,
  isLoading,
  open = true,
}: LinkFormProps) {
  const isEditing = !!link;
  const { categories } = useCategories();
  const { getAllTags } = useNavigation();

  // 分类和标签状态
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const allTags = getAllTags();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NavigationLinkFormData>({
    resolver: zodResolver(navigationLinkSchema),
    defaultValues: {
      title: "",
      internalUrl: "",
      externalUrl: "",
      description: "",
      icon: "",
      favicon: "",
      isActive: true,
      categoryId: "",
      tags: [],
    },
  });

  const isActiveValue = watch("isActive");

  useEffect(() => {
    if (link) {
      reset({
        title: link.title,
        internalUrl: link.internalUrl,
        externalUrl: link.externalUrl,
        description: link.description,
        icon: link.icon || "",
        favicon: link.favicon || "",
        isActive: link.isActive ?? true,
        categoryId: link.categoryId || "",
        tags: link.tags || [],
      });
      setSelectedTags(link.tags || []);
    } else {
      reset({
        title: "",
        internalUrl: "",
        externalUrl: "",
        description: "",
        icon: "",
        favicon: "",
        isActive: true,
        categoryId: "",
        tags: [],
      });
      setSelectedTags([]);
    }
  }, [link, reset]);

  // 处理标签变化
  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    setValue("tags", tags);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-teal-50/50 dark:bg-teal-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {isEditing ? "编辑导航链接" : "添加导航链接"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isEditing ? "修改链接信息" : "创建新的导航链接"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onCancel}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="输入链接标题"
                  className={cn(
                    "w-full h-12 px-4 rounded-xl",
                    "bg-gray-50 dark:bg-gray-900/50",
                    "border-2 transition-all duration-200",
                    "text-gray-900 dark:text-white placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    errors.title
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20"
                  )}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internal URL */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    内网地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://internal.example.com"
                    className={cn(
                      "w-full h-12 px-4 rounded-xl",
                      "bg-gray-50 dark:bg-gray-900/50",
                      "border-2 transition-all duration-200",
                      "text-gray-900 dark:text-white placeholder-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2",
                      errors.internalUrl
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                    )}
                    {...register("internalUrl")}
                  />
                  {errors.internalUrl && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.internalUrl.message}
                    </p>
                  )}
                </div>

                {/* External URL */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                    外网地址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://external.example.com"
                    className={cn(
                      "w-full h-12 px-4 rounded-xl",
                      "bg-gray-50 dark:bg-gray-900/50",
                      "border-2 transition-all duration-200",
                      "text-gray-900 dark:text-white placeholder-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2",
                      errors.externalUrl
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-700 focus:border-green-500 focus:ring-green-500/20"
                    )}
                    {...register("externalUrl")}
                  />
                  {errors.externalUrl && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.externalUrl.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="输入链接的简短描述"
                  rows={3}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl",
                    "bg-gray-50 dark:bg-gray-900/50",
                    "border-2 transition-all duration-200",
                    "text-gray-900 dark:text-white placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    "resize-none",
                    errors.description
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-teal-500/20"
                  )}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Icon and Favicon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="text-xl">🎨</span>
                    图标 (可选)
                  </label>
                  <input
                    type="text"
                    placeholder="输入 emoji 或图标名称"
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                    {...register("icon")}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    可以使用 emoji 或图标名称
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Image className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    Favicon URL (可选)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/favicon.ico"
                    className={cn(
                      "w-full h-12 px-4 rounded-xl",
                      "bg-gray-50 dark:bg-gray-900/50",
                      "border-2 transition-all duration-200",
                      "text-gray-900 dark:text-white placeholder-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-offset-2",
                      errors.favicon
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-200 dark:border-gray-700 focus:border-cyan-500 focus:ring-cyan-500/20"
                    )}
                    {...register("favicon")}
                  />
                  {errors.favicon && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.favicon.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Folder className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  分类 (可选)
                </label>
                <select
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 dark:text-white focus:outline-none transition-all duration-200"
                  {...register("categoryId")}
                >
                  <option value="">无分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon && `${category.icon} `}{category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  选择一个分类来组织你的书签
                </p>
              </div>

              {/* Tags Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  标签 (可选)
                </label>
                <TagSelector
                  selectedTags={selectedTags}
                  allTags={allTags}
                  onChange={handleTagsChange}
                  maxTags={10}
                  placeholder="输入标签并按 Enter"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  添加标签以便更好地筛选和组织书签
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200",
                    isActiveValue
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}>
                    <Check className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActiveValue
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    )} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      激活状态
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      未激活的链接不会显示给用户
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setValue("isActive", !isActiveValue)}
                  className={cn(
                    "relative w-14 h-8 rounded-full transition-all duration-300",
                    isActiveValue
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  )}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ x: isActiveValue ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50",
                    "bg-teal-600 hover:bg-teal-700",
                    "flex items-center gap-2"
                  )}
                >
                  {isLoading && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  )}
                  <span>
                    {isLoading
                      ? "保存中..."
                      : isEditing
                      ? "更新链接"
                      : "创建链接"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
