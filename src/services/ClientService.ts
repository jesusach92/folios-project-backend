import { ClientRepository } from "../repositories/ClientRepository";
import { Client } from "../types";

export class ClientService {
  private clientRepository = new ClientRepository();

  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error("Client not found");
    }
    return client;
  }

  async createClient(name: string, contactEmail: string, phone: string, address: string): Promise<Client> {
    return this.clientRepository.create(name, contactEmail, phone, address);
  }

  async listClients(limit: number = 50, offset: number = 0): Promise<Client[]> {
    return this.clientRepository.list(limit, offset);
  }

  async updateClient(id: number, data: Partial<Client>): Promise<Client> {
    await this.getClientById(id);
    return this.clientRepository.update(id, data);
  }

  async searchClients(searchTerm: string, limit: number = 20): Promise<Client[]> {
    return this.clientRepository.search(searchTerm, limit);
  }
}
