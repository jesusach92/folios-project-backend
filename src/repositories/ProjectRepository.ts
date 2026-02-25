import { getPool } from "../config/database";
import { Project } from "../types";

export class ProjectRepository {
  async findById(id: number): Promise<Project | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByClientId(clientId: number, limit: number = 50, offset: number = 0): Promise<Project[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM projects WHERE client_id = ? AND is_active = true
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [clientId, limit, offset]
    );
    return rows;
  }

  async findBySalesmanId(salesmanId: number, limit: number = 50, offset: number = 0): Promise<Project[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM projects WHERE salesman_id = ? AND is_active = true
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [salesmanId, limit, offset]
    );
    return rows;
  }

  async create(name: string, clientId: number, salesmanId: number, description: string): Promise<Project> {
    const pool = getPool();
    const query = `
      INSERT INTO projects (name, client_id, salesman_id, description, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, true, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [name, clientId, salesmanId, description]);
    const project = await this.findById(result.insertId);
    if (!project) throw new Error("Failed to create project");
    return project;
  }

  async update(id: number, data: Partial<Project>): Promise<Project> {
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
      const project = await this.findById(id);
      if (!project) throw new Error("Project not found");
      return project;
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await pool.query(`UPDATE projects SET ${updates.join(", ")} WHERE id = ?`, values);
    const project = await this.findById(id);
    if (!project) throw new Error("Project not found");
    return project;
  }

  async list(limit: number = 50, offset: number = 0): Promise<Project[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  async getProjectStats(projectId: number): Promise<any> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT
        COUNT(DISTINCT f.id) as total_folios,
        SUM(CASE WHEN f.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_folios,
        SUM(CASE WHEN f.status = 'ACTIVE' THEN 1 ELSE 0 END) as active_folios,
        SUM(f.quantity) as total_pieces,
        SUM(CASE WHEN p.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_pieces
      FROM projects pr
      LEFT JOIN folios f ON pr.id = f.project_id
      LEFT JOIN pieces p ON f.id = p.folio_id
      WHERE pr.id = ?`,
      [projectId]
    );
    return rows[0];
  }
}
