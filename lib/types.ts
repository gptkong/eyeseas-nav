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
}

export interface CreateNavigationLinkData {
  title: string;
  internalUrl: string;
  externalUrl: string;
  description: string;
  icon?: string;
  favicon?: string;
  isActive?: boolean;
}

export interface UpdateNavigationLinkData extends Partial<CreateNavigationLinkData> {
  id: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  expiresAt: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchFilters {
  query: string;
  isActive?: boolean;
}

export type NetworkMode = 'internal' | 'external';

export interface DashboardStats {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  activeLinks: number;
  inactiveLinks: number;
}
