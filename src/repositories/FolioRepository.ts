import { getPool } from "../config/database";
import { Folio, Garment, FolioProcess, DeliveryDate } from "../types";

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

  async create(projectId: number, folioNumber: string, quantity: number): Promise<Folio> {
    const pool = getPool();
    const query = `
      INSERT INTO folios (project_id, folio_number, quantity, status, created_at, updated_at)
      VALUES (?, ?, ?, 'ACTIVE', NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [projectId, folioNumber, quantity]);
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

  async getGarmentsByFolioId(folioId: number): Promise<Garment[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM garments WHERE folio_id = ? ORDER BY garment_number ASC",
      [folioId]
    );
    return rows;
  }

  async createGarment(folioId: number, garmentNumber: number, garmentCode: string): Promise<Garment> {
    const pool = getPool();
    const query = `
      INSERT INTO garments (folio_id, garment_number, garment_code, status, created_at, updated_at)
      VALUES (?, ?, ?, 'PENDING', NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [folioId, garmentNumber, garmentCode]);
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
      `SELECT COUNT(*) as count FROM garments WHERE folio_id = ? AND status != 'COMPLETED'`,
      [folioId]
    );
    return rows[0].count === 0;
  }

  async getDeliveryDate(folioId: number): Promise<DeliveryDate | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM delivery_dates WHERE folio_id = ? AND is_active = true",
      [folioId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createDeliveryDate(folioId: number, dueDate: Date, notes?: string): Promise<DeliveryDate> {
    const pool = getPool();
    const query = `
      INSERT INTO delivery_dates (folio_id, due_date, notes, is_active, created_at, updated_at)
      VALUES (?, ?, ?, true, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [folioId, dueDate, notes || null]);
    const deliveryDate = await this.getDeliveryDateById(result.insertId);
    if (!deliveryDate) throw new Error("Failed to create delivery date");
    return deliveryDate;
  }

  async getDeliveryDateById(dateId: number): Promise<DeliveryDate | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM delivery_dates WHERE id = ?",
      [dateId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async updateDeliveryDate(dateId: number, newDueDate: Date, notes?: string): Promise<void> {
    const pool = getPool();
    let query = "UPDATE delivery_dates SET due_date = ?, updated_at = NOW()";
    const values: any[] = [newDueDate];
    
    if (notes !== undefined) {
      query += ", notes = ?";
      values.push(notes);
    }
    
    query += " WHERE id = ?";
    values.push(dateId);
    
    await pool.query(query, values);
  }
}
