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
 * /api/projects/{id}:
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
 *                     projectNumber:
 *                       type: string
 *                     clientId:
 *                       type: integer
 *                     salesmanId:
 *                       type: integer
 *                     deliveryDate:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/projects/{id}/stats:
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
 *                     totalFolios:
 *                       type: integer
 *                     completedFolios:
 *                       type: integer
 *                     pendingFolios:
 *                       type: integer
 *                     progressPercentage:
 *                       type: number
 */

/**
 * @swagger
 * /api/projects:
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
 *                       projectNumber:
 *                         type: string
 *                       clientId:
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
 *               projectNumber:
 *                 type: string
 *               clientId:
 *                 type: integer
 *               salesmanId:
 *                 type: integer
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *             required:
 *               - projectNumber
 *               - clientId
 *               - deliveryDate
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
 *                     projectNumber:
 *                       type: string
 */

/**
 * @swagger
 * /api/projects/client/{clientId}:
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
 *                       projectNumber:
 *                         type: string
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/projects/salesman/{salesmanId}:
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
 *                       projectNumber:
 *                         type: string
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update Project
 *     tags: [Projects]
 *     parameters:
 *       - name: id
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
 *               projectNumber:
 *                 type: string
 *               clientId:
 *                 type: integer
 *               salesmanId:
 *                 type: integer
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *   delete:
 *     summary: Delete Project
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
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Project not found
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
