import { getPool } from "../config/database";
import { Folio } from "../types";

interface FoliosFilterOptions {
  search?: string;
  status?: string;
  projectId?: number;
  sortBy?: 'created_at' | 'folio_number';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class FolioRepository {
  async findAll(filters: FoliosFilterOptions = {}): Promise<{ folios: Folio[]; total: number }> {
    const pool = getPool();
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = (filters.sortOrder || 'desc').toUpperCase();

    let whereConditions: string[] = [];
    const params: any[] = [];

    // Filtro por búsqueda (folio_number)
    if (filters.search) {
      whereConditions.push("f.folio_number LIKE ?");
      params.push(`%${filters.search}%`);
    }

    // Filtro por estado
    if (filters.status) {
      whereConditions.push("f.status = ?");
      params.push(filters.status);
    }

    // Filtro por proyecto
    if (filters.projectId) {
      whereConditions.push("f.project_id = ?");
      params.push(filters.projectId);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Obtener total de registros
    const countQuery = `SELECT COUNT(*) as total FROM folios f ${whereClause}`;
    const [countResult] = await pool.query<any[]>(countQuery, params);
    const total = countResult[0].total;

    // Obtener folios con paginación
    const query = `
      SELECT f.* FROM folios f 
      ${whereClause}
      ORDER BY f.${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    
    const queryParams = [...params, limit, offset];
    const [rows] = await pool.query<any[]>(query, queryParams);

    return { folios: rows, total };
  }

  async findById(id: number): Promise<Folio | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM folios WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByFolioNumber(folioNumber: string): Promise<Folio | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM folios WHERE folio_number = ?",
      [folioNumber]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByProjectId(projectId: number, limit: number = 50, offset: number = 0): Promise<Folio[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM folios WHERE project_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [projectId, limit, offset]
    );
    return rows;
  }

  async create(projectId: number, folioNumber: string, quantity: number, duedate: Date): Promise<Folio> {
    const pool = getPool();
    const query = `
      INSERT INTO folios (project_id, folio_number, quantity, due_date, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'ACTIVE', NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [projectId, folioNumber, quantity, duedate]);
    const folio = await this.findById(result.insertId);
    if (!folio) throw new Error("Failed to create folio");
    return folio;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    const pool = getPool();
    await pool.query(
      "UPDATE folios SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );
  }

}
