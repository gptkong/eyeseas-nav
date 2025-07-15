export interface NavigationLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'internal' | 'external';
  icon?: string;
  favicon?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  order: number;
}

export interface CreateNavigationLinkData {
  title: string;
  url: string;
  description: string;
  category: 'internal' | 'external';
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
  category: 'all' | 'internal' | 'external';
  isActive?: boolean;
}

export interface DashboardStats {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  activeLinks: number;
  inactiveLinks: number;
}
