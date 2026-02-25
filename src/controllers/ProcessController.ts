import { Request, Response } from "express";
import { ProcessService } from "../services/ProcessService";

export class ProcessController {
  private processService = new ProcessService();

  async getProcess(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const process = await this.processService.getFolioProcess(parseInt(id));
      res.status(200).json({ process });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getProcessesForGarment(req: Request, res: Response): Promise<void> {
    try {
      const { garmentId } = req.params;
      const processes = await this.processService.getProcessesForGarment(parseInt(garmentId));
      res.status(200).json({ processes, count: processes.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async startProcess(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { processInstanceId } = req.params;
      await this.processService.startProcess(parseInt(processInstanceId), req.user.id);
      res.status(200).json({ message: "Process started successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async pauseProcess(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { processInstanceId } = req.params;
      await this.processService.pauseProcess(parseInt(processInstanceId), req.user.id);
      res.status(200).json({ message: "Process paused successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProgress(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { processInstanceId } = req.params;
      const { quantityCompleted, reason, comments } = req.body;

      if (!quantityCompleted || !reason) {
        res.status(400).json({ error: "quantityCompleted and reason are required" });
        return;
      }

      await this.processService.updateProgress(
        parseInt(processInstanceId),
        quantityCompleted,
        req.user.id,
        reason,
        comments
      );

      res.status(200).json({ message: "Progress updated successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProgressHistory(req: Request, res: Response): Promise<void> {
    try {
      const { processInstanceId } = req.params;
      const history = await this.processService.getProgressHistory(parseInt(processInstanceId));
      res.status(200).json({ history, count: history.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProcessesBySection(req: Request, res: Response): Promise<void> {
    try {
      const { sectionId } = req.params;
      const processes = await this.processService.getProcessesBySection(parseInt(sectionId));
      res.status(200).json({ processes, count: processes.length });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
