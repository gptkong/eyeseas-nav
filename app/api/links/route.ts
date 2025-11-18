import { NextRequest, NextResponse } from "next/server";
import { LinksRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { navigationLinkSchema } from "@/lib/validations";
import { ApiResponse } from "@/lib/types";

// GET - Fetch all navigation links (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const categoryId = searchParams.get("categoryId");
    const tagsParam = searchParams.get("tags");

    let links = await LinksRepository.findAll();

    // Filter by active status if specified
    if (isActive !== null) {
      const activeFilter = isActive === "true";
      links = links.filter((link) => link.isActive === activeFilter);
    }

    // Filter by category if specified
    if (categoryId !== null) {
      if (categoryId === "null" || categoryId === "") {
        // 显示无分类的链接
        links = links.filter((link) => !link.categoryId);
      } else {
        links = links.filter((link) => link.categoryId === categoryId);
      }
    }

    // Filter by tags if specified
    if (tagsParam) {
      const tags = tagsParam.split(",").filter(Boolean);
      if (tags.length > 0) {
        links = links.filter((link) => {
          if (!link.tags || link.tags.length === 0) return false;
          // 链接必须包含所有指定的标签
          return tags.every(tag => link.tags!.includes(tag));
        });
      }
    }

    // Sort by order
    links.sort((a, b) => a.order - b.order);

    return NextResponse.json(
      {
        success: true,
        data: links,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
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

    const newLink = await LinksRepository.create(validation.data);

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
