/**
 * 客户端 API 请求工具
 * 提供统一的请求处理、认证和错误处理
 */

import { ApiResponse } from './types';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions<T = unknown> {
  method?: RequestMethod;
  body?: T;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

/**
 * 获取认证 Token
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_session');
}

/**
 * 构建请求头
 */
function buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = getAuthToken();
  if (token) {
    // 使用 Bearer token（新格式）
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * 统一的 API 请求函数
 */
export async function apiRequest<T, B = unknown>(
  url: string,
  options: RequestOptions<B> = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers: customHeaders, cache } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: buildHeaders(customHeaders),
      body: body ? JSON.stringify(body) : undefined,
      cache,
    });

    const data = await response.json();

    // 处理 401 未授权错误
    if (response.status === 401) {
      // 清除本地存储的 session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_session');
      }
      return {
        success: false,
        error: data.error || '登录已过期，请重新登录',
      };
    }

    // 处理其他错误
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `请求失败: ${response.status}`,
      };
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络请求失败',
    };
  }
}

/**
 * GET 请求
 */
export function get<T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * POST 请求
 */
export function post<T, B = unknown>(url: string, body?: B, options?: Omit<RequestOptions, 'method' | 'body'>) {
  return apiRequest<T, B>(url, { ...options, method: 'POST', body });
}

/**
 * PUT 请求
 */
export function put<T, B = unknown>(url: string, body?: B, options?: Omit<RequestOptions, 'method' | 'body'>) {
  return apiRequest<T, B>(url, { ...options, method: 'PUT', body });
}

/**
 * DELETE 请求
 */
export function del<T, B = unknown>(url: string, body?: B, options?: Omit<RequestOptions, 'method' | 'body'>) {
  return apiRequest<T, B>(url, { ...options, method: 'DELETE', body });
}

/**
 * PATCH 请求
 */
export function patch<T, B = unknown>(url: string, body?: B, options?: Omit<RequestOptions, 'method' | 'body'>) {
  return apiRequest<T, B>(url, { ...options, method: 'PATCH', body });
}

// API 客户端对象
export const apiClient = {
  request: apiRequest,
  get,
  post,
  put,
  delete: del,
  patch,
};

