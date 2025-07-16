import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { updateNavigationLinkSchema } from "@/lib/validations";

// GET - Fetch single navigation link (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const link = await DatabaseService.getLinkById(id);

    if (!link) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Navigation link not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: link,
    });
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch navigation link",
      },
      { status: 500 }
    );
  }
}

// PUT - Update navigation link (admin only)
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
    const updateData = { ...body, id };

    // Validate request body
    const validation = updateNavigationLinkSchema.safeParse(updateData);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          message: "Validation failed",
        },
        { status: 400 }
      );
    }

    const updatedLink = await DatabaseService.updateLink(validation.data);

    if (!updatedLink) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Navigation link not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedLink,
      message: "Navigation link updated successfully",
    });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to update navigation link",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete navigation link (admin only)
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

    const deleted = await DatabaseService.deleteLink(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Not found",
          message: "Navigation link not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Navigation link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to delete navigation link",
      },
      { status: 500 }
    );
  }
}
