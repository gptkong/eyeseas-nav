/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  NavigationLink,
  ApiResponse,
  SearchFilters,
  DashboardStats,
} from "@/lib/types";
import { useAuth } from "./useAuth";

export function useNavigation() {
  const [links, setLinks] = useState<NavigationLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<NavigationLink[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeaders } = useAuth();

  // Fetch all links
  const fetchLinks = async (filters?: SearchFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.isActive !== undefined) {
        params.append("isActive", filters.isActive.toString());
      }

      const response = await fetch(`/api/links?${params.toString()}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setLinks(data.data || []);
        setFilteredLinks(data.data || []);
      } else {
        setError(data.message || "Failed to fetch links");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching links:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Filter links based on search query
  const filterLinks = (filters: SearchFilters) => {
    let filtered = [...links];

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

    setFilteredLinks(filtered);
  };

  // Create new link
  const createLink = async (
    linkData: any
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(linkData),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        await fetchLinks();
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
      const response = await fetch(`/api/links/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(linkData),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        await fetchLinks();
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
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        await fetchLinks();
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

  // Initial load
  useEffect(() => {
    fetchLinks();
  }, []);

  return {
    links,
    filteredLinks,
    stats,
    isLoading,
    error,
    fetchLinks,
    fetchStats,
    filterLinks,
    createLink,
    updateLink,
    deleteLink,
  };
}
