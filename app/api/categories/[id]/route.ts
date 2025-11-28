import { NextRequest } from "next/server";
import { CategoriesRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { updateCategorySchema } from "@/lib/validations";
import { 
  successResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET - 获取单个分类（公开）
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const category = await CategoriesRepository.findById(id);

    if (!category) {
      throw ApiError.notFound("分类不存在");
    }

    return successResponse(category);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT - 更新分类（需要认证）
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 验证认证
    const session = await AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    const { id } = await params;
    const body = await request.json();
    const updateData = { ...body, id };

    // 验证请求体
    const validation = updateCategorySchema.safeParse(updateData);
    if (!validation.success) {
      throw ApiError.badRequest(
        validation.error.issues.map(e => e.message).join(", ")
      );
    }

    // 更新分类
    const updatedCategory = await CategoriesRepository.update(id, validation.data);

    if (!updatedCategory) {
      throw ApiError.notFound("分类不存在");
    }

    return successResponse(updatedCategory, {
      message: "分类更新成功",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE - 删除分类（需要认证）
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 验证认证
    const session = await AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    const { id } = await params;
    const deleted = await CategoriesRepository.delete(id);

    if (!deleted) {
      throw ApiError.notFound("分类不存在");
    }

    return successResponse(null, {
      message: "分类删除成功",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
