import { createClient, RedisClientType } from 'redis';
import { NavigationLink, CreateNavigationLinkData, UpdateNavigationLinkData, DashboardStats } from './types';

const LINKS_KEY = 'navigation_links';
const COUNTER_KEY = 'navigation_links_counter';

// Create Redis client
let redis: RedisClientType | null = null;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        connectTimeout: 5000,
      },
    });

    // 添加错误监听
    redis.on('error', (err) => console.error('Redis Error:', err));
    redis.on('connect', () => console.log('Redis Connected'));

    await redis.connect();
  }
  return redis;
}

// 应用级缓存
const linksCache = {
  data: null as NavigationLink[] | null,
  timestamp: 0,
  TTL: 30000, // 30秒缓存
};

export class DatabaseService {
  // Get all navigation links with caching
  static async getAllLinks(): Promise<NavigationLink[]> {
    try {
      // 检查缓存
      const now = Date.now();
      if (linksCache.data && now - linksCache.timestamp < linksCache.TTL) {
        console.log('Using cached links data');
        return linksCache.data;
      }

      // 缓存过期，从 Redis 获取
      const client = await getRedisClient();

      // 添加错误重试
      let retries = 3;
      let linksData: string | null = null;

      while (retries > 0) {
        try {
          linksData = await client.get(LINKS_KEY);
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const links = linksData ? JSON.parse(linksData) : [];

      // 更新缓存
      linksCache.data = links;
      linksCache.timestamp = now;

      return links;
    } catch (error) {
      console.error('Error fetching links:', error);
      // 如果有缓存数据，即使过期也返回
      if (linksCache.data) {
        console.log('Returning stale cached data due to error');
        return linksCache.data;
      }
      return [];
    }
  }

  // 清除缓存的辅助方法
  private static clearCache() {
    linksCache.data = null;
    linksCache.timestamp = 0;
  }

  // Get a single navigation link by ID
  static async getLinkById(id: string): Promise<NavigationLink | null> {
    try {
      const links = await this.getAllLinks();
      return links.find(link => link.id === id) || null;
    } catch (error) {
      console.error('Error fetching link by ID:', error);
      return null;
    }
  }

  // Create a new navigation link
  static async createLink(data: CreateNavigationLinkData): Promise<NavigationLink> {
    try {
      const client = await getRedisClient();
      const links = await this.getAllLinks();
      const counterData = await client.get(COUNTER_KEY);
      const counter = counterData ? parseInt(counterData) : 0;
      const newCounter = counter + 1;

      const newLink: NavigationLink = {
        id: `link_${newCounter}`,
        ...data,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: links.length,
      };

      const updatedLinks = [...links, newLink];

      await Promise.all([
        client.set(LINKS_KEY, JSON.stringify(updatedLinks)),
        client.set(COUNTER_KEY, newCounter.toString())
      ]);

      // 清除缓存
      this.clearCache();

      return newLink;
    } catch (error) {
      console.error('Error creating link:', error);
      throw new Error('Failed to create navigation link');
    }
  }

  // Update an existing navigation link
  static async updateLink(data: UpdateNavigationLinkData): Promise<NavigationLink | null> {
    try {
      const client = await getRedisClient();
      const links = await this.getAllLinks();
      const linkIndex = links.findIndex(link => link.id === data.id);

      if (linkIndex === -1) {
        return null;
      }

      const updatedLink: NavigationLink = {
        ...links[linkIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      links[linkIndex] = updatedLink;
      await client.set(LINKS_KEY, JSON.stringify(links));

      // 清除缓存
      this.clearCache();

      return updatedLink;
    } catch (error) {
      console.error('Error updating link:', error);
      throw new Error('Failed to update navigation link');
    }
  }

  // Delete a navigation link
  static async deleteLink(id: string): Promise<boolean> {
    try {
      const client = await getRedisClient();
      const links = await this.getAllLinks();
      const filteredLinks = links.filter(link => link.id !== id);

      if (filteredLinks.length === links.length) {
        return false; // Link not found
      }

      await client.set(LINKS_KEY, JSON.stringify(filteredLinks));

      // 清除缓存
      this.clearCache();

      return true;
    } catch (error) {
      console.error('Error deleting link:', error);
      throw new Error('Failed to delete navigation link');
    }
  }

  // Get dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const links = await this.getAllLinks();
      
      return {
        totalLinks: links.length,
        internalLinks: links.length, // All links have internal URLs
        externalLinks: links.length, // All links have external URLs
        activeLinks: links.filter(link => link.isActive).length,
        inactiveLinks: links.filter(link => !link.isActive).length,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalLinks: 0,
        internalLinks: 0,
        externalLinks: 0,
        activeLinks: 0,
        inactiveLinks: 0,
      };
    }
  }

  // Reorder links
  static async reorderLinks(linkIds: string[]): Promise<boolean> {
    try {
      const client = await getRedisClient();
      const links = await this.getAllLinks();
      const reorderedLinks = linkIds.map((id, index) => {
        const link = links.find(l => l.id === id);
        if (link) {
          return { ...link, order: index };
        }
        return null;
      }).filter(Boolean) as NavigationLink[];

      await client.set(LINKS_KEY, JSON.stringify(reorderedLinks));

      // 清除缓存
      this.clearCache();

      return true;
    } catch (error) {
      console.error('Error reordering links:', error);
      return false;
    }
  }
}
