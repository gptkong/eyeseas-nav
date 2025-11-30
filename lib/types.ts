export interface NavigationLink {
  id: string;
  title: string;
  internalUrl: string;
  externalUrl: string;
  description: string;
  icon?: string;
  favicon?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  order: number;
  categoryId?: string;
  tags?: string[];
}

export interface CreateNavigationLinkData {
  title: string;
  internalUrl: string;
  externalUrl: string;
  description: string;
  icon?: string;
  favicon?: string;
  isActive?: boolean;
  categoryId?: string;
  tags?: string[];
}

export interface UpdateNavigationLinkData extends Partial<CreateNavigationLinkData> {
  id: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  expiresAt: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchFilters {
  query?: string;
  isActive?: boolean;
  categoryId?: string;
  tags?: string[];
}

export type NetworkMode = "internal" | "external";

export interface DashboardStats {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  activeLinks: number;
  inactiveLinks: number;
  totalCategories?: number;
}

// 分类相关接口
export type CategoryIconType = 'emoji' | 'lucide';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  iconType?: CategoryIconType;
  color?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  iconType?: CategoryIconType;
  color?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

// 链接过滤器
export interface LinkFilters {
  isActive?: boolean;
  categoryId?: string | null;
  tags?: string[];
  query?: string;
}
