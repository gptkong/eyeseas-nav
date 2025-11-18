/**
 * useCategories Hook
 *
 * 用于管理分类的自定义 Hook
 * 提供分类的 CRUD 操作和状态管理
 */

import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { Category, CreateCategoryData, ApiResponse } from "@/lib/types";
import { useAuth } from "./useAuth";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeaders } = useAuth();

  // 使用 SWR 获取分类列表
  const {
    data,
    error: swrError,
    mutate,
  } = useSWR<ApiResponse<Category[]>>("/api/categories", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const categories = useMemo(() => data?.data || [], [data]);

  // 创建分类
  const createCategory = useCallback(
    async (categoryData: CreateCategoryData): Promise<ApiResponse<Category>> => {
      setIsLoading(true);
      setError(null);

      try {
        const authHeaders = getAuthHeaders();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (authHeaders.Authorization) {
          headers.Authorization = authHeaders.Authorization;
        }

        const response = await fetch("/api/categories", {
          method: "POST",
          headers,
          body: JSON.stringify(categoryData),
        });

        const result = await response.json();

        if (result.success) {
          // 乐观更新：立即添加新分类到本地缓存
          const newCategory = result.data;
          if (newCategory) {
            await mutate({ success: true, data: [...categories, newCategory] }, false);
          }
        } else {
          setError(result.error || "创建分类失败");
        }

        return result;
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, getAuthHeaders, categories]
  );

  // 更新分类
  const updateCategory = useCallback(
    async (
      id: string,
      categoryData: Partial<CreateCategoryData>
    ): Promise<ApiResponse<Category>> => {
      setIsLoading(true);
      setError(null);

      try {
        const authHeaders = getAuthHeaders();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (authHeaders.Authorization) {
          headers.Authorization = authHeaders.Authorization;
        }

        const response = await fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(categoryData),
        });

        const result = await response.json();

        if (result.success) {
          // 乐观更新：立即更新本地缓存中的分类
          const updatedCategory = result.data;
          if (updatedCategory) {
            const updatedCategories = categories.map(cat =>
              cat.id === id ? updatedCategory : cat
            );
            await mutate({ success: true, data: updatedCategories }, false);
          }
        } else {
          setError(result.error || "更新分类失败");
        }

        return result;
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, getAuthHeaders, categories]
  );

  // 删除分类
  const deleteCategory = useCallback(
    async (id: string): Promise<ApiResponse<void>> => {
      setIsLoading(true);
      setError(null);

      try {
        const authHeaders = getAuthHeaders();
        const headers: Record<string, string> = {};
        if (authHeaders.Authorization) {
          headers.Authorization = authHeaders.Authorization;
        }

        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
          headers,
        });

        const result = await response.json();

        if (result.success) {
          // 乐观更新：立即从本地缓存中移除删除的分类
          const updatedCategories = categories.filter(cat => cat.id !== id);
          await mutate({ success: true, data: updatedCategories }, false);
        } else {
          setError(result.error || "删除分类失败");
        }

        return result;
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, getAuthHeaders, categories]
  );

  // 重新排序分类
  const reorderCategories = useCallback(
    async (categoryIds: string[]): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        // 乐观更新
        const reorderedCategories = categoryIds.map((id, index) => {
          const category = categories.find((c) => c.id === id);
          return category ? { ...category, order: index } : null;
        }).filter(Boolean) as Category[];

        mutate({ success: true, data: reorderedCategories }, false);

        // TODO: 实现后端排序 API
        // const response = await fetch("/api/categories/reorder", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ categoryIds }),
        // });

        return true;
      } catch {
        setError("重新排序失败");
        mutate(); // 恢复数据
        return false;
      } finally {
        setIsLoading(false);
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
    isLoading: isLoading || !data,
    error: error || (swrError ? "加载分类失败" : null),
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    fetchCategories,
  };
}
