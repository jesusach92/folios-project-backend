import { UserRepository } from "../repositories/UserRepository";
import { SectionRepository } from "../repositories/SectionRepository";
import { User, UserRole } from "../types";
import bcryptjs from "bcryptjs";
import logger from "../config/logger";

export class UserService {
  private userRepository = new UserRepository();
  private sectionRepository = new SectionRepository();

  /**
   * RF-01: Create new user with complete validation
   * 
   * VALIDATIONS:
   * 1. Email uniqueness - must not already exist
   * 2. Email format - must be valid email
   * 3. Password - must be non-empty
   * 4. Role validity - must be valid UserRole enum
   * 5. Section validity - if provided, must exist and be active
   * 
   * SECURITY:
   * - Password is bcrypt hashed (salt rounds = 10)
   * - Raw password is never logged or stored
   */
  async createUser(
    email: string,
    password: string,
    fullName: string,
    roleId: UserRole,
    sectionId?: number
  ): Promise<User> {
    // Validation 1: Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validation 2: Check email uniqueness
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn("Attempt to create user with existing email", { email });
      throw new Error("Email already exists");
    }

    // Validation 3: Validate password
    if (password.trim().length === 0) {
      throw new Error("Password cannot be empty");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Validation 4: Validate role
    const validRoles = Object.values(UserRole).filter(v => typeof v === "number");
    if (!validRoles.includes(roleId)) {
      throw new Error(
        `Invalid role_id: ${roleId}. Valid roles are: ADMIN(1), PLANNING(2), SECTION_CHIEF(3), OPERATOR(4), SALESMAN(5), MANAGER(6)`
      );
    }

    // Validation 5: Validate section if provided
    if (sectionId) {
      const section = await this.sectionRepository.findById(sectionId);
      if (!section) {
        throw new Error(`Section with ID ${sectionId} not found`);
      }
      if (!section.is_active) {
        throw new Error(`Section ${sectionId} is inactive`);
      }
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create user
    const user = await this.userRepository.create(
      email,
      passwordHash,
      fullName,
      roleId,
      sectionId
    );

    logger.info("User created successfully", {
      userId: user.id,
      email,
      roleId,
      sectionId
    });

    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateProfile(userId: number, fullName: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (fullName.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }

    const updatedUser = await this.userRepository.update(userId, {
      full_name: fullName
    } as any);

    logger.info("User profile updated", { userId, fullName });

    return updatedUser;
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Get user with password hash
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate current password
    const passwordMatch = await bcryptjs.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      logger.warn("Password change attempt with incorrect current password", {
        userId
      });
      throw new Error("Current password is incorrect");
    }

    // Validate new password
    if (newPassword.trim().length === 0) {
      throw new Error("New password cannot be empty");
    }

    if (newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }

    if (currentPassword === newPassword) {
      throw new Error("New password must be different from current password");
    }

    // Hash new password
    const newPasswordHash = await bcryptjs.hash(newPassword, 10);

    // Update password
    await this.userRepository.update(userId, {
      password_hash: newPasswordHash
    } as any);

    logger.info("User password changed", { userId });
  }

  async adminUpdateUser(userId: number, roleId?: UserRole, password?: string): Promise<User> {
    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updates: any = {};

    // Update role if provided
    if (roleId !== undefined) {
      const validRoles = Object.values(UserRole).filter(v => typeof v === "number");
      if (!validRoles.includes(roleId)) {
        throw new Error(
          `Invalid role_id: ${roleId}. Valid roles are: ADMIN(1), PLANNING(2), SECTION_CHIEF(3), OPERATOR(4), SALESMAN(5), MANAGER(6)`
        );
      }
      updates.role_id = roleId;
    }

    // Update password if provided
    if (password !== undefined) {
      if (password.trim().length === 0) {
        throw new Error("Password cannot be empty");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const passwordHash = await bcryptjs.hash(password, 10);
      updates.password_hash = passwordHash;
    }

    const updatedUser = await this.userRepository.update(userId, updates);

    logger.info("Admin updated user", {
      adminUpdatedUserId: userId,
      updatedFields: Object.keys(updates)
    });

    return updatedUser;
  }

  async getUsersByRole(roleId: number): Promise<User[]> {
    return this.userRepository.findByRoleId(roleId);
  }

  async getUsersBySection(sectionId: number): Promise<User[]> {
    return this.userRepository.findBySectionId(sectionId);
  }

  async listUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    return this.userRepository.findAll(limit, offset);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = await this.userRepository.update(id, data);
    return updatedUser;
  }

  async assignToSection(userId: number, sectionId: number): Promise<User> {
    return this.userRepository.update(userId, { section_id: sectionId } as any);
  }

  /**
   * Assign section to user with validation
   * 
   * VALIDATIONS:
   * 1. User must exist
   * 2. User must NOT have a section already assigned
   * 3. Section must exist and be active
   * 
   * SECURITY:
   * - Only Admin can perform this operation (enforced by middleware)
   */
  async assignSectionToUser(userId: number, sectionId: number): Promise<User> {
    // Validation 1: Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Validation 2: Check if user already has a section
    if (user.section_id !== null && user.section_id !== undefined) {
      throw new Error(`User ${userId} already has section ${user.section_id} assigned. Cannot reassign section.`);
    }

    // Validation 3: Check if section exists and is active
    const section = await this.sectionRepository.findById(sectionId);
    if (!section) {
      throw new Error(`Section with ID ${sectionId} not found`);
    }
    if (!section.is_active) {
      throw new Error(`Section ${sectionId} is inactive and cannot be assigned`);
    }

    // Assign section
    const updatedUser = await this.userRepository.update(userId, { section_id: sectionId } as any);

    logger.info("Section assigned to user", {
      userId,
      sectionId,
      userName: updatedUser.email
    });

    return updatedUser;
  }

  async deactivateUser(userId: number): Promise<void> {
    await this.userRepository.update(userId, { is_active: false } as any);
  }
}
