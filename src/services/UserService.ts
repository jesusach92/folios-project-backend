import { UserRepository } from "../repositories/UserRepository";
import { User } from "../types";

export class UserService {
  private userRepository = new UserRepository();

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
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

  async deactivateUser(userId: number): Promise<void> {
    await this.userRepository.update(userId, { is_active: false } as any);
  }
}
