/**
 * 数据库工具函数
 */

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
export const transformLinkIds = <T extends { id: number; categoryId?: number | null }>(
  link: T
): Omit<T, 'id' | 'categoryId'> & { id: string; categoryId?: string } => ({
  ...link,
  id: toStringId('link', link.id),
  categoryId: link.categoryId ? toStringId('category', link.categoryId) : undefined,
});

/**
 * 转换分类对象的 ID 格式（数字 → 字符串）
 */
export const transformCategoryId = <T extends { id: number }>(
  category: T
): Omit<T, 'id'> & { id: string } => ({
  ...category,
  id: toStringId('category', category.id),
});
