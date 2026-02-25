import { getPool } from "../config/database";
import { User } from "../types";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findById(id: number): Promise<User | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(email: string, passwordHash: string, fullName: string, roleId: number, sectionId?: number): Promise<User> {
    const pool = getPool();
    const query = `
      INSERT INTO users (email, password_hash, full_name, role_id, section_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, true, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [email, passwordHash, fullName, roleId, sectionId || null]);
    const userId = result.insertId;
    const user = await this.findById(userId);
    if (!user) throw new Error("Failed to create user");
    return user;
  }

  async findByRoleId(roleId: number): Promise<User[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE role_id = ? AND is_active = true",
      [roleId]
    );
    return rows;
  }

  async findBySectionId(sectionId: number): Promise<User[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE section_id = ? AND is_active = true",
      [sectionId]
    );
    return rows;
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const pool = getPool();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.email !== undefined) {
      updates.push("email = ?");
      values.push(data.email);
    }
    if (data.full_name !== undefined) {
      updates.push("full_name = ?");
      values.push(data.full_name);
    }
    if (data.role_id !== undefined) {
      updates.push("role_id = ?");
      values.push(data.role_id);
    }
    if (data.section_id !== undefined) {
      updates.push("section_id = ?");
      values.push(data.section_id);
    }
    if (data.is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(data.is_active);
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    await pool.query(query, values);

    const user = await this.findById(id);
    if (!user) throw new Error("Failed to update user");
    return user;
  }

  async deactivate(id: number): Promise<void> {
    const pool = getPool();
    await pool.query(
      "UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?",
      [id]
    );
  }
}
