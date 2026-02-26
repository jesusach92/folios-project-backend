import { Router, Request, Response } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const dashboardController = new DashboardController();

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
 *                 foliosActivos:
 *                   type: array
 *                 foliosRetrasados:
 *                   type: array
 *                 alertasRecientes:
 *                   type: array
 *                 lastUpdate:
 *                   type: string
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
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
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
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Folio distribution by status
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
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Projects overview with folio counts
 */
router.get("/projects", authMiddleware, (req: Request, res: Response) =>
  dashboardController.getProjectsOverview(req, res)
);

export default router;
