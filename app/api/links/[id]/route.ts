import { NextRequest } from "next/server";
import { LinksRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { updateNavigationLinkSchema } from "@/lib/validations";
import { 
  successResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET - 获取单个导航链接（公开）
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const link = await LinksRepository.findById(id);

    if (!link) {
      throw ApiError.notFound("导航链接不存在");
    }

    return successResponse(link);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT - 更新导航链接（需要认证）
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
    const validation = updateNavigationLinkSchema.safeParse(updateData);
    if (!validation.success) {
      throw ApiError.badRequest(
        validation.error.issues.map(e => e.message).join(", ")
      );
    }

    // 更新链接
    const updatedLink = await LinksRepository.update(id, validation.data);

    if (!updatedLink) {
      throw ApiError.notFound("导航链接不存在");
    }

    return successResponse(updatedLink, {
      message: "导航链接更新成功",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE - 删除导航链接（需要认证）
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
    const deleted = await LinksRepository.delete(id);

    if (!deleted) {
      throw ApiError.notFound("导航链接不存在");
    }

    return successResponse(null, {
      message: "导航链接删除成功",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
