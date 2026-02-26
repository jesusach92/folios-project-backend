import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  /**
   * RF-01: Get current user profile
   * Available to all authenticated users
   */
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

  /**
   * Update current user profile
   * User can only modify: full_name
   * User cannot modify: email, role_id, section_id, password
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { full_name } = req.body;

      if (!full_name || full_name.trim().length === 0) {
        res.status(400).json({ error: "full_name is required and cannot be empty" });
        return;
      }

      const user = await this.userService.updateProfile(req.user.id, full_name);
      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role_id: user.role_id,
          section_id: user.section_id
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * RF-01: Create new user (ADMIN ONLY)
   * 
   * VALIDATIONS:
   * - email: Must be unique and valid format
   * - password: Must be non-empty
   * - full_name: Required
   * - role_id: Must be valid UserRole enum value
   * - section_id: Must exist if provided
   * 
   * CONSTRAINTS:
   * - Only ADMIN can create users (enforced by middleware)
   * - Password is hashed before storage (done in service)
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, full_name, role_id, section_id } = req.body;

      // Input validation
      if (!email || !password || !full_name || !role_id) {
        res.status(400).json({
          error: "Missing required fields",
          required: ["email", "password", "full_name", "role_id"]
        });
        return;
      }

      const user = await this.userService.createUser(
        email,
        password,
        full_name,
        role_id,
        section_id
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role_id: user.role_id,
          section_id: user.section_id,
          is_active: user.is_active
        }
      });
    } catch (error: any) {
      // Handle specific validation errors
      if (error.message.includes("already exists")) {
        res.status(400).json({ error: error.message });
      } else if (error.message.includes("invalid") || error.message.includes("Invalid")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
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

  /**
   * Change current user password
   * Requires current password verification for security
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          error: "Missing required fields",
          required: ["currentPassword", "newPassword"]
        });
        return;
      }

      await this.userService.changePassword(req.user.id, currentPassword, newPassword);

      res.status(200).json({
        message: "Password changed successfully"
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Admin update user: role and password
   * Admin can update another user's role and password
   */
  async adminUpdateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { role_id, password } = req.body;

      if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({ error: "User ID must be a valid number" });
        return;
      }

      if (!role_id && !password) {
        res.status(400).json({
          error: "At least one field is required",
          fields: ["role_id", "password"]
        });
        return;
      }

      const user = await this.userService.adminUpdateUser(userId, role_id, password);

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role_id: user.role_id,
          section_id: user.section_id,
          is_active: user.is_active
        }
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes("Invalid")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  /**
   * Assign section to user (ADMIN ONLY)
   * 
   * VALIDATIONS:
   * - User must exist
   * - User must NOT have a section already assigned
   * - Section must exist and be active
   * 
   * CONSTRAINTS:
   * - Only ADMIN can assign sections (enforced by middleware)
   * - Cannot reassign if user already has a section
   */
  async assignSectionToUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { section_id } = req.body;

      if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({ error: "User ID must be a valid number" });
        return;
      }

      if (!section_id) {
        res.status(400).json({ error: "section_id is required" });
        return;
      }

      const user = await this.userService.assignSectionToUser(userId, section_id);

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role_id: user.role_id,
          section_id: user.section_id,
          is_active: user.is_active
        }
      });
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes("already has") || error.message.includes("already assigned")) {
        res.status(409).json({ error: error.message });
      } else if (error.message.includes("Invalid") || error.message.includes("invalid")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
}
