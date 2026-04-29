import { Request, Response } from "express";
import { GarmentService } from "../services/GarmentService";

export class GarmentController {
  private garmentService = new GarmentService();

  async getGarments(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const sortBy = (req.query.sortBy as 'garment_code') || 'garment_code';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 50;

      const result = await this.garmentService.getGarments({
        search,
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

  async getGarment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const garment = await this.garmentService.getGarmentById(parseInt(id));
      res.status(200).json({ garment });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createGarment(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { garmentDescription, garmentCode } = req.body;

      if (!garmentDescription || !garmentCode) {
        res.status(400).json({ error: "garmentDescription and garmentCode are required" });
        return;
      }

      const garment = await this.garmentService.createGarment(garmentDescription, garmentCode, req.user.id);
      res.status(201).json({ garment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }



  async deleteGarment(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      await this.garmentService.deleteGarment(parseInt(id), req.user.id);
      res.status(200).json({ message: "Garment deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFolioAssociations(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const associations = await this.garmentService.getFolioAssociations(parseInt(id));
      res.status(200).json({ associations, count: associations.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async associateToFolio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id: garmentId } = req.params;
      const { folioId } = req.body;

      if (!folioId) {
        res.status(400).json({ error: "folioId is required" });
        return;
      }

      await this.garmentService.associateToFolio(parseInt(garmentId), folioId, req.user.id);
      res.status(200).json({ message: "Garment associated to folio successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async disassociateFromFolio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id: garmentId, folioId } = req.params;

      if (!folioId) {
        res.status(400).json({ error: "folioId is required" });
        return;
      }

      await this.garmentService.disassociateFromFolio(parseInt(garmentId), parseInt(folioId), req.user.id);
      res.status(200).json({ message: "Garment disassociated from folio successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
