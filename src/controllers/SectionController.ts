import { Request, Response } from "express";
import { SectionService } from "../services/SectionService";

export class SectionController {
  private sectionService = new SectionService();

  async getSection(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const section = await this.sectionService.getSectionById(parseInt(id));
      res.status(200).json({ section });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createSection(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      const section = await this.sectionService.createSection(name, description || "");
      res.status(201).json({ section });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listSections(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const sections = await this.sectionService.listSections(limit, offset);
      res.status(200).json({ sections, count: sections.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSectionWithUsers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const section = await this.sectionService.getSectionWithUsers(parseInt(id));
      res.status(200).json({ section });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getSectionStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const stats = await this.sectionService.getSectionStats(parseInt(id));
      res.status(200).json({ stats });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
