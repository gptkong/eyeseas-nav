import { NextRequest } from "next/server";
import { LinksRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { navigationLinkSchema } from "@/lib/validations";
import { 
  successResponse, 
  cachedResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";

/**
 * GET - 获取所有导航链接（公开）
 * 支持过滤参数：isActive, categoryId, tags
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const categoryId = searchParams.get("categoryId");
    const tagsParam = searchParams.get("tags");
    const query = searchParams.get("query");

    // 使用数据库层过滤
    const links = await LinksRepository.findFiltered({
      isActive: isActive !== null ? isActive === "true" : undefined,
      categoryId: categoryId !== null ? (categoryId === "null" ? null : categoryId) : undefined,
      tags: tagsParam ? tagsParam.split(",").filter(Boolean) : undefined,
      query: query || undefined,
    });

    return cachedResponse(links, {
      maxAge: 60,
      staleWhileRevalidate: 300,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST - 创建新导航链接（需要认证）
 */
export async function POST(request: NextRequest) {
  try {
    // 验证认证
    const session = await AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    // 解析并验证请求体
    const body = await request.json();
    const validation = navigationLinkSchema.safeParse(body);
    if (!validation.success) {
      throw ApiError.badRequest(
        validation.error.issues.map(e => e.message).join(", ")
      );
    }

    // 创建链接
    const newLink = await LinksRepository.create(validation.data);
    
    return successResponse(newLink, {
      status: 201,
      message: "导航链接创建成功",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
