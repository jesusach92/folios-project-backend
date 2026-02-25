import { getPool } from "../config/database";
import { AuditLog, AuditAction } from "../types";

export class AuditRepository {
  async log(
    action: AuditAction,
    entityType: string,
    entityId: number,
    userId: number,
    description: string,
    oldValue?: string,
    newValue?: string
  ): Promise<void> {
    const pool = getPool();
    const query = `
      INSERT INTO audit_log (action, entity_type, entity_id, user_id, old_value, new_value, description, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await pool.query(query, [action, entityType, entityId, userId, oldValue || null, newValue || null, description]);
  }

  async getByEntity(entityType: string, entityId: number, limit: number = 50): Promise<AuditLog[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM audit_log WHERE entity_type = ? AND entity_id = ? ORDER BY timestamp DESC LIMIT ?`,
      [entityType, entityId, limit]
    );
    return rows;
  }

  async getByUser(userId: number, limit: number = 50, offset: number = 0): Promise<AuditLog[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM audit_log WHERE user_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    return rows;
  }

  async getRecent(limit: number = 100): Promise<AuditLog[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?`,
      [limit]
    );
    return rows;
  }
}
