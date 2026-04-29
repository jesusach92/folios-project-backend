import { Router, Request, Response } from "express";
import { SectionController } from "../controllers/SectionController";
import { authMiddleware } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   - name: Sections
 *     description: Section management endpoints
 */

/**
 * @swagger
 * /api/sections/{id}:
 *   get:
 *     summary: Get Section by ID
 *     tags: [Sections]
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
 *         description: Section details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 section:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Section not found
 */

/**
 * @swagger
 * /api/sections/{id}/users:
 *   get:
 *     summary: Get Section with Users
 *     tags: [Sections]
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
 *         description: Section with associated users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 section:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/sections/{id}/stats:
 *   get:
 *     summary: Get Section Statistics
 *     tags: [Sections]
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
 *         description: Section statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalProcesses:
 *                       type: integer
 *                     completedProcesses:
 *                       type: integer
 *                     progressPercentage:
 *                       type: number
 */

/**
 * @swagger
 * /api/sections:
 *   get:
 *     summary: List All Sections
 *     tags: [Sections]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of sections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sections:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                 count:
 *                   type: integer
 *   post:
 *     summary: Create Section
 *     tags: [Sections]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Section created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 section:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 */

/**
 * @swagger
 * /api/sections/{id}:
 *   put:
 *     summary: Update Section
 *     tags: [Sections]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Section updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 section:
 *                   $ref: '#/components/schemas/Section'
 *       404:
 *         description: Section not found
 *   delete:
 *     summary: Delete Section
 *     tags: [Sections]
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
 *         description: Section deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Section not found
 */

const router = Router();
const sectionController = new SectionController();

router.get("/:id", authMiddleware, (req: Request, res: Response) => sectionController.getSection(req, res));

router.get("/:id/users", authMiddleware, (req: Request, res: Response) => sectionController.getSectionWithUsers(req, res));

router.get("/:id/stats", authMiddleware, (req: Request, res: Response) => sectionController.getSectionStats(req, res));

router.get("/", authMiddleware, (req: Request, res: Response) => sectionController.listSections(req, res));

router.post(
  "/",
  authMiddleware,
  (req: Request, res: Response) => sectionController.createSection(req, res)
);

export default router;
