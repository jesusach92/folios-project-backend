import { Request, Response } from "express";
import { ClientService } from "../services/ClientService";

export class ClientController {
  private clientService = new ClientService();

  async getClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const client = await this.clientService.getClientById(parseInt(id));
      res.status(200).json({ client });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createClient(req: Request, res: Response): Promise<void> {
    try {
      const { name, contactEmail, phone, address } = req.body;

      if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      const client = await this.clientService.createClient(name, contactEmail || "", phone || "", address || "");
      res.status(201).json({ client });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listClients(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const clients = await this.clientService.listClients(limit, offset);
      res.status(200).json({ clients, count: clients.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async searchClients(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json({ error: "Search term is required" });
        return;
      }

      const clients = await this.clientService.searchClients(q as string);
      res.status(200).json({ clients, count: clients.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
