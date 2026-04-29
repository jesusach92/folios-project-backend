import { Router, Request, Response } from "express";
import { DeliveryDatesController } from "../controllers/DeliveryDatesController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const deliveryDatesController = new DeliveryDatesController();

/**
 * @swagger
 * tags:
 *   - name: DeliveryDates
 *     description: DeliveryDates management endpoints
 */

/**
 * @swagger
 * /api/delivery_dates:
 *   get:
 *     summary: Get all DeliveryDates with filters and pagination
 *     tags: [DeliveryDates]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search term
 *       - name: garmentFolioRouteId
 *         in: query
 *         schema:
 *           type: integer
 *         description: Garment Folio Route ID
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
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
 *         description: Items per page
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of delivery_dates
 */
router.get("/", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.getAll(req, res);
});

/**
 * @swagger
 * /api/delivery_dates/{id}:
 *   get:
 *     summary: Get DeliveryDates by ID
 *     tags: [DeliveryDates]
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
 *         description: DeliveryDates details
 */
router.get("/:id", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.getById(req, res);
});

/**
 * @swagger
 * /api/delivery_dates:
 *   post:
 *     summary: Create new DeliveryDates
 *     tags: [DeliveryDates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: DeliveryDates created
 */
router.post("/", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.create(req, res);
});

/**
 * @swagger
 * /api/delivery_dates/{id}:
 *   put:
 *     summary: Update DeliveryDates
 *     tags: [DeliveryDates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: DeliveryDates updated
 */
router.put("/:id", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.update(req, res);
});

/**
 * @swagger
 * /api/delivery_dates/{id}:
 *   delete:
 *     summary: Delete DeliveryDates
 *     tags: [DeliveryDates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: DeliveryDates deleted
 */
router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.delete(req, res);
});

/**
 * @swagger
 * /api/delivery_dates/delivery_date/{folioRouteId}:
 *   get:
 *     summary: Get delivery date by folio route ID
 *     tags: [DeliveryDates]
 *     parameters:
 *       - name: folioRouteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery date details
 *       404:
 *         description: Delivery date not found
 */
router.get("/delivery_date/:folioRouteId", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.getDeliveryDate(req, res);
});

/**
 * @swagger
 * /api/delivery_dates/delivery_date/{folioRouteId}:
 *   post:
 *     summary: Create delivery date for folio route
 *     tags: [DeliveryDates]
 *     parameters:
 *       - name: folioRouteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Delivery date created
 */
router.post("/delivery_date/:folioRouteId", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.createDeliveryDate(req, res);
});

/**
 * @swagger
 * /api/delivery_dates/delivery_date_by_id/{dateId}:
 *   get:
 *     summary: Get delivery date by ID
 *     tags: [DeliveryDates]
 *     parameters:
 *       - name: dateId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery date details
 *       404:
 *         description: Delivery date not found
 */
router.get("/delivery_date_by_id/:dateId", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.getDeliveryDateById(req, res);
});

/**
 * @swagger
 * /api/delivery_dates/delivery_date/{dateId}:
 *   put:
 *     summary: Update delivery date
 *     tags: [DeliveryDates]
 *     parameters:
 *       - name: dateId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newDueDate:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery date updated
 */
router.put("/delivery_date/:dateId", authMiddleware, (req: Request, res: Response) => {
  deliveryDatesController.updateDeliveryDate(req, res);
});

export default router;
