import { Router, Request, Response } from "express";
import { GarmentController } from "../controllers/GarmentController";
import { authMiddleware } from "../middlewares/auth";

/**
 * @swagger
 * tags:
 *   - name: Garments
 *     description: Independent garment management endpoints
 */

/**
 * @swagger
 * /api/garments:
 *   get:
 *     summary: Get all Garments with filters and pagination
 *     tags: [Garments]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by garment code (partial match)
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [garment_code]
 *           default: garment_code
 *         description: Sort by field
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
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
 *         description: List of garments with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 garments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Garment'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *   post:
 *     summary: Create a new Garment
 *     description: Creates a new independent garment. The garment code must be unique.
 *     tags: [Garments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               garmentDescription:
 *                 type: string
 *                 description: Description of the garment
 *               garmentCode:
 *                 type: string
 *                 description: Unique code for the garment
 *             required:
 *               - garmentDescription
 *               - garmentCode
 *     responses:
 *       201:
 *         description: Garment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 garment:
 *                   $ref: '#/components/schemas/Garment'
 *       400:
 *         description: Bad request - duplicate code or missing fields
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/garments/{id}:
 *   get:
 *     summary: Get Garment by ID
 *     tags: [Garments]
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
 *         description: Garment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 garment:
 *                   $ref: '#/components/schemas/Garment'
 *       404:
 *         description: Garment not found
 *   delete:
 *     summary: Delete Garment
 *     description: Deletes a garment only if it's not associated with any folio
 *     tags: [Garments]
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
 *         description: Garment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - garment has associations
 *       404:
 *         description: Garment not found
 */

/**
 * @swagger
 * /api/garments/{id}/folios:
 *   get:
 *     summary: Get Folio Associations for Garment
 *     description: Returns all folios that this garment is associated with
 *     tags: [Garments]
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
 *         description: List of associated folios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 associations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       folio_number:
 *                         type: string
 *                       project_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       associated_at:
 *                         type: string
 *                         format: date-time
 *                 count:
 *                   type: integer
 *       404:
 *         description: Garment not found
 */

/**
 * @swagger
 * /api/garments/{id}/associate/{folioId}:
 *   post:
 *     summary: Associate Garment to Folio
 *     description: Associates an independent garment to a specific folio
 *     tags: [Garments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Garment ID
 *       - name: folioId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Folio ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Garment associated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Garment or folio not found
 */

/**
 * @swagger
 * /api/garments/{id}/disassociate/{folioId}:
 *   delete:
 *     summary: Disassociate Garment from Folio
 *     description: Removes the association between a garment and a specific folio
 *     tags: [Garments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Garment ID
 *       - name: folioId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Folio ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Garment disassociated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Garment or folio not found
 */

const router = Router();
const garmentController = new GarmentController();

// GET /garments - Get all garments with filters and pagination
router.get("/", authMiddleware, (req: Request, res: Response) => garmentController.getGarments(req, res));

// POST /garments - Create new garment
router.post("/", authMiddleware, (req: Request, res: Response) => garmentController.createGarment(req, res));

// GET /garments/:id - Get garment by ID
router.get("/:id", authMiddleware, (req: Request, res: Response) => garmentController.getGarment(req, res));

// DELETE /garments/:id - Delete garment
router.delete("/:id", authMiddleware, (req: Request, res: Response) => garmentController.deleteGarment(req, res));

// GET /garments/:id/folios - Get folio associations
router.get("/:id/folios", authMiddleware, (req: Request, res: Response) =>
  garmentController.getFolioAssociations(req, res)
);

// POST /garments/:id/associate/:folioId - Associate to folio
router.post("/:id/associate/:folioId", authMiddleware, (req: Request, res: Response) =>
  garmentController.associateToFolio(req, res)
);

// DELETE /garments/:id/disassociate/:folioId - Disassociate from folio
router.delete("/:id/disassociate/:folioId", authMiddleware, (req: Request, res: Response) =>
  garmentController.disassociateFromFolio(req, res)
);

export default router;
