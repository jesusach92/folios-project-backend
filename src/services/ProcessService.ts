import { ProcessRepository } from "../repositories/ProcessRepository";
import { FolioRepository } from "../repositories/FolioRepository";
import { AuditRepository } from "../repositories/AuditRepository";
import { FolioProcess, ProcessStatus, ProcessType, AuditAction } from "../types";
import logger from "../config/logger";

export class ProcessService {
  private processRepository = new ProcessRepository();
  private folioRepository = new FolioRepository();
  private auditRepository = new AuditRepository();

  async getFolioProcess(id: number): Promise<FolioProcess> {
    const process = await this.processRepository.findById(id);
    if (!process) {
      logger.warn("Process not found", { folioProcessId: id });
      throw new Error("Process not found");
    }
    return process;
  }

  async getProcessesForGarment(garmentId: number): Promise<FolioProcess[]> {
    return this.processRepository.findByGarmentId(garmentId);
  }

  async createFolioProcess(folioId: number, garmentId: number, processId: number, routeSectionId: number, totalQuantity: number): Promise<FolioProcess> {
    const process = await this.processRepository.findProcessById(processId);
    if (!process) {
      logger.warn("Process not found", { processId });
      throw new Error("Process not found");
    }

    return this.processRepository.createInstance(folioId, garmentId, processId, routeSectionId, totalQuantity);
  }

  async startProcess(folioProcessId: number, userId: number): Promise<void> {
    const process = await this.getFolioProcess(folioProcessId);

    if (process.status !== ProcessStatus.NOT_STARTED) {
      logger.warn("Cannot start process - invalid state", { folioProcessId, currentState: process.status, userId });
      throw new Error("Can only start NOT_STARTED processes");
    }

    await this.processRepository.updateStatus(folioProcessId, ProcessStatus.IN_PROGRESS);

    await this.auditRepository.log(
      AuditAction.STATE_CHANGE,
      "FOLIO_PROCESS",
      folioProcessId,
      userId,
      `Process started`,
      ProcessStatus.NOT_STARTED,
      ProcessStatus.IN_PROGRESS
    );

    logger.info("Process started", { folioProcessId, userId });
  }

  async pauseProcess(folioProcessId: number, userId: number): Promise<void> {
    const process = await this.getFolioProcess(folioProcessId);

    if (process.status !== ProcessStatus.IN_PROGRESS) {
      logger.warn("Cannot pause process - invalid state", { folioProcessId, currentState: process.status, userId });
      throw new Error("Can only pause IN_PROGRESS processes");
    }

    await this.processRepository.updateStatus(folioProcessId, ProcessStatus.PAUSED);

    await this.auditRepository.log(
      AuditAction.STATE_CHANGE,
      "FOLIO_PROCESS",
      folioProcessId,
      userId,
      `Process paused`,
      ProcessStatus.IN_PROGRESS,
      ProcessStatus.PAUSED
    );

    logger.info("Process paused", { folioProcessId, userId });
  }

  async updateProgress(
    folioProcessId: number,
    quantityCompleted: number,
    userId: number,
    reason: string,
    comments?: string
  ): Promise<void> {
    const process = await this.getFolioProcess(folioProcessId);
    const processConfig = await this.processRepository.findProcessById(process.process_id);

    if (!processConfig) {
      logger.error("Process not found during progress update", { folioProcessId });
      throw new Error("Process not found");
    }

    if (processConfig.type === ProcessType.UNITARIO && quantityCompleted > 1) {
      logger.warn("Invalid quantity for UNITARIO process", { folioProcessId, quantityCompleted, userId });
      throw new Error("UNITARIO processes cannot have quantity > 1");
    }

    if (processConfig.type === ProcessType.POR_CANTIDAD) {
      if (quantityCompleted > process.total_quantity - process.completed_quantity) {
        logger.warn("Quantity exceeds remaining", {
          folioProcessId,
          quantityCompleted,
          remaining: process.total_quantity - process.completed_quantity,
          userId
        });
        throw new Error("Quantity completed exceeds remaining quantity");
      }
    }

    const newTotal = process.completed_quantity + quantityCompleted;
    await this.processRepository.updateCompletedQuantity(folioProcessId, newTotal);

    await this.processRepository.addProgressUpdate(
      folioProcessId,
      quantityCompleted,
      userId,
      reason,
      comments
    );

    if (newTotal === process.total_quantity) {
      await this.completeProcess(folioProcessId, userId);
    }

    await this.auditRepository.log(
      AuditAction.PROGRESS_UPDATE,
      "FOLIO_PROCESS",
      folioProcessId,
      userId,
      `Progress updated: ${quantityCompleted} units. Reason: ${reason}`,
      String(process.completed_quantity),
      String(newTotal)
    );

    logger.info("Process progress updated", {
      folioProcessId,
      quantityCompleted,
      totalCompleted: newTotal,
      reason,
      userId
    });
  }

  async completeProcess(folioProcessId: number, userId: number): Promise<void> {
    const process = await this.getFolioProcess(folioProcessId);

    if (process.status === ProcessStatus.COMPLETED) {
      return;
    }

    await this.processRepository.updateStatus(folioProcessId, ProcessStatus.COMPLETED);

    await this.auditRepository.log(
      AuditAction.STATE_CHANGE,
      "FOLIO_PROCESS",
      folioProcessId,
      userId,
      `Process completed`,
      process.status,
      ProcessStatus.COMPLETED
    );

    const allProcessesCompleted = await this.processRepository.checkIfAllProcessesCompleted(process.garment_id);
    if (allProcessesCompleted) {
      const garment = await this.folioRepository.findGarmentById(process.garment_id);
      if (garment) {
        await this.folioRepository.updateGarmentStatus(process.garment_id, "COMPLETED");
      }
    }

    logger.info("Process completed", { folioProcessId, garmentId: process.garment_id, userId });
  }

  async getProgressHistory(processInstanceId: number): Promise<any[]> {
    return this.processRepository.getProgressHistory(processInstanceId);
  }

  async getProcessesBySection(sectionId: number): Promise<any[]> {
    return this.processRepository.getProcessesBySection(sectionId);
  }
}
