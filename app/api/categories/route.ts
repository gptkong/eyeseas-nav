import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";

// GET - Fetch all categories (public)
export async function GET(request: NextRequest) {
  try {
    const categories = await DatabaseService.getAllCategories();

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

// POST - Create new category (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          message: validation.error.errors.map(e => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const newCategory = await DatabaseService.createCategory(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: newCategory,
        message: "Category created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to create category",
      },
      { status: 500 }
    );
  }
}
