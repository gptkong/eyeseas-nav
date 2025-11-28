import { NextRequest } from "next/server";
import { AuthService } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";
import { 
  successResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";

/**
 * POST - 管理员登录
 */
export async function POST(request: NextRequest) {
  try {
    // 解析并验证请求体
    const body = await request.json();
    const validation = adminLoginSchema.safeParse(body);
    
    if (!validation.success) {
      throw ApiError.badRequest("请输入密码");
    }

    const { password } = validation.data;

    // 验证密码
    const isValid = await AuthService.verifyPassword(password);
    if (!isValid) {
      throw ApiError.unauthorized("密码错误");
    }

    // 创建 JWT session
    const token = await AuthService.createSession();

    return successResponse(
      { session: token },
      { message: "登录成功" }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
