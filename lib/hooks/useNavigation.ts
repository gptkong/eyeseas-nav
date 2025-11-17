/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import {
  NavigationLink,
  SearchFilters,
  DashboardStats,
} from "@/lib/types";
import { useAuth } from "./useAuth";

// SWR fetcher 函数
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useNavigation(initialData?: NavigationLink[]) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { getAuthHeaders } = useAuth();

  // 使用 SWR 获取链接数据
  const { data, error, mutate, isLoading } = useSWR<{ success: boolean; data: NavigationLink[] }>(
    '/api/links',
    fetcher,
    {
      fallbackData: initialData ? { success: true, data: initialData } : undefined,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1分钟内去重
      revalidateOnMount: !initialData, // 如果有初始数据则不重新请求
    }
  );

  const links = data?.data || [];

  // 使用 useMemo 缓存错误消息
  const errorMessage = useMemo(() => {
    if (error) return "加载数据失败";
    return null;
  }, [error]);

  // 刷新链接数据
  const fetchLinks = useCallback(async (filters?: SearchFilters) => {
    // 使用 SWR 的 mutate 重新获取数据
    await mutate();
  }, [mutate]);

  // 使用 useMemo 缓存筛选结果
  const filterLinks = useCallback((filters: SearchFilters) => {
    let filtered = [...links];

    // Filter by category
    if (filters.categoryId !== undefined) {
      if (filters.categoryId === null || filters.categoryId === "") {
        // 显示无分类的链接
        filtered = filtered.filter((link) => !link.categoryId);
      } else {
        filtered = filtered.filter((link) => link.categoryId === filters.categoryId);
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((link) => {
        if (!link.tags || link.tags.length === 0) return false;
        // 链接必须包含所有指定的标签
        return filters.tags!.every(tag => link.tags!.includes(tag));
      });
    }

    // Filter by search query
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

    // Filter by active status
    if (filters.isActive !== undefined) {
      filtered = filtered.filter((link) => link.isActive === filters.isActive);
    }

    return filtered;
  }, [links]);

  // Fetch dashboard stats
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

  // Create new link
  const createLink = async (
    linkData: any
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const authHeaders = getAuthHeaders();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (authHeaders.Authorization) {
        headers.Authorization = authHeaders.Authorization;
      }

      const response = await fetch("/api/links", {
        method: "POST",
        headers,
        body: JSON.stringify(linkData),
      });

      const data = await response.json();

      if (data.success) {
        mutate({ success: true, data: [...links, data.data] }, false);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Failed to create link",
        };
      }
    } catch (err) {
      console.error("Error creating link:", err);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  // Update existing link
  const updateLink = async (
    id: string,
    linkData: any
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const authHeaders = getAuthHeaders();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (authHeaders.Authorization) {
        headers.Authorization = authHeaders.Authorization;
      }

      const response = await fetch(`/api/links/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(linkData),
      });

      const data = await response.json();

      if (data.success) {
        mutate({ success: true, data: links.map(link => link.id === id ? data.data : link) }, false);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Failed to update link",
        };
      }
    } catch (err) {
      console.error("Error updating link:", err);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

  // Delete link
  const deleteLink = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const authHeaders = getAuthHeaders();
      const headers: Record<string, string> = {};
      if (authHeaders.Authorization) {
        headers.Authorization = authHeaders.Authorization;
      }

      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();

      if (data.success) {
        mutate({ success: true, data: links.filter(link => link.id !== id) }, false);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.message || "Failed to delete link",
        };
      }
    } catch (err) {
      console.error("Error deleting link:", err);
      return { success: false, error: "An unexpected error occurred" };
    }
  };

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
    filteredLinks: links,
    stats,
    isLoading,
    error: errorMessage,
    fetchLinks,
    fetchStats,
    filterLinks,
    createLink,
    updateLink,
    deleteLink,
    getAllTags,
    getTagsByCategory,
  };
}
