import { NextRequest, NextResponse } from "next/server";
import { CategoriesRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { handleApiError, ApiError } from "@/lib/api-error";

// GET - Fetch all categories (public)
export async function GET() {
  try {
    const categories = await CategoriesRepository.findAll();
    return NextResponse.json({ data: categories }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Create new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    const body = await request.json();
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      throw ApiError.badRequest(validation.error.issues.map(e => e.message).join(", "));
    }

    const newCategory = await CategoriesRepository.create(validation.data);
    return NextResponse.json({ data: newCategory }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
