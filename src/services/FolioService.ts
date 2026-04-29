import { FolioRepository } from "../repositories/FolioRepository";
import { AuditRepository } from "../repositories/AuditRepository";
import { Folio, Garment, DeliveryDate, AuditAction, FolioGarment } from "../types";
import logger from "../config/logger";

export class FolioService {
  private folioRepository = new FolioRepository();
  private auditRepository = new AuditRepository();

  async getFolios(filters: {
    search?: string;
    status?: string;
    projectId?: number;
    sortBy?: 'created_at' | 'folio_number';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ folios: Folio[]; total: number; page: number; pageSize: number }> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const offset = (page - 1) * pageSize;

    const result = await this.folioRepository.findAll({
      search: filters.search,
      status: filters.status,
      projectId: filters.projectId,
      sortBy: filters.sortBy || 'created_at',
      sortOrder: filters.sortOrder || 'desc',
      limit: pageSize,
      offset
    });

    logger.info("Folios retrieved", {
      totalCount: result.total,
      returnedCount: result.folios.length,
      page,
      pageSize,
      filters
    });

    return {
      folios: result.folios,
      total: result.total,
      page,
      pageSize
    };
  }

  async getFolioById(id: number): Promise<Folio> {
    const folio = await this.folioRepository.findById(id);
    if (!folio) {
      logger.warn("Folio not found", { folioId: id });
      throw new Error("Folio not found");
    }
    return folio;
  }

  async getFoliosByProject(projectId: number, limit: number = 50, offset: number = 0): Promise<Folio[]> {
    return this.folioRepository.findByProjectId(projectId, limit, offset);
  }

  async createFolio(projectId: number, folioNumber: string, quantity: number, duedate: Date, userId: number): Promise<Folio> {
    const folio = await this.folioRepository.create(projectId, folioNumber, quantity, duedate);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "FOLIO",
      folio.id,
      userId,
      `Folio ${folioNumber} created for project ${projectId}`,
      undefined,
      JSON.stringify({ folioNumber, quantity })
    );

    logger.info("Folio created", { folioId: folio.id, folioNumber, projectId, userId });

    return folio;
  }

  async setDeliveryDate(folioId: number, dueDate: Date, userId: number, notes?: string): Promise<DeliveryDate> {
    await this.getFolioById(folioId);
    
    const deliveryDate = await this.folioRepository.createDeliveryDate(folioId, dueDate, notes);

    await this.auditRepository.log(
      AuditAction.DATE_CHANGE,
      "DELIVERY_DATE",
      deliveryDate.id,
      userId,
      `Delivery date set: ${notes || ""}`,
      undefined,
      dueDate.toISOString()
    );

    logger.info("Delivery date set", { folioId, dueDate, userId });

    return deliveryDate;
  }

  async updateDeliveryDate(dateId: number, newDueDate: Date, userId: number, reason: string): Promise<void> {
    const oldDate = await this.folioRepository.getDeliveryDateById(dateId);
    if (!oldDate) throw new Error("Delivery date not found");

    await this.folioRepository.updateDeliveryDate(dateId, newDueDate);

    await this.auditRepository.log(
      AuditAction.DATE_CHANGE,
      "DELIVERY_DATE",
      dateId,
      userId,
      `Delivery date changed: ${reason}`,
      oldDate.due_date.toISOString(),
      newDueDate.toISOString()
    );

    logger.info("Delivery date updated", { dateId, oldDate: oldDate.due_date, newDate: newDueDate, userId, reason });
  }

  async createGarment(folioId: number, garmentNumber: number, garmentCode: string, userId: number): Promise<Garment> {
    await this.getFolioById(folioId);

    // Create or find garment
    let garment = await this.folioRepository.findGarmentByCode(garmentCode);
    if (!garment) {
      garment = await this.folioRepository.createGarment(garmentNumber, garmentCode);
    }

    // Associate garment to folio
    await this.folioRepository.associateGarmentToFolio(folioId, garment.id);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "GARMENT",
      garment.id,
      userId,
      `Garment ${garmentCode} associated to folio ${folioId}`,
      undefined,
      JSON.stringify({ garmentNumber, garmentCode, folioId })
    );

    logger.info("Garment associated to folio", { garmentId: garment.id, folioId, garmentCode, userId });

    return garment;
  }

  async getGarmentsByFolio(folioId: number): Promise<Garment[]> {
    await this.getFolioById(folioId);
    return this.folioRepository.getGarmentsByFolioId(folioId);
  }

  async associateExistingGarmentToFolio(folioId: number, garmentId: number, userId: number): Promise<FolioGarment> {
    await this.getFolioById(folioId);
    
    const garment = await this.folioRepository.findGarmentById(garmentId);
    if (!garment) {
      throw new Error("Garment not found");
    }

    const association = await this.folioRepository.associateGarmentToFolio(folioId, garmentId);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "FOLIO_GARMENT",
      association.id,
      userId,
      `Garment ${garment.garment_code} associated to folio ${folioId}`,
      undefined,
      JSON.stringify({ folioId, garmentId })
    );

    logger.info("Garment associated to folio", { folioId, garmentId, userId });

    return association;
  }

  async disassociateGarmentFromFolio(folioId: number, garmentId: number, userId: number): Promise<void> {
    await this.getFolioById(folioId);
    
    const garment = await this.folioRepository.findGarmentById(garmentId);
    if (!garment) {
      throw new Error("Garment not found");
    }

    await this.folioRepository.disassociateGarmentFromFolio(folioId, garmentId);

    await this.auditRepository.log(
      AuditAction.DELETED,
      "FOLIO_GARMENT",
      garmentId,
      userId,
      `Garment ${garment.garment_code} disassociated from folio ${folioId}`,
      JSON.stringify({ folioId, garmentId }),
      undefined
    );

    logger.info("Garment disassociated from folio", { folioId, garmentId, userId });
  }

  async closeFolio(folioId: number, userId: number): Promise<void> {
    const isCompleted = await this.folioRepository.areGarmentsInFolioCompleted(folioId);
    if (!isCompleted) {
      logger.warn("Attempt to close incomplete folio", { folioId, userId });
      throw new Error("Cannot close folio: not all garments are completed");
    }

    await this.folioRepository.updateStatus(folioId, "COMPLETED");

    await this.auditRepository.log(
      AuditAction.STATE_CHANGE,
      "FOLIO",
      folioId,
      userId,
      `Folio closed`,
      "ACTIVE",
      "COMPLETED"
    );

    logger.info("Folio closed", { folioId, userId });
  }
}
