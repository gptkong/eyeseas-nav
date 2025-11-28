import { NextRequest } from "next/server";
import { AuthService } from "@/lib/auth";
import { 
  successResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";

/**
 * GET - 验证 Session 有效性
 */
export async function GET(request: NextRequest) {
  try {
    const session = await AuthService.getSessionFromHeaders(request.headers);
    
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized("Session 无效或已过期");
    }

    return successResponse(session, {
      message: "Session 有效",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
