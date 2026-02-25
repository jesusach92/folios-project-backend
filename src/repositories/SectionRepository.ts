import { getPool } from "../config/database";
import { Section } from "../types";

export class SectionRepository {
  async findById(id: number): Promise<Section | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM sections WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async list(limit: number = 50, offset: number = 0): Promise<Section[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM sections WHERE is_active = true ORDER BY name ASC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  }

  async create(name: string, description: string): Promise<Section> {
    const pool = getPool();
    const query = `
      INSERT INTO sections (name, description, is_active, created_at, updated_at)
      VALUES (?, ?, true, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [name, description]);
    const section = await this.findById(result.insertId);
    if (!section) throw new Error("Failed to create section");
    return section;
  }

  async update(id: number, data: Partial<Section>): Promise<Section> {
    const pool = getPool();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at") {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      const section = await this.findById(id);
      if (!section) throw new Error("Section not found");
      return section;
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await pool.query(`UPDATE sections SET ${updates.join(", ")} WHERE id = ?`, values);
    const section = await this.findById(id);
    if (!section) throw new Error("Section not found");
    return section;
  }

  async getWithUsers(sectionId: number): Promise<any> {
    const pool = getPool();
    const [sections] = await pool.query<any[]>(
      "SELECT * FROM sections WHERE id = ?",
      [sectionId]
    );

    if (sections.length === 0) return null;

    const [users] = await pool.query<any[]>(
      "SELECT id, email, full_name, role FROM users WHERE section_id = ? AND is_active = true",
      [sectionId]
    );

    return {
      ...sections[0],
      users
    };
  }

  async getSectionStats(sectionId: number): Promise<any> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT
        COUNT(DISTINCT pi.id) as total_processes,
        SUM(CASE WHEN pi.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_processes,
        SUM(CASE WHEN pi.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress_processes,
        SUM(CASE WHEN pi.status = 'PAUSED' THEN 1 ELSE 0 END) as paused_processes,
        COUNT(DISTINCT u.id) as total_users
      FROM sections s
      LEFT JOIN process_instances pi ON s.id = pi.section_id
      LEFT JOIN users u ON s.id = u.section_id
      WHERE s.id = ? AND s.is_active = true`,
      [sectionId]
    );
    return rows[0];
  }
}
