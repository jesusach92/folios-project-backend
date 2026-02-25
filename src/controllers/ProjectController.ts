import { Request, Response } from "express";
import { ProjectService } from "../services/ProjectService";

export class ProjectController {
  private projectService = new ProjectService();

  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.projectService.getProjectById(parseInt(id));
      res.status(200).json({ project });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const { name, clientId, salesmanId, description } = req.body;

      if (!name || !clientId || !salesmanId) {
        res.status(400).json({ error: "name, clientId, and salesmanId are required" });
        return;
      }

      const project = await this.projectService.createProject(name, clientId, salesmanId, description || "");
      res.status(201).json({ project });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProjectsByClient(req: Request, res: Response): Promise<void> {
    try {
      const { clientId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const projects = await this.projectService.getProjectsByClient(parseInt(clientId), limit, offset);
      res.status(200).json({ projects, count: projects.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProjectsBySalesman(req: Request, res: Response): Promise<void> {
    try {
      const { salesmanId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const projects = await this.projectService.getProjectsBySalesman(parseInt(salesmanId), limit, offset);
      res.status(200).json({ projects, count: projects.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listProjects(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const projects = await this.projectService.listProjects(limit, offset);
      res.status(200).json({ projects, count: projects.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProjectStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const stats = await this.projectService.getProjectStats(parseInt(id));
      res.status(200).json({ stats });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
