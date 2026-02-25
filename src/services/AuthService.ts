import bcryptjs from "bcryptjs";
import { UserRepository } from "../repositories/UserRepository";
import { generateToken } from "../config/jwt";
import { User, AuthPayload } from "../types";
import logger from "../config/logger";

export class AuthService {
  private userRepository = new UserRepository();

  async register(email: string, password: string, fullName: string, roleId: number, sectionId?: number): Promise<AuthPayload> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn("Registration attempt with existing email", { email });
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcryptjs.hash(password, 10);
    const user = await this.userRepository.create(email, passwordHash, fullName, roleId, sectionId);

    logger.info("User registered successfully", { userId: user.id, email, roleId });

    return {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      section_id: user.section_id
    };
  }

  async login(email: string, password: string): Promise<{ user: AuthPayload; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn("Failed login attempt - user not found", { email });
      throw new Error("Invalid email or password");
    }

    if (!user.is_active) {
      logger.warn("Failed login attempt - user inactive", { email, userId: user.id });
      throw new Error("User account is inactive");
    }

    const passwordMatch = await bcryptjs.compare(password, user.password_hash);
    if (!passwordMatch) {
      logger.warn("Failed login attempt - invalid password", { email, userId: user.id });
      throw new Error("Invalid email or password");
    }

    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      section_id: user.section_id
    };

    const token = generateToken(payload);

    logger.info("User logged in successfully", { userId: user.id, email, roleId: user.role_id });

    return {
      user: payload,
      token
    };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.is_active) {
      logger.warn("User validation failed", { userId });
      throw new Error("User not found or inactive");
    }
    return user;
  }
}
