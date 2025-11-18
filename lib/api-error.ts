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

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(
    { error: '未知错误' },
    { status: 500 }
  );
}
