import { Router, Request, Response } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard data and analytics endpoints
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get Dashboard Data
 *     tags: [Dashboard]
 *     parameters:
 *       - name: role
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [admin, supervisor, worker]
 *         description: User role for role-specific dashboard
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data with KPIs and folios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 kpis:
 *                   type: array
 *                   description: Key performance indicators
 *                 foliosActivos:
 *                   type: array
 *                   description: Active folios
 *                 foliosRetrasados:
 *                   type: array
 *                   description: Delayed folios
 *                 alertasRecientes:
 *                   type: array
 *                   description: Recent alerts
 *                 lastUpdate:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, (req: Request, res: Response) =>
  dashboardController.getDashboard(req, res)
);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get Dashboard Statistics
 *     tags: [Dashboard]
 *     description: Retrieve statistical information about folios, projects, and processes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalFolios:
 *                   type: integer
 *                 completedFolios:
 *                   type: integer
 *                 activeFolios:
 *                   type: integer
 *                 delayedFolios:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", authMiddleware, (req: Request, res: Response) =>
  dashboardController.getStats(req, res)
);

/**
 * @swagger
 * /api/dashboard/distribution:
 *   get:
 *     summary: Get Folio Status Distribution
 *     tags: [Dashboard]
 *     description: Get the distribution of folios by their current status
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Folio distribution by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 active:
 *                   type: integer
 *                 completed:
 *                   type: integer
 *                 cancelled:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/distribution", authMiddleware, (req: Request, res: Response) =>
  dashboardController.getFolioDistribution(req, res)
);

/**
 * @swagger
 * /api/dashboard/projects:
 *   get:
 *     summary: Get Projects Overview
 *     tags: [Dashboard]
 *     description: Get an overview of all projects with their folio counts and status
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Projects overview with folio counts
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
 *                       clientName:
 *                         type: string
 *                       totalFolios:
 *                         type: integer
 *                       completedFolios:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/projects", authMiddleware, (req: Request, res: Response) =>
  dashboardController.getProjectsOverview(req, res)
);

export default router;
