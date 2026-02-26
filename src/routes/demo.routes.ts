import { Router } from "express";
import DemoController from "../controllers/DemoController";

const router = Router();

/**
 * @swagger
 * /api/admin/demo/reset:
 *   post:
 *     summary: Reset database with test data
 *     description: Clears all data and populates with demo accounts and sample data
 *     tags: [Demo]
 *     responses:
 *       200:
 *         description: Demo data successfully reset
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
 *     description: Returns available test accounts and their credentials
 *     tags: [Demo]
 *     responses:
 *       200:
 *         description: List of demo accounts
 */
router.get("/accounts", (req, res) => DemoController.getDemoAccounts(req, res));

/**
 * @swagger
 * /api/admin/demo/stats:
 *   get:
 *     summary: Get database statistics
 *     description: Returns count of records in each table
 *     tags: [Demo]
 *     responses:
 *       200:
 *         description: Database statistics
 */
router.get("/stats", (req, res) => DemoController.getDemoStats(req, res));

export default router;
