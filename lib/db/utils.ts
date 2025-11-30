/**
 * 数据库工具函数
 */

import { CategoryIconType } from '@/lib/types';

/**
 * 将数字 ID 转换为字符串 ID
 * @param prefix - ID 前缀（如 'link', 'category'）
 * @param id - 数字 ID
 * @returns 字符串 ID（如 'link_1', 'category_2'）
 */
export const toStringId = (prefix: string, id: number): string => `${prefix}_${id}`;

/**
 * 将字符串 ID 转换为数字 ID
 * @param stringId - 字符串 ID（如 'link_1', 'category_2'）
 * @returns 数字 ID
 */
export const toNumericId = (stringId: string): number => {
  const parts = stringId.split('_');
  return parseInt(parts[parts.length - 1]);
};

/**
 * 转换链接对象的 ID 格式（数字 → 字符串）
 */
export const transformLinkIds = <T extends { id: number; categoryId?: number | null; icon?: string | null; favicon?: string | null; tags?: string[] | null; createdAt: Date; updatedAt: Date }>(
  link: T
): Omit<T, 'id' | 'categoryId' | 'createdAt' | 'updatedAt'> & { id: string; categoryId?: string; icon?: string; favicon?: string; tags?: string[]; createdAt: string; updatedAt: string } => ({
  ...link,
  id: toStringId('link', link.id),
  categoryId: link.categoryId ? toStringId('category', link.categoryId) : undefined,
  icon: link.icon ?? undefined,
  favicon: link.favicon ?? undefined,
  tags: link.tags ?? undefined,
  createdAt: link.createdAt instanceof Date ? link.createdAt.toISOString() : link.createdAt,
  updatedAt: link.updatedAt instanceof Date ? link.updatedAt.toISOString() : link.updatedAt,
});

/**
 * 转换分类对象的 ID 格式（数字 → 字符串）
 */
export const transformCategoryId = <T extends { id: number; icon?: string | null; iconType?: string | null; color?: string | null; createdAt: Date; updatedAt: Date }>(
  category: T
): Omit<T, 'id' | 'iconType' | 'createdAt' | 'updatedAt'> & { id: string; icon?: string; iconType?: CategoryIconType; color?: string; createdAt: string; updatedAt: string } => ({
  ...category,
  id: toStringId('category', category.id),
  icon: category.icon ?? undefined,
  iconType: (category.iconType as CategoryIconType) ?? undefined,
  color: category.color ?? undefined,
  createdAt: category.createdAt instanceof Date ? category.createdAt.toISOString() : category.createdAt,
  updatedAt: category.updatedAt instanceof Date ? category.updatedAt.toISOString() : category.updatedAt,
});
