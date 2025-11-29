import { NextRequest } from "next/server";
import { CategoriesRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { 
  successResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";
import { z } from "zod";

// 请求体验证
const reorderSchema = z.object({
  categoryIds: z.array(z.string()).min(1, "分类 ID 列表不能为空"),
});

/**
 * POST - 重新排序分类（需要认证）
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
    const validation = reorderSchema.safeParse(body);
    if (!validation.success) {
      throw ApiError.badRequest(
        validation.error.issues.map(e => e.message).join(", ")
      );
    }

    // 执行重排序
    await CategoriesRepository.reorder(validation.data.categoryIds);

    return successResponse(null, {
      message: "分类排序更新成功",
    });
  } catch (error) {
    return handleApiError(error);
  }
}


