import { Router, Request, Response } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { authMiddleware } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: Project management endpoints
 */

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get Project by ID
 *     tags: [Projects]
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
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     project_number:
 *                       type: string
 *                     client_id:
 *                       type: integer
 *                     salesman_id:
 *                       type: integer
 *                     delivery_date:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /projects/{id}/stats:
 *   get:
 *     summary: Get Project Statistics
 *     tags: [Projects]
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
 *         description: Project statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total_folios:
 *                       type: integer
 *                     completed_folios:
 *                       type: integer
 *                     pending_folios:
 *                       type: integer
 *                     progress_percentage:
 *                       type: number
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List All Projects
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       project_number:
 *                         type: string
 *                       client_id:
 *                         type: integer
 *                 count:
 *                   type: integer
 *   post:
 *     summary: Create Project
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_number:
 *                 type: string
 *               client_id:
 *                 type: integer
 *               salesman_id:
 *                 type: integer
 *               delivery_date:
 *                 type: string
 *                 format: date
 *             required:
 *               - project_number
 *               - client_id
 *               - delivery_date
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     project_number:
 *                       type: string
 */

/**
 * @swagger
 * /projects/client/{clientId}:
 *   get:
 *     summary: Get Projects by Client
 *     tags: [Projects]
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       project_number:
 *                         type: string
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /projects/salesman/{salesmanId}:
 *   get:
 *     summary: Get Projects by Salesman
 *     tags: [Projects]
 *     parameters:
 *       - name: salesmanId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       project_number:
 *                         type: string
 *                 count:
 *                   type: integer
 */

const router = Router();
const projectController = new ProjectController();

router.get("/:id", authMiddleware, (req: Request, res: Response) => projectController.getProject(req, res));

router.get("/:id/stats", authMiddleware, (req: Request, res: Response) => projectController.getProjectStats(req, res));

router.get("/", authMiddleware, (req: Request, res: Response) => projectController.listProjects(req, res));

router.get("/client/:clientId", authMiddleware, (req: Request, res: Response) => projectController.getProjectsByClient(req, res));

router.get("/salesman/:salesmanId", authMiddleware, (req: Request, res: Response) => projectController.getProjectsBySalesman(req, res));

router.post(
  "/",
  authMiddleware,
  (req: Request, res: Response) => projectController.createProject(req, res)
);

export default router;
