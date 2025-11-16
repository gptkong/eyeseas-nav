import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { updateCategorySchema } from "@/lib/validations";

// GET - Fetch single category (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await DatabaseService.getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch category",
      },
      { status: 500 }
    );
  }
}

// PUT - Update category (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const dataWithId = { ...body, id };

    // Validate request body
    const validation = updateCategorySchema.safeParse(dataWithId);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          message: validation.error.issues.map(e => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const updatedCategory = await DatabaseService.updateCategory(validation.data);

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to update category",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete category (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const success = await DatabaseService.deleteCategory(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to delete category",
      },
      { status: 500 }
    );
  }
}
