import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { navigationLinkSchema } from "@/lib/validations";
import { ApiResponse } from "@/lib/types";

// GET - Fetch all navigation links (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");

    let links = await DatabaseService.getAllLinks();

    // Filter by active status if specified
    if (isActive !== null) {
      const activeFilter = isActive === "true";
      links = links.filter((link) => link.isActive === activeFilter);
    }

    // Sort by order
    links.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch navigation links",
      },
      { status: 500 }
    );
  }
}

// POST - Create new navigation link (admin only)
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
    const validation = navigationLinkSchema.safeParse(body);
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

    const newLink = await DatabaseService.createLink(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: newLink,
        message: "Navigation link created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to create navigation link",
      },
      { status: 500 }
    );
  }
}
