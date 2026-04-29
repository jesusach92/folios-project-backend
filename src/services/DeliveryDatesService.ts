import { DeliveryDatesRepository } from "../repositories/DeliveryDatesRepository";
import { AuditRepository } from "../repositories/AuditRepository";
import { DeliveryDates, DeliveryDate, AuditAction } from "../types";
import logger from "../config/logger";

export class DeliveryDatesService {
  private deliveryDatesRepository = new DeliveryDatesRepository();
  private auditRepository = new AuditRepository();

  async getAll(filters: {
    search?: string;
    garmentFolioRouteId?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ delivery_dates: DeliveryDate[]; total: number; page: number; pageSize: number }> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const offset = (page - 1) * pageSize;

    const result = await this.deliveryDatesRepository.findAll({
      search: filters.search,
      garmentFolioRouteId: filters.garmentFolioRouteId,
      sortBy: filters.sortBy || 'created_at',
      sortOrder: filters.sortOrder || 'desc',
      limit: pageSize,
      offset
    });

    logger.info("DeliveryDates retrieved", {
      totalCount: result.total,
      returnedCount: result.delivery_dates.length,
      page,
      pageSize,
      filters
    });

    return {
      delivery_dates: result.delivery_dates,
      total: result.total,
      page,
      pageSize
    };
  }

  async getById(id: number): Promise<DeliveryDates> {
    const item = await this.deliveryDatesRepository.findById(id);
    if (!item) {
      logger.warn("DeliveryDates not found", { id });
      throw new Error("DeliveryDates not found");
    }
    return item;
  }

  async create(data: any, userId: number): Promise<DeliveryDates> {
    const item = await this.deliveryDatesRepository.create(data);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "DeliveryDates",
      item.id,
      userId,
      `DeliveryDates created`,
      undefined,
      JSON.stringify(data)
    );

    logger.info("DeliveryDates created", { id: item.id, userId });

    return item;
  }

  async update(id: number, data: any, userId: number): Promise<DeliveryDates> {
    const oldItem = await this.getById(id);
    const updatedItem = await this.deliveryDatesRepository.update(id, data);

    await this.auditRepository.log(
      AuditAction.UPDATED,
      "DeliveryDates",
      id,
      userId,
      `DeliveryDates updated`,
      JSON.stringify(oldItem),
      JSON.stringify(data)
    );

    logger.info("DeliveryDates updated", { id, userId });

    return updatedItem;
  }

  async delete(id: number, userId: number): Promise<void> {
    const item = await this.getById(id);
    await this.deliveryDatesRepository.delete(id);

    await this.auditRepository.log(
      AuditAction.DELETED,
      "DeliveryDates",
      id,
      userId,
      `DeliveryDates deleted`,
      JSON.stringify(item),
      undefined
    );

    logger.info("DeliveryDates deleted", { id, userId });
  }

  async getDeliveryDate(folioRouteId: number): Promise<DeliveryDate | null> {
    return this.deliveryDatesRepository.getDeliveryDate(folioRouteId);
  }

  async createDeliveryDate(folioRouteId: number, dueDate: Date, userId: number, notes?: string,): Promise<DeliveryDate> {
    const item = await this.deliveryDatesRepository.createDeliveryDate(folioRouteId, dueDate, notes);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "DeliveryDates",
      item.id,
      userId,
      `DeliveryDates created`,
      undefined,
      JSON.stringify({ folioRouteId, dueDate, notes })
    );

    logger.info("DeliveryDates created via createDeliveryDate", { id: item.id, userId });

    return item;
  }

  async getDeliveryDateById(dateId: number): Promise<DeliveryDate | null> {
    return this.deliveryDatesRepository.getDeliveryDateById(dateId);
  }

  async updateDeliveryDate(dateId: number, newDueDate: Date, userId: number,notes?: string, ): Promise<void> {
    const oldItem = await this.getById(dateId);
    await this.deliveryDatesRepository.updateDeliveryDate(dateId, newDueDate, notes);

    await this.auditRepository.log(
      AuditAction.UPDATED,
      "DeliveryDates",
      dateId,
      userId,
      `DeliveryDates updated`,
      JSON.stringify(oldItem),
      JSON.stringify({ newDueDate, notes })
    );

    logger.info("DeliveryDates updated via updateDeliveryDate", { id: dateId, userId });
  }
}
