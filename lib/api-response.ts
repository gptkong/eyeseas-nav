import { NextResponse } from 'next/server';

/**
 * 统一的 API 响应工具
 * 确保所有 API 返回格式一致
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  message?: string;
}

export type ApiResponseType<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 创建成功响应
 */
export function successResponse<T>(
  data: T,
  options?: {
    status?: number;
    message?: string;
    headers?: Record<string, string>;
  }
): NextResponse<ApiSuccessResponse<T>> {
  const { status = 200, message, headers = {} } = options || {};
  
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(message && { message }),
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

/**
 * 创建带缓存的成功响应
 */
export function cachedResponse<T>(
  data: T,
  options?: {
    status?: number;
    message?: string;
    maxAge?: number;
    staleWhileRevalidate?: number;
  }
): NextResponse<ApiSuccessResponse<T>> {
  const { 
    status = 200, 
    message, 
    maxAge = 60, 
    staleWhileRevalidate = 300 
  } = options || {};
  
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(message && { message }),
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
      },
    }
  );
}

/**
 * 创建错误响应
 */
export function errorResponse(
  error: string,
  options?: {
    status?: number;
    code?: string;
    message?: string;
  }
): NextResponse<ApiErrorResponse> {
  const { status = 500, code, message } = options || {};
  
  return NextResponse.json(
    {
      success: false as const,
      error,
      ...(code && { code }),
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * 预定义的错误响应
 */
export const ApiErrors = {
  badRequest: (message = '请求参数错误') => 
    errorResponse(message, { status: 400 }),
  
  unauthorized: (message = '未授权访问') => 
    errorResponse(message, { status: 401 }),
  
  forbidden: (message = '禁止访问') => 
    errorResponse(message, { status: 403 }),
  
  notFound: (message = '资源不存在') => 
    errorResponse(message, { status: 404 }),
  
  conflict: (message = '资源冲突') => 
    errorResponse(message, { status: 409 }),
  
  internal: (message = '服务器内部错误') => 
    errorResponse(message, { status: 500 }),
};

/**
 * 统一的错误处理函数
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return errorResponse(error.message, {
      status: error.statusCode,
      code: error.code,
    });
  }

  if (error instanceof Error) {
    // 不要在生产环境暴露错误详情
    const message = process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : error.message;
    return errorResponse(message, { status: 500 });
  }

  return ApiErrors.internal();
}

/**
 * 自定义 API 错误类
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, code?: string) {
    return new ApiError(400, message, code);
  }

  static unauthorized(message = '未授权访问', code?: string) {
    return new ApiError(401, message, code);
  }

  static forbidden(message = '禁止访问', code?: string) {
    return new ApiError(403, message, code);
  }

  static notFound(message = '资源不存在', code?: string) {
    return new ApiError(404, message, code);
  }

  static internal(message = '服务器内部错误', code?: string) {
    return new ApiError(500, message, code);
  }
}

