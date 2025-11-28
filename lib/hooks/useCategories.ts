/**
 * useCategories Hook
 *
 * 用于管理分类的自定义 Hook
 * 提供分类的 CRUD 操作和状态管理
 */

import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { Category, CreateCategoryData, ApiResponse } from "@/lib/types";
import { post, put, del } from "@/lib/api-client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 SWR 获取分类列表
  const {
    data,
    error: swrError,
    mutate,
    isLoading: swrLoading,
  } = useSWR<ApiResponse<Category[]>>("/api/categories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

  const categories = useMemo(() => data?.data || [], [data]);
  const isLoading = swrLoading || !data;

  // 创建分类
  const createCategory = useCallback(
    async (categoryData: CreateCategoryData): Promise<ApiResponse<Category>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await post<Category, CreateCategoryData>("/api/categories", categoryData);

        if (result.success && result.data) {
          // 乐观更新
          await mutate({ success: true, data: [...categories, result.data] }, false);
          return result;
        }

        setError(result.error || "创建分类失败");
        return result;
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutate, categories]
  );

  // 更新分类
  const updateCategory = useCallback(
    async (
      id: string,
      categoryData: Partial<CreateCategoryData>
    ): Promise<ApiResponse<Category>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await put<Category, Partial<CreateCategoryData>>(`/api/categories/${id}`, categoryData);

        if (result.success && result.data) {
          // 乐观更新
          const updatedCategories = categories.map(cat =>
            cat.id === id ? result.data! : cat
          );
          await mutate({ success: true, data: updatedCategories }, false);
          return result;
        }

        setError(result.error || "更新分类失败");
        return result;
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutate, categories]
  );

  // 删除分类
  const deleteCategory = useCallback(
    async (id: string): Promise<ApiResponse<void>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await del<void>(`/api/categories/${id}`);

        if (result.success) {
          // 乐观更新
          const updatedCategories = categories.filter(cat => cat.id !== id);
          await mutate({ success: true, data: updatedCategories }, false);
          return result;
        }

        setError(result.error || "删除分类失败");
        return result;
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutate, categories]
  );

  // 重新排序分类
  const reorderCategories = useCallback(
    async (categoryIds: string[]): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);

      // 保存当前数据用于回滚
      const previousCategories = categories;

      try {
        // 乐观更新
        const reorderedCategories = categoryIds.map((id, index) => {
          const category = categories.find((c) => c.id === id);
          return category ? { ...category, order: index } : null;
        }).filter((c): c is Category => c !== null);

        await mutate({ success: true, data: reorderedCategories }, false);

        // 发送请求到后端保存排序
        const result = await post<null, { categoryIds: string[] }>("/api/categories/reorder", { categoryIds });

        if (!result.success) {
          // 请求失败，回滚到之前的数据
          await mutate({ success: true, data: previousCategories }, false);
          setError(result.error || "重新排序失败");
          return false;
        }

        return true;
      } catch {
        setError("重新排序失败");
        await mutate({ success: true, data: previousCategories }, false); // 恢复数据
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [categories, mutate]
  );

  // 刷新分类列表
  const fetchCategories = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    categories,
    isLoading,
    isSubmitting,
    error: error || (swrError ? "加载分类失败" : null),
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    fetchCategories,
  };
}
