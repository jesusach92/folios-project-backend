import { getPool } from "../config/database";
import { Client } from "../types";

export class ClientRepository {
  async findById(id: number): Promise<Client | null> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM clients WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(name: string, contactEmail: string, phone: string, address: string): Promise<Client> {
    const pool = getPool();
    const query = `
      INSERT INTO clients (name, contact_email, phone, address, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, true, NOW(), NOW())
    `;
    const [result] = await pool.query<any>(query, [name, contactEmail, phone, address]);
    const client = await this.findById(result.insertId);
    if (!client) throw new Error("Failed to create client");
    return client;
  }

  async list(limit: number = 50, offset: number = 0): Promise<Client[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM clients WHERE is_active = true ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  }

  async update(id: number, data: Partial<Client>): Promise<Client> {
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
      const client = await this.findById(id);
      if (!client) throw new Error("Client not found");
      return client;
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await pool.query(`UPDATE clients SET ${updates.join(", ")} WHERE id = ?`, values);
    const client = await this.findById(id);
    if (!client) throw new Error("Client not found");
    return client;
  }

  async search(searchTerm: string, limit: number = 20): Promise<Client[]> {
    const pool = getPool();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM clients WHERE is_active = true AND (name LIKE ? OR contact_email LIKE ? OR phone LIKE ?)
       ORDER BY name ASC LIMIT ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit]
    );
    return rows;
  }
}
