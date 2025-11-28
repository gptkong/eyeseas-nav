import { NextRequest } from "next/server";
import { LinksRepository } from "@/lib/db";
import { AuthService } from "@/lib/auth";
import { 
  successResponse, 
  cachedResponse, 
  handleApiError, 
  ApiError 
} from "@/lib/api-response";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * 获取标签统计信息
 */
async function getTagStats(): Promise<{ tag: string; count: number }[]> {
  // 使用 SQL 聚合查询获取每个标签的使用次数
  const allLinks = await LinksRepository.findAll();
  const tagCountMap = new Map<string, number>();
  
  allLinks.forEach(link => {
    if (link.tags && link.tags.length > 0) {
      link.tags.forEach(tag => {
        tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
      });
    }
  });
  
  return Array.from(tagCountMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * GET - 获取所有标签及其使用统计（公开）
 */
export async function GET() {
  try {
    const tagStats = await getTagStats();
    
    return cachedResponse(tagStats, {
      maxAge: 30,
      staleWhileRevalidate: 60,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT - 重命名标签（需要认证）
 * Body: { oldTag: string, newTag: string }
 */
export async function PUT(request: NextRequest) {
  try {
    // 验证认证
    const session = await AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    const body = await request.json();
    const { oldTag, newTag } = body;

    if (!oldTag || !newTag) {
      throw ApiError.badRequest("请提供旧标签名和新标签名");
    }

    if (oldTag === newTag) {
      throw ApiError.badRequest("新标签名与旧标签名相同");
    }

    // 获取所有包含旧标签的链接
    const allLinks = await LinksRepository.findAll();
    const linksToUpdate = allLinks.filter(
      link => link.tags && link.tags.includes(oldTag)
    );

    if (linksToUpdate.length === 0) {
      throw ApiError.notFound("未找到使用该标签的链接");
    }

    // 批量更新
    let updatedCount = 0;
    for (const link of linksToUpdate) {
      const newTags = link.tags!.map(t => t === oldTag ? newTag : t);
      // 去重
      const uniqueTags = [...new Set(newTags)];
      
      await db.update(links)
        .set({ 
          tags: uniqueTags,
          updatedAt: new Date()
        })
        .where(eq(links.id, parseInt(link.id.split('_')[1])));
      
      updatedCount++;
    }

    return successResponse(
      { oldTag, newTag, updatedCount },
      { message: `成功将 "${oldTag}" 重命名为 "${newTag}"，更新了 ${updatedCount} 个链接` }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE - 删除标签（从所有链接中移除）（需要认证）
 * Query: ?tag=标签名
 */
export async function DELETE(request: NextRequest) {
  try {
    // 验证认证
    const session = await AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const tagToDelete = searchParams.get("tag");

    if (!tagToDelete) {
      throw ApiError.badRequest("请提供要删除的标签名");
    }

    // 获取所有包含该标签的链接
    const allLinks = await LinksRepository.findAll();
    const linksToUpdate = allLinks.filter(
      link => link.tags && link.tags.includes(tagToDelete)
    );

    if (linksToUpdate.length === 0) {
      throw ApiError.notFound("未找到使用该标签的链接");
    }

    // 批量更新，移除标签
    let updatedCount = 0;
    for (const link of linksToUpdate) {
      const newTags = link.tags!.filter(t => t !== tagToDelete);
      
      await db.update(links)
        .set({ 
          tags: newTags.length > 0 ? newTags : null,
          updatedAt: new Date()
        })
        .where(eq(links.id, parseInt(link.id.split('_')[1])));
      
      updatedCount++;
    }

    return successResponse(
      { tag: tagToDelete, updatedCount },
      { message: `成功删除标签 "${tagToDelete}"，更新了 ${updatedCount} 个链接` }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST - 合并标签（需要认证）
 * Body: { sourceTags: string[], targetTag: string }
 */
export async function POST(request: NextRequest) {
  try {
    // 验证认证
    const session = await AuthService.getSessionFromHeaders(request.headers);
    if (!session || !AuthService.isSessionValid(session)) {
      throw ApiError.unauthorized();
    }

    const body = await request.json();
    const { sourceTags, targetTag } = body;

    if (!sourceTags || !Array.isArray(sourceTags) || sourceTags.length === 0) {
      throw ApiError.badRequest("请提供要合并的源标签列表");
    }

    if (!targetTag) {
      throw ApiError.badRequest("请提供目标标签名");
    }

    // 获取所有包含源标签的链接
    const allLinks = await LinksRepository.findAll();
    const linksToUpdate = allLinks.filter(
      link => link.tags && link.tags.some(t => sourceTags.includes(t))
    );

    if (linksToUpdate.length === 0) {
      throw ApiError.notFound("未找到使用这些标签的链接");
    }

    // 批量更新
    let updatedCount = 0;
    for (const link of linksToUpdate) {
      // 将所有源标签替换为目标标签，并去重
      const newTags = link.tags!.map(t => sourceTags.includes(t) ? targetTag : t);
      const uniqueTags = [...new Set(newTags)];
      
      await db.update(links)
        .set({ 
          tags: uniqueTags,
          updatedAt: new Date()
        })
        .where(eq(links.id, parseInt(link.id.split('_')[1])));
      
      updatedCount++;
    }

    return successResponse(
      { sourceTags, targetTag, updatedCount },
      { message: `成功将 ${sourceTags.length} 个标签合并为 "${targetTag}"，更新了 ${updatedCount} 个链接` }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

