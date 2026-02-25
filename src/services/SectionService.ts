import { SectionRepository } from "../repositories/SectionRepository";
import { Section } from "../types";

export class SectionService {
  private sectionRepository = new SectionRepository();

  async getSectionById(id: number): Promise<Section> {
    const section = await this.sectionRepository.findById(id);
    if (!section) {
      throw new Error("Section not found");
    }
    return section;
  }

  async createSection(name: string, description: string): Promise<Section> {
    return this.sectionRepository.create(name, description);
  }

  async listSections(limit: number = 50, offset: number = 0): Promise<Section[]> {
    return this.sectionRepository.list(limit, offset);
  }

  async updateSection(id: number, data: Partial<Section>): Promise<Section> {
    await this.getSectionById(id);
    return this.sectionRepository.update(id, data);
  }

  async getSectionWithUsers(sectionId: number): Promise<any> {
    return this.sectionRepository.getWithUsers(sectionId);
  }

  async getSectionStats(sectionId: number): Promise<any> {
    return this.sectionRepository.getSectionStats(sectionId);
  }
}
