import { Router, Request, Response } from "express";
import { FolioController } from "../controllers/FolioController";
import { authMiddleware } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   - name: Folios
 *     description: Folio management endpoints
 *   - name: Garments
 *     description: Garment management endpoints
 *   - name: Delivery Dates
 *     description: Delivery date management endpoints
 */

/**
 * @swagger
 * /folios:
 *   get:
 *     summary: Get all Folios with filters and pagination
 *     tags: [Folios]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by folio number (partial match)
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ACTIVE, COMPLETED, CANCELLED]
 *         description: Filter by status
 *       - name: projectId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter by project ID
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [created_at, folio_number]
 *           default: created_at
 *         description: Sort by field
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of folios with pagination and filter info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 folios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Folio'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 */

/**
 * @swagger
 * /folios/{id}:
 *   get:
 *     summary: Get Folio by ID
 *     tags: [Folios]
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
 *         description: Folio details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 folio:
 *                   $ref: '#/components/schemas/Folio'
 *       404:
 *         description: Folio not found
 */

/**
 * @swagger
 * /folios/project/{projectId}:
 *   get:
 *     summary: Get Folios by Project
 *     tags: [Folios]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of folios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 folios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Folio'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /folios:
 *   post:
 *     summary: Create Folio
 *     tags: [Folios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: integer
 *               folio_number:
 *                 type: string
 *               quantity:
 *                 type: integer
 *             required:
 *               - project_id
 *               - folio_number
 *               - quantity
 *     responses:
 *       201:
 *         description: Folio created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 folio:
 *                   $ref: '#/components/schemas/Folio'
 */

/**
 * @swagger
 * /folios/{dateId}/delivery-date:
 *   put:
 *     summary: Update Delivery Date
 *     tags: [Delivery Dates]
 *     parameters:
 *       - name: dateId
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
 *               newDueDate:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *             required:
 *               - newDueDate
 *               - reason
 *     responses:
 *       200:
 *         description: Delivery date updated
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
 * /folios/{folioId}/garments:
 *   post:
 *     summary: Create Garment
 *     tags: [Garments]
 *     parameters:
 *       - name: folioId
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
 *               garment_number:
 *                 type: integer
 *               garment_code:
 *                 type: string
 *             required:
 *               - garment_number
 *               - garment_code
 *     responses:
 *       201:
 *         description: Garment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 garment:
 *                   $ref: '#/components/schemas/Garment'
 *   get:
 *     summary: Get Garments by Folio
 *     tags: [Garments]
 *     parameters:
 *       - name: folioId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of garments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 garments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Garment'
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /folios/{folioId}/close:
 *   post:
 *     summary: Close Folio
 *     tags: [Folios]
 *     parameters:
 *       - name: folioId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Folio closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

const router = Router();
const folioController = new FolioController();

// GET /folios - Get all folios with filters and pagination (MUST be before /:id to avoid conflict)
router.get("/", authMiddleware, (req: Request, res: Response) => folioController.getFolios(req, res));

router.get("/:id", authMiddleware, (req: Request, res: Response) => folioController.getFolio(req, res));

router.get("/project/:projectId", authMiddleware, (req: Request, res: Response) =>
  folioController.getFoliosByProject(req, res)
);

router.post(
  "/",
  authMiddleware,
  (req: Request, res: Response) => folioController.createFolio(req, res)
);

router.put(
  "/:dateId/delivery-date",
  authMiddleware,
  (req: Request, res: Response) => folioController.updateDeliveryDate(req, res)
);

router.post(
  "/:folioId/garments",
  authMiddleware,
  (req: Request, res: Response) => folioController.createGarment(req, res)
);

router.get("/:folioId/garments", authMiddleware, (req: Request, res: Response) =>
  folioController.getGarmentsByFolio(req, res)
);

router.post(
  "/:folioId/close",
  authMiddleware,  (req: Request, res: Response) => folioController.closeFolio(req, res)
);

export default router;