import { db } from '../client';
import { auditLogs } from '../schema';
import { desc, eq, and } from 'drizzle-orm';

export interface AuditLogEntry {
  id: number;
  action: string;
  entityType: string;
  entityId: number | null;
  changes: Record<string, unknown> | null;
  createdAt: Date;
}

export class AuditLogsRepository {
  static async log(
    action: string,
    entityType: string,
    entityId: number | null,
    changes: Record<string, unknown>
  ): Promise<void> {
    try {
      await db.insert(auditLogs).values({
        action,
        entityType,
        entityId,
        changes,
      });
    } catch (error) {
      console.error('Failed to log audit entry:', error);
    }
  }

  static async findByEntity(
    entityType: string,
    entityId: number,
    limit = 50
  ): Promise<AuditLogEntry[]> {
    const results = await db
      .select()
      .from(auditLogs)
      .where(and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId)))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);

    return results as AuditLogEntry[];
  }

  static async findRecent(limit = 100): Promise<AuditLogEntry[]> {
    const results = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);

    return results as AuditLogEntry[];
  }
}
