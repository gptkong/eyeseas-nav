"use client";

import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import {
  NavigationLink,
  SearchFilters,
  DashboardStats,
  CreateNavigationLinkData,
  UpdateNavigationLinkData,
  ApiResponse,
} from "@/lib/types";
import { post, put, del } from "@/lib/api-client";

// SWR fetcher 函数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useNavigation(initialData?: NavigationLink[]) {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // 使用 SWR 获取链接数据
  const { data, error, mutate, isLoading } = useSWR<ApiResponse<NavigationLink[]>>(
    '/api/links',
    fetcher,
    {
      fallbackData: initialData ? { success: true, data: initialData } : undefined,
      revalidateOnMount: !initialData,
      keepPreviousData: true,
    }
  );

  // 使用 useMemo 缓存 links，避免引用变化
  const links = useMemo(() => data?.data || [], [data]);

  // 错误消息
  const errorMessage = useMemo(() => {
    if (error) return "加载数据失败";
    if (data && !data.success) return data.error || "加载数据失败";
    return null;
  }, [error, data]);

  // 刷新链接数据
  const fetchLinks = useCallback(async () => {
    await mutate();
  }, [mutate]);

  // 过滤链接（客户端过滤，用于即时响应）
  const filterLinks = useCallback((filters: SearchFilters) => {
    let filtered = [...links];

    // 按分类过滤
    if (filters.categoryId !== undefined) {
      if (filters.categoryId === null || filters.categoryId === "") {
        filtered = filtered.filter((link) => !link.categoryId);
      } else {
        filtered = filtered.filter((link) => link.categoryId === filters.categoryId);
      }
    }

    // 按标签过滤
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((link) => {
        if (!link.tags || link.tags.length === 0) return false;
        return filters.tags!.every(tag => link.tags!.includes(tag));
      });
    }

    // 按搜索关键词过滤
    if (filters.query && filters.query.trim()) {
      const searchTerm = filters.query.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.title.toLowerCase().includes(searchTerm) ||
          link.description.toLowerCase().includes(searchTerm) ||
          link.internalUrl.toLowerCase().includes(searchTerm) ||
          link.externalUrl.toLowerCase().includes(searchTerm)
      );
    }

    // 按活跃状态过滤
    if (filters.isActive !== undefined) {
      filtered = filtered.filter((link) => link.isActive === filters.isActive);
    }

    return filtered;
  }, [links]);

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/stats");
      const statsData = await response.json();

      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // 创建链接
  const createLink = useCallback(async (
    linkData: CreateNavigationLinkData
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await post<NavigationLink, CreateNavigationLinkData>('/api/links', linkData);
    
    if (result.success && result.data) {
      // 乐观更新
      await mutate();
      return { success: true };
    }
    
    return { success: false, error: result.error || "创建失败" };
  }, [mutate]);

  // 更新链接
  const updateLink = useCallback(async (
    id: string,
    linkData: Partial<UpdateNavigationLinkData>
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await put<NavigationLink, Partial<UpdateNavigationLinkData>>(`/api/links/${id}`, linkData);
    
    if (result.success && result.data) {
      // 乐观更新
      await mutate();
      return { success: true };
    }
    
    return { success: false, error: result.error || "更新失败" };
  }, [mutate]);

  // 删除链接
  const deleteLink = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    // 乐观更新：立即从本地状态中移除
    const previousData = data;
    await mutate(
      (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: current.data.filter((link) => link.id !== id),
        };
      },
      { revalidate: false }
    );

    const result = await del<null>(`/api/links/${id}`);

    if (result.success) {
      // 删除成功，重新验证数据确保一致性
      await mutate();
      return { success: true };
    }

    // 删除失败，回滚到之前的数据
    await mutate(previousData, { revalidate: false });
    return { success: false, error: result.error || "删除失败" };
  }, [mutate, data]);

  // 批量删除链接
  const deleteLinks = useCallback(async (
    ids: string[]
  ): Promise<{ success: boolean; deletedCount?: number; error?: string }> => {
    if (ids.length === 0) {
      return { success: false, error: "请选择要删除的链接" };
    }

    // 乐观更新：立即从本地状态中移除
    const previousData = data;
    const idsSet = new Set(ids);
    await mutate(
      (current) => {
        if (!current?.data) return current;
        return {
          ...current,
          data: current.data.filter((link) => !idsSet.has(link.id)),
        };
      },
      { revalidate: false }
    );

    const result = await del<{ deletedCount: number }>('/api/links/batch', { ids });

    if (result.success && result.data) {
      // 删除成功，重新验证数据确保一致性
      await mutate();
      return { success: true, deletedCount: result.data.deletedCount };
    }

    // 删除失败，回滚到之前的数据
    await mutate(previousData, { revalidate: false });
    return { success: false, error: result.error || "批量删除失败" };
  }, [mutate, data]);

  // 获取所有唯一标签
  const getAllTags = useCallback((): string[] => {
    const tagsSet = new Set<string>();
    links.forEach((link) => {
      if (link.tags && link.tags.length > 0) {
        link.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [links]);

  // 获取特定分类下的标签
  const getTagsByCategory = useCallback((categoryId: string | null): string[] => {
    const tagsSet = new Set<string>();
    const categoryLinks = links.filter((link) => {
      if (categoryId === null) {
        return !link.categoryId;
      }
      return link.categoryId === categoryId;
    });

    categoryLinks.forEach((link) => {
      if (link.tags && link.tags.length > 0) {
        link.tags.forEach((tag) => tagsSet.add(tag));
      }
    });

    return Array.from(tagsSet).sort();
  }, [links]);

  return {
    links,
    stats,
    isLoading,
    error: errorMessage,
    fetchLinks,
    fetchStats,
    filterLinks,
    createLink,
    updateLink,
    deleteLink,
    deleteLinks,
    getAllTags,
    getTagsByCategory,
  };
}
