import { eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { categories, links } from '../schema';
import { CreateCategoryData, UpdateCategoryData, Category } from '@/lib/types';
import { toNumericId, transformCategoryId } from '../utils';

export class CategoriesRepository {
  static async findAll(): Promise<Category[]> {
    const result = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.order)],
    });
    return result.map(transformCategoryId);
  }

  static async findById(id: string): Promise<Category | null> {
    const numericId = toNumericId(id);
    const result = await db.query.categories.findFirst({
      where: eq(categories.id, numericId),
    });
    if (!result) return null;
    return transformCategoryId(result);
  }

  static async create(data: CreateCategoryData): Promise<Category> {
    // 优化：使用 MAX(order) 代替 findAll()
    const maxOrderResult = await db
      .select({ max: sql<number>`COALESCE(MAX(${categories.order}), -1)` })
      .from(categories);
    const nextOrder = (maxOrderResult[0]?.max ?? -1) + 1;

    const [result] = await db.insert(categories).values({
      ...data,
      order: nextOrder,
    }).returning();

    return transformCategoryId(result);
  }

  static async update(id: string, data: UpdateCategoryData): Promise<Category | null> {
    const numericId = toNumericId(id);
    const { id: _, ...updateData } = data;
    const [result] = await db.update(categories)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(categories.id, numericId))
      .returning();

    if (!result) return null;
    return transformCategoryId(result);
  }

  static async delete(id: string): Promise<boolean> {
    const numericId = toNumericId(id);
    await db.transaction(async (tx) => {
      await tx.update(links).set({ categoryId: null }).where(eq(links.categoryId, numericId));
      await tx.delete(categories).where(eq(categories.id, numericId));
    });
    return true;
  }

  static async reorder(categoryIds: string[]): Promise<boolean> {
    // 优化：批量并行更新
    await db.transaction(async (tx) => {
      await Promise.all(
        categoryIds.map((id, index) => {
          const numericId = toNumericId(id);
          return tx.update(categories).set({ order: index }).where(eq(categories.id, numericId));
        })
      );
    });
    return true;
  }
}
