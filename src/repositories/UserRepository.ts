import { getPool } from "../config/database";
import { User, UserRole } from "../types";

/**
 * RF-01: User Repository
 * 
 * Data access layer for user operations
 * Implements Repository pattern for separation of concerns
 * 
 * CONSTRAINTS:
 * - email: UNIQUE constraint (no duplicate accounts)
 * - role_id: NOT NULL (every user has exactly one role)
 * - section_id: NULLABLE (optional section assignment)
 * - password_hash: Never returned to client, encrypted with bcrypt
 */
export class UserRepository {
  /**
   * Find user by email (unique identifier)
   * Used during login and registration
   */
  async findByEmail(email: string): Promise<User | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Find user by ID (primary key)
   */
  async findById(id: number): Promise<User | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * RF-01: Create new user
   * 
   * @param email - User's unique email
   * @param passwordHash - Bcrypt-hashed password
   * @param fullName - User's display name
   * @param roleId - UserRole enum value (required)
   * @param sectionId - Optional section ID
   * @returns Created user
   */
  async create(
    email: string,
    passwordHash: string,
    fullName: string,
    roleId: UserRole,
    sectionId?: number
  ): Promise<User> {
    const pool = getPool();
    const query = `
      INSERT INTO users (email, password_hash, full_name, role_id, section_id, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, true, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [
      email,
      passwordHash,
      fullName,
      roleId,
      sectionId || null
    ]);
    const userId = result.insertId;
    const user = await this.findById(userId);
    if (!user) throw new Error("Failed to create user");
    return user;
  }

  /**
   * Find all users with a specific role
   */
  async findByRoleId(roleId: UserRole): Promise<User[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE role_id = ? AND is_active = true",
      [roleId]
    );
    return rows;
  }

  /**
   * Find all users assigned to a specific section
   */
  async findBySectionId(sectionId: number): Promise<User[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE section_id = ? AND is_active = true",
      [sectionId]
    );
    return rows;
  }

  /**
   * List all active users with pagination
   */
  async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  }

  /**
   * Update user information
   * Note: Only updates non-sensitive fields
   * Password changes require separate endpoint
   */
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

  /**
   * Soft delete: deactivate user
   * Prevents login but preserves audit trail
   */
  async deactivate(id: number): Promise<void> {
    const pool = getPool();
    await pool.query("UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?", [id]);
  }

  /**
   * Assign or reassign user to a section
   * 
   * RF-01 CONSTRAINT: A user can belong to only one section
   * This updates the section_id field
   */
  async assignToSection(userId: number, sectionId: number): Promise<User> {
    return this.update(userId, { section_id: sectionId } as Partial<User>);
  }

  /**
   * Assign or reassign user role
   * 
   * RF-01 CONSTRAINT: A user can have only one role
   * This updates the role_id field
   */
  async assignRole(userId: number, newRoleId: UserRole): Promise<User> {
    return this.update(userId, { role_id: newRoleId } as Partial<User>);
  }
}
