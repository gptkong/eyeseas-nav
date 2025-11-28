import { eq, sql, and, isNull } from 'drizzle-orm';
import { db } from '../client';
import { links } from '../schema';
import { CreateNavigationLinkData, UpdateNavigationLinkData, NavigationLink } from '@/lib/types';
import { toNumericId, transformLinkIds } from '../utils';

export interface LinkFilters {
  isActive?: boolean;
  categoryId?: string | null;
  tags?: string[];
  query?: string;
}

export class LinksRepository {
  /**
   * 获取所有链接
   */
  static async findAll(): Promise<NavigationLink[]> {
    const result = await db.query.links.findMany({
      with: { category: true },
      orderBy: (links, { asc }) => [asc(links.order)],
    });
    return result.map(transformLinkIds);
  }

  /**
   * 根据过滤条件获取链接（数据库层过滤）
   */
  static async findFiltered(filters: LinkFilters): Promise<NavigationLink[]> {
    const conditions = [];

    // 活跃状态过滤
    if (filters.isActive !== undefined) {
      conditions.push(eq(links.isActive, filters.isActive));
    }

    // 分类过滤
    if (filters.categoryId !== undefined) {
      if (filters.categoryId === null || filters.categoryId === '' || filters.categoryId === 'null') {
        conditions.push(isNull(links.categoryId));
      } else {
        conditions.push(eq(links.categoryId, toNumericId(filters.categoryId)));
      }
    }

    // 标签过滤（PostgreSQL 数组包含）
    if (filters.tags && filters.tags.length > 0) {
      conditions.push(sql`${links.tags} @> ${filters.tags}`);
    }

    // 搜索过滤
    if (filters.query && filters.query.trim()) {
      const searchTerm = `%${filters.query.toLowerCase()}%`;
      conditions.push(
        sql`(
          LOWER(${links.title}) LIKE ${searchTerm} OR
          LOWER(${links.description}) LIKE ${searchTerm} OR
          LOWER(${links.internalUrl}) LIKE ${searchTerm} OR
          LOWER(${links.externalUrl}) LIKE ${searchTerm}
        )`
      );
    }

    const result = await db.query.links.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: { category: true },
      orderBy: (links, { asc }) => [asc(links.order)],
    });

    return result.map(transformLinkIds);
  }

  /**
   * 根据 ID 获取单个链接
   */
  static async findById(id: string): Promise<NavigationLink | null> {
    const numericId = toNumericId(id);
    const result = await db.query.links.findFirst({
      where: eq(links.id, numericId),
      with: { category: true },
    });
    if (!result) return null;
    return transformLinkIds(result);
  }

  /**
   * 根据分类获取链接
   */
  static async findByCategory(categoryId: string | null): Promise<NavigationLink[]> {
    const result = categoryId === null
      ? await db.query.links.findMany({
          where: isNull(links.categoryId),
          orderBy: (links, { asc }) => [asc(links.order)],
        })
      : await db.query.links.findMany({
          where: eq(links.categoryId, toNumericId(categoryId)),
          orderBy: (links, { asc }) => [asc(links.order)],
        });
    return result.map(transformLinkIds);
  }

  /**
   * 根据标签获取链接
   */
  static async findByTags(tags: string[]): Promise<NavigationLink[]> {
    if (tags.length === 0) return this.findAll();
    const result = await db.query.links.findMany({
      where: sql`${links.tags} @> ${tags}`,
      orderBy: (links, { asc }) => [asc(links.order)],
    });
    return result.map(transformLinkIds);
  }

  /**
   * 创建新链接
   */
  static async create(data: CreateNavigationLinkData): Promise<NavigationLink> {
    // 获取最大排序值
    const maxOrderResult = await db
      .select({ max: sql<number>`COALESCE(MAX(${links.order}), -1)` })
      .from(links);
    const nextOrder = (maxOrderResult[0]?.max ?? -1) + 1;

    const [result] = await db.insert(links).values({
      ...data,
      categoryId: data.categoryId ? toNumericId(data.categoryId) : null,
      order: nextOrder,
    }).returning();

    return transformLinkIds(result);
  }

  /**
   * 更新链接
   */
  static async update(id: string, data: UpdateNavigationLinkData): Promise<NavigationLink | null> {
    const numericId = toNumericId(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, categoryId, ...updateFields } = data;
    
    const updateData: Partial<typeof links.$inferInsert> & { updatedAt: Date } = {
      ...updateFields,
      updatedAt: new Date(),
    };

    if (categoryId !== undefined) {
      updateData.categoryId = categoryId ? toNumericId(categoryId) : null;
    }

    const [result] = await db.update(links)
      .set(updateData)
      .where(eq(links.id, numericId))
      .returning();

    if (!result) return null;
    return transformLinkIds(result);
  }

  /**
   * 删除链接
   */
  static async delete(id: string): Promise<boolean> {
    const numericId = toNumericId(id);
    const result = await db.delete(links).where(eq(links.id, numericId)).returning();
    return result.length > 0;
  }

  /**
   * 批量重排序
   */
  static async reorder(linkIds: string[]): Promise<boolean> {
    if (linkIds.length === 0) return true;

    // 使用 SQL CASE 语句批量更新
    const cases = linkIds.map((id, index) =>
      sql`WHEN ${links.id} = ${toNumericId(id)} THEN ${index}`
    );

    const caseStatement = sql.join(cases, sql.raw(' '));
    const ids = linkIds.map(toNumericId);

    await db.execute(sql`
      UPDATE ${links}
      SET "order" = CASE ${caseStatement} END
      WHERE ${links.id} IN (${sql.join(ids.map(id => sql`${id}`), sql.raw(','))})
    `);

    return true;
  }

  /**
   * 获取所有标签
   */
  static async getAllTags(): Promise<string[]> {
    const result = await db.select({ tags: links.tags }).from(links);
    const tagsSet = new Set<string>();
    result.forEach(r => r.tags?.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }

  /**
   * 获取统计信息
   */
  static async getStats(): Promise<{
    totalLinks: number;
    activeLinks: number;
    inactiveLinks: number;
  }> {
    const [stats] = await db
      .select({
        total: sql<number>`COUNT(*)::int`,
        active: sql<number>`COUNT(*) FILTER (WHERE ${links.isActive} = true)::int`,
        inactive: sql<number>`COUNT(*) FILTER (WHERE ${links.isActive} = false)::int`,
      })
      .from(links);

    return {
      totalLinks: stats?.total ?? 0,
      activeLinks: stats?.active ?? 0,
      inactiveLinks: stats?.inactive ?? 0,
    };
  }
}
