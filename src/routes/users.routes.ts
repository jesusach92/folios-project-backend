import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";
import { UserRole } from "../types";

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
 *   put:
 *     summary: Update Current User Profile
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
 *               full_name:
 *                 type: string
 *                 example: John Updated Doe
 *             required:
 *               - full_name
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *                     section_id:
 *                       type: integer
 *                       nullable: true
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized

/**
 * @swagger
 * /users/me/password:
 *   put:
 *     summary: Change Password (Authenticated User Only)
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
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: CurrentPassword123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword456!
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input or current password incorrect
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
 * /users:
 *   post:
 *     summary: Create New User (Admin Only)
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
 *               email:
 *                 type: string
 *                 format: email
 *                 example: operator@company.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *               full_name:
 *                 type: string
 *                 example: John Operator
 *               role_id:
 *                 type: integer
 *                 description: UserRole enum value (1=ADMIN, 2=PLANNING, 3=SECTION_CHIEF, 4=OPERATOR, 5=SALESMAN, 6=MANAGER)
 *                 example: 4
 *               section_id:
 *                 type: integer
 *                 description: Optional section ID (required for SECTION_CHIEF and OPERATOR roles)
 *                 nullable: true
 *                 example: 1
 *             required:
 *               - email
 *               - password
 *               - full_name
 *               - role_id
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *                     section_id:
 *                       type: integer
 *                       nullable: true
 *                     is_active:
 *                       type: boolean
 *       400:
 *         description: Validation error (invalid email, role, section, or email already exists)
 *       401:
 *         description: Unauthorized - authentication token required
 *       403:
 *         description: Forbidden - only Admin role can create users
 */

/**
 * @swagger
 * /users/{id}/admin-update:
 *   put:
 *     summary: Admin Update User (Role and Password)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_id:
 *                 type: integer
 *                 description: New role (1=ADMIN, 2=PLANNING, 3=SECTION_CHIEF, 4=OPERATOR, 5=SALESMAN, 6=MANAGER)
 *                 example: 3
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password (optional)
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *                     section_id:
 *                       type: integer
 *                       nullable: true
 *       400:
 *         description: Invalid input or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only Admin can perform this action
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{id}/assign-section:
 *   put:
 *     summary: Assign Section to User (ADMIN ONLY)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to assign section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               section_id:
 *                 type: integer
 *                 description: Section ID to assign
 *                 example: 1
 *             required:
 *               - section_id
 *     responses:
 *       200:
 *         description: Section assigned to user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     role_id:
 *                       type: integer
 *                     section_id:
 *                       type: integer
 *                     is_active:
 *                       type: boolean
 *       400:
 *         description: Validation error (missing section_id or invalid section)
 *       401:
 *         description: Unauthorized - authentication token required
 *       403:
 *         description: Forbidden - only Admin role can assign sections
 *       404:
 *         description: User or section not found
 *       409:
 *         description: Conflict - user already has a section assigned
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

// Get current user profile
router.get("/me", authMiddleware, (req: Request, res: Response) => userController.getProfile(req, res));

// Update current user profile (name only)
router.put("/me", authMiddleware, (req: Request, res: Response) => userController.updateProfile(req, res));

// Change current user password
router.put("/me/password", authMiddleware, (req: Request, res: Response) => userController.changePassword(req, res));

// ADMIN ONLY: List all users
router.get(
  "/list",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  (req: Request, res: Response) => userController.listUsers(req, res)
);

// ADMIN ONLY: Get users by role
router.get(
  "/role/:role",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  (req: Request, res: Response) => userController.getUsersByRole(req, res)
);

// ADMIN ONLY: Admin update user (role and password)
router.put(
  "/:id/admin-update",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  (req: Request, res: Response) => userController.adminUpdateUser(req, res)
);

// ADMIN ONLY: Assign section to user (cannot reassign)
router.put(
  "/:id/assign-section",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  (req: Request, res: Response) => userController.assignSectionToUser(req, res)
);

// ADMIN ONLY: Create new user
router.post(
  "/",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  (req: Request, res: Response) => userController.createUser(req, res)
);

// ADMIN ONLY: Assign user to section
router.post(
  "/assign-section",
  authMiddleware,
  roleMiddleware(UserRole.ADMIN),
  (req: Request, res: Response) => userController.assignToSection(req, res)
);

export default router;
