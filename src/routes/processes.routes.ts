import { Router, Request, Response } from "express";
import { ProcessController } from "../controllers/ProcessController";
import { authMiddleware } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   - name: Processes
 *     description: Process management endpoints
 *   - name: Process Progress
 *     description: Process progress tracking endpoints
 */

/**
 * @swagger
 * /api/processes/{id}:
 *   get:
 *     summary: Get Process by ID
 *     tags: [Processes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Process details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 process:
 *                   $ref: '#/components/schemas/FolioProcess'
 *       404:
 *         description: Process not found
 */

/**
 * @swagger
 * /api/processes/garment/{garmentId}:
 *   get:
 *     summary: Get Processes for Garment
 *     tags: [Processes]
 *     parameters:
 *       - name: garmentId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of processes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 processes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FolioProcess'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/processes/{folioProcessId}/start:
 *   post:
 *     summary: Start Process
 *     tags: [Processes]
 *     parameters:
 *       - name: folioProcessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Process started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/processes/{folioProcessId}/pause:
 *   post:
 *     summary: Pause Process
 *     tags: [Processes]
 *     parameters:
 *       - name: folioProcessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Process paused
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/processes/{folioProcessId}/progress:
 *   post:
 *     summary: Update Process Progress
 *     tags: [Process Progress]
 *     parameters:
 *       - name: folioProcessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *               percentage:
 *                 type: number
 *               notes:
 *                 type: string
 *             required:
 *               - status
 *               - percentage
 *     responses:
 *       200:
 *         description: Progress updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   $ref: '#/components/schemas/ProcessProgress'
 */

/**
 * @swagger
 * /api/processes/{folioProcessId}/history:
 *   get:
 *     summary: Get Progress History
 *     tags: [Process Progress]
 *     parameters:
 *       - name: folioProcessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Progress history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProcessProgress'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/processes/section/{sectionId}:
 *   get:
 *     summary: Get Processes by Section
 *     tags: [Processes]
 *     parameters:
 *       - name: sectionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of processes in section
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 processes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FolioProcess'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/processes/{folioProcessId}/complete:
 *   post:
 *     summary: Complete Process
 *     tags: [Processes]
 *     parameters:
 *       - name: folioProcessId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Optional completion notes
 *     responses:
 *       200:
 *         description: Process completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

const router = Router();
const processController = new ProcessController();

router.get("/:id", authMiddleware, (req: Request, res: Response) => processController.getProcess(req, res));

router.get("/garment/:garmentId", authMiddleware, (req: Request, res: Response) =>
  processController.getProcessesForGarment(req, res)
);

router.post(
  "/:folioProcessId/start",
  authMiddleware,
  (req: Request, res: Response) => processController.startProcess(req, res)
);

router.post(
  "/:folioProcessId/pause",
  authMiddleware,
  (req: Request, res: Response) => processController.pauseProcess(req, res)
);

router.post(
  "/:folioProcessId/progress",
  authMiddleware,
  (req: Request, res: Response) => processController.updateProgress(req, res)
);

router.get("/:folioProcessId/history", authMiddleware, (req: Request, res: Response) =>  processController.getProgressHistory(req, res)
);

router.get("/section/:sectionId", authMiddleware, (req: Request, res: Response) =>
  processController.getProcessesBySection(req, res)
);

export default router;