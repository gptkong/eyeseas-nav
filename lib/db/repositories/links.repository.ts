import { eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { links } from '../schema';
import { CreateNavigationLinkData, UpdateNavigationLinkData, NavigationLink } from '@/lib/types';
import { toNumericId, transformLinkIds } from '../utils';

export class LinksRepository {
  static async findAll(): Promise<NavigationLink[]> {
    const result = await db.query.links.findMany({
      with: { category: true },
      orderBy: (links, { asc }) => [asc(links.order)],
    });
    return result.map(transformLinkIds);
  }

  static async findById(id: string): Promise<NavigationLink | null> {
    const numericId = toNumericId(id);
    const result = await db.query.links.findFirst({
      where: eq(links.id, numericId),
      with: { category: true },
    });
    if (!result) return null;
    return transformLinkIds(result);
  }

  static async findByCategory(categoryId: string | null): Promise<NavigationLink[]> {
    const result = categoryId === null
      ? await db.query.links.findMany({
          where: sql`${links.categoryId} IS NULL`,
          orderBy: (links, { asc }) => [asc(links.order)],
        })
      : await db.query.links.findMany({
          where: eq(links.categoryId, toNumericId(categoryId)),
          orderBy: (links, { asc }) => [asc(links.order)],
        });
    return result.map(transformLinkIds);
  }

  static async findByTags(tags: string[]): Promise<NavigationLink[]> {
    if (tags.length === 0) return this.findAll();
    const result = await db.query.links.findMany({
      where: sql`${links.tags} @> ${tags}`,
      orderBy: (links, { asc }) => [asc(links.order)],
    });
    return result.map(transformLinkIds);
  }

  static async create(data: CreateNavigationLinkData): Promise<NavigationLink> {
    // 优化：使用 MAX(order) 代替 findAll()
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

  static async update(id: string, data: UpdateNavigationLinkData): Promise<NavigationLink | null> {
    const numericId = toNumericId(id);
    const { id: _, categoryId, ...updateFields } = data;
    
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

  static async delete(id: string): Promise<boolean> {
    const numericId = toNumericId(id);
    const result = await db.delete(links).where(eq(links.id, numericId)).returning();
    return result.length > 0;
  }

  static async reorder(linkIds: string[]): Promise<boolean> {
    // 优化：批量并行更新
    await db.transaction(async (tx) => {
      await Promise.all(
        linkIds.map((id, index) => {
          const numericId = toNumericId(id);
          return tx.update(links).set({ order: index }).where(eq(links.id, numericId));
        })
      );
    });
    return true;
  }

  static async getAllTags(): Promise<string[]> {
    const result = await db.select({ tags: links.tags }).from(links);
    const tagsSet = new Set<string>();
    result.forEach(r => r.tags?.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
  }
}
