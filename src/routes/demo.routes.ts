import { Router } from "express";
import DemoController from "../controllers/DemoController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Demo
 *     description: Demo data and testing endpoints (development only)
 */

/**
 * @swagger
 * /api/admin/demo/reset:
 *   post:
 *     summary: Reset database with test data
 *     description: Clears all data and populates with demo accounts and sample data. Only available in development environment.
 *     tags: [Demo]
 *     responses:
 *       200:
 *         description: Demo data successfully reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database reset with demo data
 *       403:
 *         description: Not available in production
 *       500:
 *         description: Failed to reset demo data
 */
router.post("/reset", (req, res) => DemoController.resetDemoData(req, res));

/**
 * @swagger
 * /api/admin/demo/accounts:
 *   get:
 *     summary: Get demo accounts information
 *     description: Returns available test accounts and their credentials for testing purposes
 *     tags: [Demo]
 *     responses:
 *       200:
 *         description: List of demo accounts with credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accounts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                       password:
 *                         type: string
 *                       role:
 *                         type: string
 */
router.get("/accounts", (req, res) => DemoController.getDemoAccounts(req, res));

/**
 * @swagger
 * /api/admin/demo/stats:
 *   get:
 *     summary: Get database statistics
 *     description: Returns count of records in each table and database size information
 *     tags: [Demo]
 *     responses:
 *       200:
 *         description: Database statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tables:
 *                   type: object
 *                   example:
 *                     users: 0
 *                     folios: 0
 *                     projects: 0
 *                     sections: 0
 */
router.get("/stats", (req, res) => DemoController.getDemoStats(req, res));

export default router;
