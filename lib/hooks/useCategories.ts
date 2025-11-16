/**
 * useCategories Hook
 *
 * 用于管理分类的自定义 Hook
 * 提供分类的 CRUD 操作和状态管理
 */

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Category, CreateCategoryData, UpdateCategoryData, ApiResponse } from "@/lib/types";
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
    dedupingInterval: 10000,
  });

  const categories = data?.data || [];

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
          // 刷新分类列表
          mutate();
        } else {
          setError(result.error || "创建分类失败");
        }

        return result;
      } catch (err) {
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
    [mutate, getAuthHeaders]
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
          // 刷新分类列表
          mutate();
        } else {
          setError(result.error || "更新分类失败");
        }

        return result;
      } catch (err) {
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
    [mutate, getAuthHeaders]
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
          // 刷新分类列表
          mutate();
        } else {
          setError(result.error || "删除分类失败");
        }

        return result;
      } catch (err) {
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
    [mutate, getAuthHeaders]
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
      } catch (err) {
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
