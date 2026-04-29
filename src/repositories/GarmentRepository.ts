import { getPool } from "../config/database";
import { FolioGarment, FolioProcess, Garment } from "../types";

interface GarmentFilterOptions {
  search?: string;
  sortBy?: 'garment_code';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class GarmentRepository {
  async findAll(filters: GarmentFilterOptions = {}): Promise<{ garments: Garment[]; total: number }> {
    const pool = getPool();
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const sortBy = filters.sortBy || 'garment_code';
    const sortOrder = (filters.sortOrder || 'asc').toUpperCase();

    let whereConditions: string[] = [];
    const params: any[] = [];

    // Filtro por búsqueda (garment_code)
    if (filters.search) {
      whereConditions.push("garment_code LIKE ?");
      params.push(`%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    // Obtener total de registros
    const countQuery = `SELECT COUNT(*) as total FROM garments ${whereClause}`;
    const [countResult] = await pool.query<any[]>(countQuery, params);
    const total = countResult[0].total;

    // Obtener prendas con paginación
    const query = `
      SELECT * FROM garments 
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;
    
    const queryParams = [...params, limit, offset];
    const [rows] = await pool.query<any[]>(query, queryParams);

    return { garments: rows, total };
  }

  async findById(id: number): Promise<Garment | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM garments WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByCode(garmentCode: string): Promise<Garment | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM garments WHERE garment_code = ?",
      [garmentCode]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(garmentDescription: string, garmentCode: string): Promise<Garment> {
    const pool = getPool();
    const query = `
      INSERT INTO garments (garment_description, garment_code)
      VALUES (?, ?)
    `;
    const [result] = await pool.query<any>(query, [garmentDescription, garmentCode]);
    const garment = await this.findById(result.insertId);
    if (!garment) throw new Error("Failed to create garment");
    return garment;
  }


  async delete(garmentId: number): Promise<void> {
    const pool = getPool();
    await pool.query("DELETE FROM garments WHERE id = ?", [garmentId]);
  }

  async getFolioAssociations(garmentId: number): Promise<any[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT f.id, f.folio_number, f.project_id, f.status, fg.created_at as associated_at
       FROM folio_garments fg
       INNER JOIN folios f ON fg.folio_id = f.id
       WHERE fg.garment_id = ?
       ORDER BY fg.created_at DESC`,
      [garmentId]
    );
    return rows;
  }

    async getGarmentsByFolioId(folioId: number): Promise<Garment[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT g.* FROM garments g
       INNER JOIN folio_garments fg ON g.id = fg.garment_id
       WHERE fg.folio_id = ?
       ORDER BY g.garment_number ASC`,
      [folioId]
    );
    return rows;
  }

  async createGarment(garmentNumber: number, garmentCode: string): Promise<Garment> {
    const pool = getPool();
    const query = `
      INSERT INTO garments (garment_number, garment_code, status, created_at, updated_at)
      VALUES (?, ?, 'PENDING', NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [garmentNumber, garmentCode]);
    const garment = await this.findGarmentById(result.insertId);
    if (!garment) throw new Error("Failed to create garment");
    return garment;
  }

  async findGarmentById(garmentId: number): Promise<Garment | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM garments WHERE id = ?",
      [garmentId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findGarmentByCode(garmentCode: string): Promise<Garment | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM garments WHERE garment_code = ?",
      [garmentCode]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async associateGarmentToFolio(folioId: number, garmentId: number): Promise<FolioGarment> {
    const pool = getPool();
    const query = `
      INSERT INTO folio_garments (folio_id, garment_id, created_at)
      VALUES (?, ?, NOW())
    `;
    const [result] = await pool.query<any>(query, [folioId, garmentId]);
    const association = await this.getFolioGarmentById(result.insertId);
    if (!association) throw new Error("Failed to associate garment to folio");
    return association;
  }

  async disassociateGarmentFromFolio(folioId: number, garmentId: number): Promise<void> {
    const pool = getPool();
    await pool.query(
      "DELETE FROM folio_garments WHERE folio_id = ? AND garment_id = ?",
      [folioId, garmentId]
    );
  }

  async getFolioGarmentById(id: number): Promise<FolioGarment | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM folio_garments WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async updateGarmentStatus(garmentId: number, status: string): Promise<void> {
    const pool = getPool();
    await pool.query(
      "UPDATE garments SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, garmentId]
    );
  }

  async getFolioProcessesByGarment(garmentId: number): Promise<FolioProcess[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM folio_processes WHERE garment_id = ? ORDER BY created_at ASC`,
      [garmentId]
    );
    return rows;
  }

  async areGarmentsInFolioCompleted(folioId: number): Promise<boolean> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT COUNT(*) as count FROM garments g
       INNER JOIN folio_garments fg ON g.id = fg.garment_id
       WHERE fg.folio_id = ? AND g.status != 'COMPLETED'`,
      [folioId]
    );
    return rows[0].count === 0;
  }
}
