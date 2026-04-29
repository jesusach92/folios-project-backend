import { Request, Response } from "express";
import { FolioService } from "../services/FolioService";

export class FolioController {
  private folioService = new FolioService();

  async getFolios(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const status = req.query.status as string | undefined;
      const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
      const sortBy = (req.query.sortBy as 'created_at' | 'folio_number') || 'created_at';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 50;

      const result = await this.folioService.getFolios({
        search,
        status,
        projectId,
        sortBy,
        sortOrder,
        page,
        pageSize
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFolio(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const folio = await this.folioService.getFolioById(parseInt(id));
      res.status(200).json({ folio });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getFoliosByProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const folios = await this.folioService.getFoliosByProject(parseInt(projectId), limit, offset);
      res.status(200).json({ folios, count: folios.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createFolio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { projectId, folioNumber, quantity, dueDate } = req.body;

      if (!projectId || !folioNumber || !quantity || !dueDate) {
        res.status(400).json({ error: "projectId, folioNumber, quantity, and dueDate are required" });
        return;
      }

      const folio = await this.folioService.createFolio(
        projectId,
        folioNumber,
        quantity,
        dueDate,  
        req.user.id
      );
      res.status(201).json({ folio });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateDeliveryDate(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { dateId } = req.params;
      const { newDueDate, reason } = req.body;

      if (!newDueDate || !reason) {
        res.status(400).json({ error: "newDueDate and reason are required" });
        return;
      }

      await this.folioService.updateDeliveryDate(parseInt(dateId), new Date(newDueDate), req.user.id, reason);
      res.status(200).json({ message: "Delivery date updated successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createGarment(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { folioId } = req.params;
      const { garmentNumber, garmentCode } = req.body;

      if (!garmentNumber || !garmentCode) {
        res.status(400).json({ error: "garmentNumber and garmentCode are required" });
        return;
      }

      const garment = await this.folioService.createGarment(parseInt(folioId), garmentNumber, garmentCode, req.user.id);
      res.status(201).json({ garment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getGarmentsByFolio(req: Request, res: Response): Promise<void> {
    try {
      const { folioId } = req.params;
      const garments = await this.folioService.getGarmentsByFolio(parseInt(folioId));
      res.status(200).json({ garments, count: garments.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async associateGarmentToFolio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { folioId } = req.params;
      const { garmentId } = req.body;

      if (!garmentId) {
        res.status(400).json({ error: "garmentId is required" });
        return;
      }

      const association = await this.folioService.associateExistingGarmentToFolio(
        parseInt(folioId),
        garmentId,
        req.user.id
      );
      res.status(201).json({ association });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async disassociateGarmentFromFolio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { folioId, garmentId } = req.params;

      await this.folioService.disassociateGarmentFromFolio(
        parseInt(folioId),
        parseInt(garmentId),
        req.user.id
      );
      res.status(200).json({ message: "Garment disassociated successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async closeFolio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { folioId } = req.params;
      await this.folioService.closeFolio(parseInt(folioId), req.user.id);
      res.status(200).json({ message: "Folio closed successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
