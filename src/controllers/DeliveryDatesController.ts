import { Request, Response } from "express";
import { DeliveryDatesService } from "../services/DeliveryDatesService";

export class DeliveryDatesController {
  private deliveryDatesService = new DeliveryDatesService();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const garmentFolioRouteId = req.query.garmentFolioRouteId ? parseInt(req.query.garmentFolioRouteId as string) : undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 50;

      const result = await this.deliveryDatesService.getAll({
        search,
        garmentFolioRouteId,
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

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await this.deliveryDatesService.getById(parseInt(id));
      res.status(200).json({ deliveryDates: item });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 1;
      const item = await this.deliveryDatesService.create(req.body, userId);
      res.status(201).json({ deliveryDates: item });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 1;
      const item = await this.deliveryDatesService.update(parseInt(id), req.body, userId);
      res.status(200).json({ deliveryDates: item });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 1;
      await this.deliveryDatesService.delete(parseInt(id), userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeliveryDate(req: Request, res: Response): Promise<void> {
    try {
      const { folioRouteId } = req.params;
      const item = await this.deliveryDatesService.getDeliveryDate(parseInt(folioRouteId));
      if (!item) {
        res.status(404).json({ error: "Delivery date not found" });
      } else {
        res.status(200).json({ deliveryDate: item });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createDeliveryDate(req: Request, res: Response): Promise<void> {
    try {
      const { folioRouteId } = req.params;
      const { dueDate, notes } = req.body;
      const userId = (req as any).user?.id || 1;
      const item = await this.deliveryDatesService.createDeliveryDate(parseInt(folioRouteId), new Date(dueDate), userId, notes);
      res.status(201).json({ deliveryDate: item });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeliveryDateById(req: Request, res: Response): Promise<void> {
    try {
      const { dateId } = req.params;
      const item = await this.deliveryDatesService.getDeliveryDateById(parseInt(dateId));
      if (!item) {
        res.status(404).json({ error: "Delivery date not found" });
      } else {
        res.status(200).json({ deliveryDate: item });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateDeliveryDate(req: Request, res: Response): Promise<void> {
    try {
      const { dateId } = req.params;
      const { newDueDate, notes } = req.body;
      const userId = (req as any).user?.id || 1;
      await this.deliveryDatesService.updateDeliveryDate(parseInt(dateId), new Date(newDueDate), userId, notes);
      res.status(200).json({ message: "Delivery date updated" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
