import { getPool } from "../config/database";
import { FolioProcess, ProcessStatus, ProcessProgress, Process } from "../types";

export class ProcessRepository {
  async findById(id: number): Promise<FolioProcess | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM folio_processes WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByGarmentId(garmentId: number): Promise<FolioProcess[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM folio_processes WHERE garment_id = ? ORDER BY created_at ASC`,
      [garmentId]
    );
    return rows;
  }

  async createInstance(folioId: number, garmentId: number, processId: number, routeSectionId: number, totalQuantity: number): Promise<FolioProcess> {
    const pool = getPool();
    const query = `
      INSERT INTO folio_processes (folio_id, garment_id, process_id, route_section_id, status, total_quantity, completed_quantity, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'NOT_STARTED', ?, 0, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [folioId, garmentId, processId, routeSectionId, totalQuantity]);
    const instance = await this.findById(result.insertId);
    if (!instance) throw new Error("Failed to create folio process");
    return instance;
  }

  async updateStatus(id: number, status: ProcessStatus): Promise<void> {
    const pool = getPool();
    const startedAt = status === ProcessStatus.IN_PROGRESS ? new Date() : null;
    const completedAt = status === ProcessStatus.COMPLETED ? new Date() : null;

    const query = `
      UPDATE folio_processes
      SET status = ?, started_at = COALESCE(started_at, ?), completed_at = ?, updated_at = NOW()
      WHERE id = ?
    `;
    await pool.query(query, [status, startedAt, completedAt, id]);
  }

  async updateCompletedQuantity(id: number, quantity: number): Promise<void> {
    const pool = getPool();
    await pool.query(
      `UPDATE folio_processes
       SET completed_quantity = ?, updated_at = NOW()
       WHERE id = ?`,
      [quantity, id]
    );
  }

  async addProgressUpdate(
    folioProcessId: number,
    quantityCompleted: number,
    userId: number,
    reason: string,
    comments?: string
  ): Promise<ProcessProgress> {
    const pool = getPool();
    const query = `
      INSERT INTO process_progress (folio_process_id, quantity_completed, updated_by_user_id, reason, comments, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.query<any>(query, [folioProcessId, quantityCompleted, userId, reason, comments || null]);

    const progress = await this.findProgressById(result.insertId);
    if (!progress) throw new Error("Failed to add progress update");
    return progress;
  }

  async findProgressById(progressId: number): Promise<ProcessProgress | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM process_progress WHERE id = ?",
      [progressId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async getProgressHistory(folioProcessId: number): Promise<ProcessProgress[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT pp.*, u.full_name FROM process_progress pp
       LEFT JOIN users u ON pp.updated_by_user_id = u.id
       WHERE pp.folio_process_id = ? ORDER BY pp.updated_at DESC`,
      [folioProcessId]
    );
    return rows;
  }

  async getProcessesBySection(sectionId: number): Promise<Process[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM processes WHERE section_id = ? AND is_active = true ORDER BY name ASC`,
      [sectionId]
    );
    return rows;
  }

  async findProcessById(id: number): Promise<Process | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM processes WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async getProcessesForFolio(folioId: number): Promise<FolioProcess[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM folio_processes WHERE folio_id = ? ORDER BY created_at ASC`,
      [folioId]
    );
    return rows;
  }

  async checkIfAllProcessesCompleted(garmentId: number): Promise<boolean> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT COUNT(*) as count FROM folio_processes WHERE garment_id = ? AND status != ?`,
      [garmentId, ProcessStatus.COMPLETED]
    );
    return rows[0].count === 0;
  }

  async getProcessesByRouteSection(routeSectionId: number): Promise<FolioProcess[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM folio_processes WHERE route_section_id = ? ORDER BY created_at ASC`,
      [routeSectionId]
    );
    return rows;
  }
}
