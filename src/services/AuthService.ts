import bcryptjs from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";
import { generateToken } from "../config/jwt";
import { User, AuthPayload, UserRole } from "../types";
import logger from "../config/logger";

export class AuthService {
  private userRepository = new UserRepository();

  /**
   * RF-01: User Registration
   * 
   * Creates a new user with:
   * - Email (unique constraint)
   * - Password (bcrypt hashed with salt rounds = 10)
   * - Assigned role (required, must be valid UserRole enum)
   * - Optional section assignment
   * 
   * CONSTRAINT: A user can only be created with ONE role
   */
  async register(
    email: string,
    password: string,
    fullName: string,
    roleId: UserRole,
    sectionId?: number
  ): Promise<AuthPayload> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn("Registration attempt with existing email", { email });
      throw new Error("User with this email already exists");
    }

    // Password hashing: bcryptjs.hash(password, 10)
    // Salt rounds = 10 ensures secure hashing with acceptable performance
    const passwordHash = await bcryptjs.hash(password, 10);
    const user = await this.userRepository.create(
      email,
      passwordHash,
      fullName,
      roleId,
      sectionId
    );

    logger.info("User registered successfully", {
      userId: user.id,
      email,
      roleId,
      sectionId
    });

    return {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      section_id: user.section_id
    };
  }

  /**
   * RF-01: User Login
   * 
   * Authenticates user by:
   * 1. Finding user by email
   * 2. Verifying user is active (is_active = true)
   * 3. Comparing provided password with stored hash using bcryptjs.compare()
   * 4. Generating JWT token with AuthPayload
   * 
   * SECURITY:
   * - Uses constant-time comparison (bcryptjs.compare)
   * - Generic error messages to prevent email enumeration
   * - Logs all failed attempts with details
   */
  async login(
    email: string,
    password: string
  ): Promise<{ user: AuthPayload; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn("Failed login attempt - user not found", { email });
      throw new Error("Invalid email or password");
    }

    if (!user.is_active) {
      logger.warn("Failed login attempt - user inactive", {
        email,
        userId: user.id
      });
      throw new Error("User account is inactive");
    }

    // Constant-time password comparison
    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      logger.warn("Failed login attempt - invalid password", {
        email,
        userId: user.id
      });
      throw new Error("Invalid email or password");
    }

    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      section_id: user.section_id
    };

    const token = generateToken(payload);

    logger.info("User logged in successfully", {
      userId: user.id,
      email,
      roleId: user.role_id
    });

    return {
      user: payload,
      token
    };
  }

  /**
   * RF-01: User Validation
   * 
   * Validates that a user exists and is active
   * Used by authentication middleware to refresh user context
   */
  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.is_active) {
      logger.warn("User validation failed", { userId });
      throw new Error("User not found or inactive");
    }
    return user;
  }
}

