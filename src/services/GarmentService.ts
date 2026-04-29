import { GarmentRepository } from "../repositories/GarmentRepository";
import { FolioRepository } from "../repositories/FolioRepository";
import { AuditRepository } from "../repositories/AuditRepository";
import { Garment, AuditAction } from "../types";
import logger from "../config/logger";

export class GarmentService {
  private garmentRepository = new GarmentRepository();
  private folioRepository = new FolioRepository();
  private auditRepository = new AuditRepository();

  async getGarments(filters: {
    search?: string;
    sortBy?: 'garment_code';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ garments: Garment[]; total: number; page: number; pageSize: number }> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const offset = (page - 1) * pageSize;

    const result = await this.garmentRepository.findAll({
      search: filters.search,
      sortBy: filters.sortBy || 'garment_code',
      sortOrder: filters.sortOrder || 'asc',
      limit: pageSize,
      offset
    });

    logger.info("Garments retrieved", {
      totalCount: result.total,
      returnedCount: result.garments.length,
      page,
      pageSize,
      filters
    });

    return {
      garments: result.garments,
      total: result.total,
      page,
      pageSize
    };
  }

  async getGarmentById(id: number): Promise<Garment> {
    const garment = await this.garmentRepository.findById(id);
    if (!garment) {
      logger.warn("Garment not found", { garmentId: id });
      throw new Error("Garment not found");
    }
    return garment;
  }

  async createGarment(garmentDescription: string, garmentCode: string, userId: number): Promise<Garment> {
    // Check if garment with this code already exists
    const existingGarment = await this.garmentRepository.findByCode(garmentCode);
    if (existingGarment) {
      logger.warn("Attempt to create duplicate garment", { garmentCode, userId });
      throw new Error("Garment with this code already exists");
    }

    const garment = await this.garmentRepository.create(garmentDescription, garmentCode);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "GARMENT",
      garment.id,
      userId,
      `Garment ${garmentCode} created independently`,
      undefined,
      JSON.stringify({ garmentDescription, garmentCode })
    );

    logger.info("Garment created", { garmentId: garment.id, garmentCode, userId });

    return garment;
  }

  async deleteGarment(garmentId: number, userId: number): Promise<void> {
    const garment = await this.getGarmentById(garmentId);

    // Check if garment is associated with any folios
    const associations = await this.garmentRepository.getFolioAssociations(garmentId);
    if (associations.length > 0) {
      logger.warn("Attempt to delete garment with associations", { garmentId, associationCount: associations.length, userId });
      throw new Error(`Cannot delete garment: it is associated with ${associations.length} folio(s)`);
    }

    await this.garmentRepository.delete(garmentId);

    await this.auditRepository.log(
      AuditAction.DELETED,
      "GARMENT",
      garmentId,
      userId,
      `Garment ${garment.garment_code} deleted`,
      JSON.stringify({ id: garment.id, garmentCode: garment.garment_code }),
      undefined
    );

    logger.info("Garment deleted", { garmentId, userId });
  }

  async getFolioAssociations(garmentId: number): Promise<any[]> {
    await this.getGarmentById(garmentId);
    return this.garmentRepository.getFolioAssociations(garmentId);
  }

  async associateToFolio(garmentId: number, folioId: number, userId: number): Promise<void> {
    const garment = await this.getGarmentById(garmentId);
    const folio = await this.folioRepository.findById(folioId);

    if (!folio) {
      logger.warn("Folio not found for association", { garmentId, folioId, userId });
      throw new Error("Folio not found");
    }

    await this.folioRepository.associateGarmentToFolio(folioId, garmentId);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "FOLIO_GARMENT",
      garmentId,
      userId,
      `Garment ${garment.garment_code} associated to folio ${folio.folio_number}`,
      undefined,
      JSON.stringify({ folioId, garmentId })
    );

    logger.info("Garment associated to folio", { garmentId, folioId, userId });
  }

  async disassociateFromFolio(garmentId: number, folioId: number, userId: number): Promise<void> {
    const garment = await this.getGarmentById(garmentId);
    const folio = await this.folioRepository.findById(folioId);

    if (!folio) {
      logger.warn("Folio not found for disassociation", { garmentId, folioId, userId });
      throw new Error("Folio not found");
    }

    await this.folioRepository.disassociateGarmentFromFolio(folioId, garmentId);

    await this.auditRepository.log(
      AuditAction.DELETED,
      "FOLIO_GARMENT",
      garmentId,
      userId,
      `Garment ${garment.garment_code} disassociated from folio ${folio.folio_number}`,
      JSON.stringify({ folioId, garmentId }),
      undefined
    );

    logger.info("Garment disassociated from folio", { garmentId, folioId, userId });
  }
}
