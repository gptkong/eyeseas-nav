import { NextRequest } from "next/server";
import { LinksRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import {
  successResponse,
  handleApiError,
  ApiError
} from "@/lib/api-response";

/**
 * DELETE - 批量删除导航链接（需要认证）
 */
export async function DELETE(request: NextRequest) {
  try {
    // 验证认证
    const session = await AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    // 解析请求体
    const body = await request.json();
    const { ids } = body;

    // 验证 ids 参数
    if (!Array.isArray(ids) || ids.length === 0) {
      throw ApiError.badRequest("请提供要删除的链接 ID 列表");
    }

    // 验证每个 ID 是字符串
    if (!ids.every((id: unknown) => typeof id === "string")) {
      throw ApiError.badRequest("链接 ID 必须是字符串类型");
    }

    // 限制单次批量删除数量
    if (ids.length > 100) {
      throw ApiError.badRequest("单次最多删除 100 个链接");
    }

    // 执行批量删除
    const deletedCount = await LinksRepository.deleteMany(ids);

    return successResponse(
      { deletedCount },
      { message: `成功删除 ${deletedCount} 个链接` }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
