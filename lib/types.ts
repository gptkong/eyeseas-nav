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
  categoryId?: string;  // 所属分类ID（可选，兼容旧数据）
  tags?: string[];      // 标签数组
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

export interface UpdateNavigationLinkData
  extends Partial<CreateNavigationLinkData> {
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

export interface SearchFilters {
  query: string;
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
}

// 分类相关接口
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;  // Tailwind 颜色类名（如：blue, green, purple）
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}
