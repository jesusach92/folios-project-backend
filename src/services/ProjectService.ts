import { ProjectRepository } from "../repositories/ProjectRepository";
import { Project } from "../types";

export class ProjectService {
  private projectRepository = new ProjectRepository();

  async getProjectById(id: number): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }

  async createProject(name: string, clientId: number, salesmanId: number, description: string): Promise<Project> {
    return this.projectRepository.create(name, clientId, salesmanId, description);
  }

  async getProjectsByClient(clientId: number, limit: number = 50, offset: number = 0): Promise<Project[]> {
    return this.projectRepository.findByClientId(clientId, limit, offset);
  }

  async getProjectsBySalesman(salesmanId: number, limit: number = 50, offset: number = 0): Promise<Project[]> {
    return this.projectRepository.findBySalesmanId(salesmanId, limit, offset);
  }

  async listProjects(limit: number = 50, offset: number = 0): Promise<Project[]> {
    return this.projectRepository.list(limit, offset);
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    await this.getProjectById(id);
    return this.projectRepository.update(id, data);
  }

  async getProjectStats(projectId: number): Promise<any> {
    return this.projectRepository.getProjectStats(projectId);
  }
}
