import { pgTable, text, boolean, timestamp, integer, serial, index, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  orderIdx: index('categories_order_idx').on(table.order),
}));

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  internalUrl: text('internal_url').notNull(),
  externalUrl: text('external_url').notNull(),
  description: text('description').notNull(),
  icon: text('icon'),
  favicon: text('favicon'),
  isActive: boolean('is_active').notNull().default(true),
  order: integer('order').notNull().default(0),
  categoryId: integer('category_id').references(() => categories.id),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('links_category_idx').on(table.categoryId),
  orderIdx: index('links_order_idx').on(table.order),
  activeIdx: index('links_active_idx').on(table.isActive),
}));

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: integer('entity_id'),
  changes: jsonb('changes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  entityIdx: index('audit_logs_entity_idx').on(table.entityType, table.entityId),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
  category: one(categories, {
    fields: [links.categoryId],
    references: [categories.id],
  }),
}));
