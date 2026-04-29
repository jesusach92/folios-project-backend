import { getPool } from "../config/database";
import { DeliveryDate, DeliveryDates } from "../types";

interface DeliveryDatesFilterOptions {
  search?: string;
  garmentFolioRouteId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class DeliveryDatesRepository {
  async findAll(filters: DeliveryDatesFilterOptions = {}): Promise<{ delivery_dates: DeliveryDate[]; total: number }> {
    const pool = getPool();
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = (filters.sortOrder || 'desc').toUpperCase();

    let whereConditions: string[] = [];
    const params: any[] = [];

    if (filters.garmentFolioRouteId !== undefined) {
      whereConditions.push("garment_folio_route_id = ?");
      params.push(filters.garmentFolioRouteId);
    }

    if (filters.search) {
      whereConditions.push("notes LIKE ?");
      params.push(`%${filters.search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const countQuery = `SELECT COUNT(*) as total FROM delivery_dates ${whereClause}`;
    const [countResult] = await pool.query<any[]>(countQuery, params);
    const total = countResult[0].total;

    const query = `SELECT * FROM delivery_dates ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
    const [delivery_dates] = await pool.query<any[]>(query, [...params, limit, offset]);

    return { delivery_dates, total };
  }

  async findById(id: number): Promise<DeliveryDates | null> {
    const pool = getPool();
    const query = `SELECT * FROM delivery_dates WHERE id = ?`;
    const [result] = await pool.query<any[]>(query, [id]);

    return result.length > 0 ? result[0] : null;
  }

  async create(data: any): Promise<DeliveryDates> {
    const pool = getPool();
    const isActive = data.is_active !== undefined ? data.is_active : true;
    const query = `INSERT INTO delivery_dates (garment_folio_route_id, due_date, notes, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
    const [result] = await pool.query<any>(query, [
      data.garment_folio_route_id,
      data.due_date,
      data.notes || null,
      isActive,
    ]);

    return this.findById(result.insertId) as Promise<DeliveryDates>;
  }

  async update(id: number, data: any): Promise<DeliveryDates> {
    const pool = getPool();
    const fields: string[] = [];
    const params: any[] = [];

    if (data.due_date !== undefined) {
      fields.push("due_date = ?");
      params.push(data.due_date);
    }

    if (data.notes !== undefined) {
      fields.push("notes = ?");
      params.push(data.notes);
    }

    if (data.is_active !== undefined) {
      fields.push("is_active = ?");
      params.push(data.is_active);
    }

    if (fields.length === 0) {
      return this.findById(id) as Promise<DeliveryDates>;
    }

    fields.push("updated_at = NOW()");
    const query = `UPDATE delivery_dates SET ${fields.join(", ")} WHERE id = ?`;
    params.push(id);

    await pool.query(query, params);

    return this.findById(id) as Promise<DeliveryDates>;
  }

  async delete(id: number): Promise<void> {
    const pool = getPool();
    const query = `DELETE FROM delivery_dates WHERE id = ?`;
    await pool.query(query, [id]);
  }

  async getDeliveryDate(folioRouteId: number): Promise<DeliveryDate | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM delivery_dates WHERE garment_folio_route_id = ? AND is_active = true",
      [folioRouteId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createDeliveryDate(folioRouteId: number, dueDate: Date, notes?: string): Promise<DeliveryDate> {
    const pool = getPool();
    const query = `
      INSERT INTO delivery_dates (garment_folio_route_id, due_date, notes, is_active, created_at, updated_at)
      VALUES (?, ?, ?, true, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [folioRouteId, dueDate, notes || null]);
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
