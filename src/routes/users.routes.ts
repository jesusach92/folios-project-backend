import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get Current User Profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/list:
 *   get:
 *     summary: List All Users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /users/role/{role}:
 *   get:
 *     summary: Get Users by Role
 *     tags: [Users]
 *     parameters:
 *       - name: role
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [admin, supervisor, operator, viewer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users with specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /users/assign-section:
 *   post:
 *     summary: Assign User to Section
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               section_id:
 *                 type: integer
 *             required:
 *               - user_id
 *               - section_id
 *     responses:
 *       200:
 *         description: User assigned to section
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User or section not found
 */

const router = Router();
const userController = new UserController();

router.get("/me", authMiddleware, (req: Request, res: Response) => userController.getProfile(req, res));

router.get(
  "/list",
  authMiddleware,
  (req: Request, res: Response) => userController.listUsers(req, res)
);

router.get(
  "/role/:role",
  authMiddleware,
  (req: Request, res: Response) => userController.getUsersByRole(req, res)
);

router.post(
  "/assign-section",
  authMiddleware,
  (req: Request, res: Response) => userController.assignToSection(req, res)
);

export default router;
