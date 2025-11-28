import { LinksRepository, CategoriesRepository } from "@/lib/db";
import { 
  cachedResponse, 
  handleApiError 
} from "@/lib/api-response";

/**
 * GET - 获取仪表盘统计数据（公开）
 */
export async function GET() {
  try {
    // 获取链接统计
    const linkStats = await LinksRepository.getStats();
    
    // 获取分类数量
    const categories = await CategoriesRepository.findAll();

    const stats = {
      totalLinks: linkStats.totalLinks,
      activeLinks: linkStats.activeLinks,
      inactiveLinks: linkStats.inactiveLinks,
      internalLinks: linkStats.totalLinks, // 所有链接都有内网地址
      externalLinks: linkStats.totalLinks, // 所有链接都有外网地址
      totalCategories: categories.length,
    };

    return cachedResponse(stats, {
      maxAge: 30,
      staleWhileRevalidate: 60,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
