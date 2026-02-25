import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await this.userService.getUserById(req.user.id);
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const users = await this.userService.listUsers(limit, offset);
      res.status(200).json({ users, count: users.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.params;

      const users = await this.userService.getUsersByRole(role as any);
      res.status(200).json({ users });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async assignToSection(req: Request, res: Response): Promise<void> {
    try {
      const { userId, sectionId } = req.body;

      if (!userId || !sectionId) {
        res.status(400).json({ error: "userId and sectionId are required" });
        return;
      }

      const user = await this.userService.assignToSection(userId, sectionId);
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
