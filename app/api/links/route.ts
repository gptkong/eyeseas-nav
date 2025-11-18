import { NextRequest, NextResponse } from "next/server";
import { LinksRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { navigationLinkSchema } from "@/lib/validations";
import { handleApiError, ApiError } from "@/lib/api-error";

// GET - Fetch all navigation links (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const categoryId = searchParams.get("categoryId");
    const tagsParam = searchParams.get("tags");

    let links = await LinksRepository.findAll();

    if (isActive !== null) {
      const activeFilter = isActive === "true";
      links = links.filter((link) => link.isActive === activeFilter);
    }

    if (categoryId !== null) {
      if (categoryId === "null" || categoryId === "") {
        links = links.filter((link) => !link.categoryId);
      } else {
        links = links.filter((link) => link.categoryId === categoryId);
      }
    }

    if (tagsParam) {
      const tags = tagsParam.split(",").filter(Boolean);
      if (tags.length > 0) {
        links = links.filter((link) => {
          if (!link.tags || link.tags.length === 0) return false;
          return tags.every(tag => link.tags!.includes(tag));
        });
      }
    }

    links.sort((a, b) => a.order - b.order);

    return NextResponse.json({ data: links }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Create new navigation link (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    const body = await request.json();
    const validation = navigationLinkSchema.safeParse(body);
    if (!validation.success) {
      throw ApiError.badRequest(validation.error.issues.map(e => e.message).join(", "));
    }

    const newLink = await LinksRepository.create(validation.data);
    return NextResponse.json({ data: newLink }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
