import { Request, Response } from "express";
import { getPool } from "../config/database";
import { seedDatabase } from "../../scripts/seedDatabase";
import logger from "../config/logger";

class DemoController {
  /**
   * Reset database with test data
   * Only available for development/testing
   * POST /api/admin/demo/reset
   */
  async resetDemoData(req: Request, res: Response): Promise<void> {
    try {
      // Additional security check - only allow in development
      if (process.env.NODE_ENV === "production") {
        res.status(403).json({
          error: "This endpoint is not available in production"
        });
        return;
      }

      const connection = await getPool().getConnection();

      try {
        logger.info("Starting demo data reset...");
        await seedDatabase(connection);

        res.json({
          message: "Demo data successfully reset",
          accounts: {
            admin: {
              email: "admin@folios.com",
              password: "Admin123!",
              role: "ADMIN"
            },
            manager: {
              email: "manager@folios.com",
              password: "Manager123!",
              role: "MANAGER"
            },
            supervisor: {
              email: "supervisor.corte@folios.com",
              password: "Super123!",
              role: "SUPERVISOR",
              section: "Corte"
            },
            operator: {
              email: "operator.corte@folios.com",
              password: "Operator123!",
              role: "OPERATOR",
              section: "Corte"
            },
            salesman: {
              email: "salesman@folios.com",
              password: "Sales123!",
              role: "SALESMAN"
            }
          }
        });

        logger.info("Demo data reset completed successfully");
      } finally {
        connection.release();
      }
    } catch (error) {
      logger.error("Error resetting demo data:", error);
      res.status(500).json({
        error: "Failed to reset demo data",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  /**
   * Get demo accounts information
   * GET /api/admin/demo/accounts
   */
  async getDemoAccounts(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        message: "Available demo accounts",
        accounts: {
          admin: {
            email: "admin@folios.com",
            password: "Admin123!",
            role: "ADMIN",
            description: "Full system access"
          },
          manager: {
            email: "manager@folios.com",
            password: "Manager123!",
            role: "MANAGER",
            description: "Project and folio management"
          },
          supervisor: {
            email: "supervisor.corte@folios.com",
            password: "Super123!",
            role: "SUPERVISOR",
            section: "Corte",
            description: "Section-level supervision"
          },
          operator: {
            email: "operator.corte@folios.com",
            password: "Operator123!",
            role: "OPERATOR",
            section: "Corte",
            description: "Process execution and progress tracking"
          },
          salesman: {
            email: "salesman@folios.com",
            password: "Sales123!",
            role: "SALESMAN",
            description: "Project creation and client management"
          }
        }
      });
    } catch (error) {
      logger.error("Error fetching demo accounts:", error);
      res.status(500).json({
        error: "Failed to fetch demo accounts"
      });
    }
  }

  /**
   * Get demo data statistics
   * GET /api/admin/demo/stats
   */
  async getDemoStats(req: Request, res: Response): Promise<void> {
    try {
      const connection = await getPool().getConnection();

      try {
        const stats: any = {};

        const tables = [
          "users",
          "roles",
          "sections",
          "clients",
          "projects",
          "folios",
          "garments",
          "routes",
          "processes",
          "folio_routes",
          "folio_processes",
          "delivery_dates",
          "audit_log"
        ];

        for (const table of tables) {
          const [result] = await connection.execute<any>(
            `SELECT COUNT(*) as count FROM ${table}`
          );
          stats[table] = result[0].count;
        }

        res.json({
          message: "Demo database statistics",
          stats
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      logger.error("Error fetching demo stats:", error);
      res.status(500).json({
        error: "Failed to fetch demo statistics"
      });
    }
  }
}

export default new DemoController();
