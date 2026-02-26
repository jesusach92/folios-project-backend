import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";

export class DashboardController {
  private dashboardService = new DashboardService();

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const role = req.query.role as string || "admin";
      const dashboardData = await this.dashboardService.getDashboardData(req.user.id, role);

      res.status(200).json(dashboardData);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error fetching dashboard data" });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const stats = await this.dashboardService.getDashboardStatsOverview();
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error fetching statistics" });
    }
  }

  async getFolioDistribution(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const distribution = await this.dashboardService.getFolioDistribution();
      res.status(200).json({ distribution });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error fetching distribution" });
    }
  }

  async getProjectsOverview(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const projects = await this.dashboardService.getProjectsOverview();
      res.status(200).json({ projects });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error fetching projects" });
    }
  }
}
