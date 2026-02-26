import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, role, sectionId } = req.body;

      if (!email || !password || !fullName || !role) {
        res.status(400).json({ error: "Email, password, fullName, and role are required" });
        return;
      }

      const user = await this.authService.register(email, password, fullName, role, sectionId);
      res.status(201).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const user = await this.authService.validateUser(req.user.id);
      res.status(200).json({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role_id,
        section: user.section_id,
        isActive: user.is_active
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
