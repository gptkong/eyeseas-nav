/**
 * useTags Hook
 *
 * 用于管理标签的自定义 Hook
 * 提供标签的查询、重命名、删除、合并操作
 */

import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { ApiResponse } from "@/lib/types";
import { put, del, post } from "@/lib/api-client";

export interface TagStats {
  tag: string;
  count: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTags() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 SWR 获取标签列表
  const {
    data,
    error: swrError,
    mutate,
    isLoading: swrLoading,
  } = useSWR<ApiResponse<TagStats[]>>("/api/tags", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
  });

  const tags = useMemo(() => data?.data || [], [data]);
  const isLoading = swrLoading || !data;

  // 重命名标签
  const renameTag = useCallback(
    async (oldTag: string, newTag: string): Promise<ApiResponse<{ updatedCount: number }>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await put<{ oldTag: string; newTag: string; updatedCount: number }>(
          "/api/tags",
          { oldTag, newTag }
        );

        if (result.success) {
          await mutate();
          return { success: true, data: { updatedCount: result.data?.updatedCount || 0 } };
        }

        setError(result.error || "重命名标签失败");
        return { success: false, error: result.error };
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutate]
  );

  // 删除标签
  const deleteTag = useCallback(
    async (tag: string): Promise<ApiResponse<{ updatedCount: number }>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await del<{ tag: string; updatedCount: number }>(
          `/api/tags?tag=${encodeURIComponent(tag)}`
        );

        if (result.success) {
          await mutate();
          return { success: true, data: { updatedCount: result.data?.updatedCount || 0 } };
        }

        setError(result.error || "删除标签失败");
        return { success: false, error: result.error };
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutate]
  );

  // 合并标签
  const mergeTags = useCallback(
    async (sourceTags: string[], targetTag: string): Promise<ApiResponse<{ updatedCount: number }>> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await post<{ sourceTags: string[]; targetTag: string; updatedCount: number }>(
          "/api/tags",
          { sourceTags, targetTag }
        );

        if (result.success) {
          await mutate();
          return { success: true, data: { updatedCount: result.data?.updatedCount || 0 } };
        }

        setError(result.error || "合并标签失败");
        return { success: false, error: result.error };
      } catch {
        const errorMessage = "网络错误";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [mutate]
  );

  // 刷新标签列表
  const fetchTags = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    tags,
    isLoading,
    isSubmitting,
    error: error || (swrError ? "加载标签失败" : null),
    renameTag,
    deleteTag,
    mergeTags,
    fetchTags,
  };
}

