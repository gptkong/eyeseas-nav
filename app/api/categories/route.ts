import { NextRequest } from "next/server";
import { CategoriesRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { 
  successResponse, 
  cachedResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";

/**
 * GET - 获取所有分类（公开）
 */
export async function GET() {
  try {
    const categories = await CategoriesRepository.findAll();
    
    return cachedResponse(categories, {
      maxAge: 60,
      staleWhileRevalidate: 300,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST - 创建新分类（需要认证）
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
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      throw ApiError.badRequest(
        validation.error.issues.map(e => e.message).join(", ")
      );
    }

    // 创建分类
    const newCategory = await CategoriesRepository.create(validation.data);
    
    return successResponse(newCategory, {
      status: 201,
      message: "分类创建成功",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
