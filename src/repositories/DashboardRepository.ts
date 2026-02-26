import { getPool } from "../config/database";

export class DashboardRepository {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const pool = getPool();

    // Get total folios and by status
    const [folioStats] = await pool.query<any[]>(`
      SELECT 
        COUNT(*) as totalFolios,
        SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as activeFolios,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedFolios,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelledFolios
      FROM folios
    `);

    // Get active folios with details
    const [activeFolios] = await pool.query<any[]>(`
      SELECT 
        f.id,
        f.folio_number as numero,
        f.quantity as cantidad,
        p.name as proyecto,
        f.status as estado,
        f.created_at as fechaCreacion,
        f.updated_at as ultimaActualizacion,
        COALESCE(
          SUM(CASE WHEN g.status = 'COMPLETED' THEN 1 ELSE 0 END),
          0
        ) as componentesCompletados,
        COUNT(g.id) as totalComponentes,
        ROUND(
          COALESCE(
            SUM(CASE WHEN g.status = 'COMPLETED' THEN 1 ELSE 0 END),
            0
          ) * 100 / NULLIF(COUNT(g.id), 0),
          0
        ) as progreso
      FROM folios f
      LEFT JOIN projects p ON f.project_id = p.id
      LEFT JOIN garments g ON f.id = g.folio_id
      WHERE f.status = 'ACTIVE'
      GROUP BY f.id, f.folio_number, f.quantity, p.name, f.status, f.created_at, f.updated_at
      ORDER BY f.created_at DESC
      LIMIT 10
    `);

    // // Get recent activities/alerts
    // const [recentActivities] = await pool.query<any[]>(`
    //   SELECT 
    //     a.id,
    //     a.action as tipo,
    //     a.table_name as tabla,
    //     a.description as mensaje,
    //     a.created_at as timestamp,
    //     u.email as usuario
    //   FROM audit_log a
    //   LEFT JOIN users u ON a.user_id = u.id
    //   ORDER BY a.created_at DESC
    //   LIMIT 5
    // `);

    // Get completed today
    const [completedToday] = await pool.query<any[]>(`
      SELECT COUNT(*) as completedToday
      FROM folios
      WHERE status = 'COMPLETED'
        AND DATE(updated_at) = CURDATE()
    `);

    // Get delayed folios (if there's a delivery date concept)
    const [delayedFolios] = await pool.query<any[]>(`
      SELECT 
        f.id,
        f.folio_number as numero,
        p.name as proyecto,
        f.status as estado,
        f.created_at as fechaCreacion
      FROM folios f
      LEFT JOIN projects p ON f.project_id = p.id
      WHERE f.status = 'ACTIVE'
        AND f.created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY f.created_at ASC
      LIMIT 5
    `);

    // Get user count by role for admin overview
    const [userStats] = await pool.query<any[]>(`
      SELECT 
        r.name as role,
        COUNT(u.id) as count
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.is_active = true
      GROUP BY r.name
    `);

    return {
      stats: folioStats[0] || {},
      activeFolios: activeFolios || [],
    //   recentActivities: recentActivities || [],
      completedToday: completedToday[0]?.completedToday || 0,
      delayedFolios: delayedFolios || [],
      userStats: userStats || [],
    };
  }

  /**
   * Get dashboard data for a specific role
   */
  async getDashboardDataByRole(_userId: number, role: string) {
    const dashboardData = await this.getDashboardStats();

    // Role-specific filtering can be added here
    if (role === 'supervisor') {
      // Filter data for supervisor's team
      // This would require additional logic based on team assignments
    }

    return dashboardData;
  }

  /**
   * Get folio status distribution
   */
  async getFolioDistribution() {
    const pool = getPool();
    const [distribution] = await pool.query<any[]>(`
      SELECT 
        status,
        COUNT(*) as count
      FROM folios
      GROUP BY status
    `);
    return distribution || [];
  }

  /**
   * Get projects overview
   */
  async getProjectsOverview() {
    const pool = getPool();
    const [projects] = await pool.query<any[]>(`
      SELECT 
        p.id,
        p.name,
        c.name as clientName,
        COUNT(f.id) as folioCount,
        SUM(CASE WHEN f.status = 'ACTIVE' THEN 1 ELSE 0 END) as activeFolios,
        SUM(CASE WHEN f.status = 'COMPLETED' THEN 1 ELSE 0 END) as completedFolios
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      LEFT JOIN folios f ON p.id = f.project_id
      GROUP BY p.id, p.name, c.name
      ORDER BY folioCount DESC
      LIMIT 10
    `);
    return projects || [];
  }
}
