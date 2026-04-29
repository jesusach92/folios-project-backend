#!/bin/bash

# Service Generator Script
# Usage: ./create-service.sh <ServiceName>
# Example: ./create-service.sh Delivery
# This will create: DeliveryService, DeliveryRepository, DeliveryController, delivery.routes.ts, etc.

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if service name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Service name is required${NC}"
    echo "Usage: ./create-service.sh <ServiceName>"
    echo "Example: ./create-service.sh Delivery"
    exit 1
fi

# Input validation - ensure PascalCase
SERVICE_NAME="$1"
if [[ ! "$SERVICE_NAME" =~ ^[A-Z][a-zA-Z0-9]*$ ]]; then
    echo -e "${RED}Error: Service name must be in PascalCase (e.g., Delivery, DeliveryDate)${NC}"
    exit 1
fi

# Convert to different naming conventions
SERVICE_NAME_CAMEL=$(echo "$SERVICE_NAME" | sed 's/^./\L&/')  # PascalCase to camelCase
SERVICE_NAME_SNAKE=$(echo "$SERVICE_NAME" | sed -E 's/([a-z])([A-Z])/\1_\L\2/g' | tr '[:upper:]' '[:lower:]')  # PascalCase to snake_case
SERVICE_NAME_PLURAL=$(echo "$SERVICE_NAME_SNAKE"s)  # Add 's' for plural

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the backend directory.${NC}"
    exit 1
fi

# Create directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p src/services
mkdir -p src/repositories
mkdir -p src/routes
mkdir -p src/controllers

# Create Service file
echo -e "${YELLOW}Creating ${SERVICE_NAME}Service.ts...${NC}"
cat > "src/services/${SERVICE_NAME}Service.ts" << EOF
import { ${SERVICE_NAME}Repository } from "../repositories/${SERVICE_NAME}Repository";
import { AuditRepository } from "../repositories/AuditRepository";
import { ${SERVICE_NAME}, AuditAction } from "../types";
import logger from "../config/logger";

export class ${SERVICE_NAME}Service {
  private ${SERVICE_NAME_CAMEL}Repository = new ${SERVICE_NAME}Repository();
  private auditRepository = new AuditRepository();

  async getAll(filters: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  } = {}): Promise<{ ${SERVICE_NAME_PLURAL}: ${SERVICE_NAME}[]; total: number; page: number; pageSize: number }> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const offset = (page - 1) * pageSize;

    const result = await this.${SERVICE_NAME_CAMEL}Repository.findAll({
      search: filters.search,
      sortBy: filters.sortBy || 'created_at',
      sortOrder: filters.sortOrder || 'desc',
      limit: pageSize,
      offset
    });

    logger.info("${SERVICE_NAME}s retrieved", {
      totalCount: result.total,
      returnedCount: result.${SERVICE_NAME_PLURAL}.length,
      page,
      pageSize,
      filters
    });

    return {
      ${SERVICE_NAME_PLURAL}: result.${SERVICE_NAME_PLURAL},
      total: result.total,
      page,
      pageSize
    };
  }

  async getById(id: number): Promise<${SERVICE_NAME}> {
    const item = await this.${SERVICE_NAME_CAMEL}Repository.findById(id);
    if (!item) {
      logger.warn("${SERVICE_NAME} not found", { id });
      throw new Error("${SERVICE_NAME} not found");
    }
    return item;
  }

  async create(data: any, userId: number): Promise<${SERVICE_NAME}> {
    const item = await this.${SERVICE_NAME_CAMEL}Repository.create(data);

    await this.auditRepository.log(
      AuditAction.CREATED,
      "${SERVICE_NAME}",
      item.id,
      userId,
      \`${SERVICE_NAME} created\`,
      undefined,
      JSON.stringify(data)
    );

    logger.info("${SERVICE_NAME} created", { id: item.id, userId });

    return item;
  }

  async update(id: number, data: any, userId: number): Promise<${SERVICE_NAME}> {
    const oldItem = await this.getById(id);
    const updatedItem = await this.${SERVICE_NAME_CAMEL}Repository.update(id, data);

    await this.auditRepository.log(
      AuditAction.UPDATED,
      "${SERVICE_NAME}",
      id,
      userId,
      \`${SERVICE_NAME} updated\`,
      JSON.stringify(oldItem),
      JSON.stringify(data)
    );

    logger.info("${SERVICE_NAME} updated", { id, userId });

    return updatedItem;
  }

  async delete(id: number, userId: number): Promise<void> {
    const item = await this.getById(id);
    await this.${SERVICE_NAME_CAMEL}Repository.delete(id);

    await this.auditRepository.log(
      AuditAction.DELETED,
      "${SERVICE_NAME}",
      id,
      userId,
      \`${SERVICE_NAME} deleted\`,
      JSON.stringify(item),
      undefined
    );

    logger.info("${SERVICE_NAME} deleted", { id, userId });
  }
}
EOF

# Create Repository file
echo -e "${YELLOW}Creating ${SERVICE_NAME}Repository.ts...${NC}"
cat > "src/repositories/${SERVICE_NAME}Repository.ts" << EOF
import { getPool } from "../config/database";
import { ${SERVICE_NAME} } from "../types";

interface ${SERVICE_NAME}FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export class ${SERVICE_NAME}Repository {
  async findAll(filters: ${SERVICE_NAME}FilterOptions = {}): Promise<{ ${SERVICE_NAME_PLURAL}: ${SERVICE_NAME}[]; total: number }> {
    const pool = getPool();
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = (filters.sortOrder || 'desc').toUpperCase();

    let whereConditions: string[] = [];
    const params: any[] = [];

    // TODO: Add custom filter logic here based on your schema
    if (filters.search) {
      whereConditions.push("name LIKE ?");
      params.push(\`%\${filters.search}%\`);
    }

    const whereClause = whereConditions.length > 0 ? \`WHERE \${whereConditions.join(" AND ")}\` : "";

    // Get total count
    const countQuery = \`SELECT COUNT(*) as total FROM ${SERVICE_NAME_PLURAL} \${whereClause}\`;
    const [countResult] = await pool.query<any[]>(countQuery, params);
    const total = countResult[0].total;

    // Get ${SERVICE_NAME_PLURAL} with pagination
    const query = \`SELECT * FROM ${SERVICE_NAME_PLURAL} \${whereClause} ORDER BY \${sortBy} \${sortOrder} LIMIT ? OFFSET ?\`;
    const [${SERVICE_NAME_PLURAL}] = await pool.query<any[]>(query, [...params, limit, offset]);

    return { ${SERVICE_NAME_PLURAL}, total };
  }

  async findById(id: number): Promise<${SERVICE_NAME} | null> {
    const pool = getPool();
    const query = \`SELECT * FROM ${SERVICE_NAME_PLURAL} WHERE id = ?\`;
    const [result] = await pool.query<any[]>(query, [id]);
    
    return result.length > 0 ? result[0] : null;
  }

  async create(data: any): Promise<${SERVICE_NAME}> {
    const pool = getPool();
    // TODO: Customize the columns and values based on your ${SERVICE_NAME} schema
    const query = \`INSERT INTO ${SERVICE_NAME_PLURAL} (name, created_at, updated_at) VALUES (?, NOW(), NOW())\`;
    const [result] = await pool.query<any>(query, [data.name]);
    
    return this.findById(result.insertId) as Promise<${SERVICE_NAME}>;
  }

  async update(id: number, data: any): Promise<${SERVICE_NAME}> {
    const pool = getPool();
    // TODO: Customize the columns being updated based on your schema
    const query = \`UPDATE ${SERVICE_NAME_PLURAL} SET name = ?, updated_at = NOW() WHERE id = ?\`;
    await pool.query(query, [data.name, id]);
    
    return this.findById(id) as Promise<${SERVICE_NAME}>;
  }

  async delete(id: number): Promise<void> {
    const pool = getPool();
    const query = \`DELETE FROM ${SERVICE_NAME_PLURAL} WHERE id = ?\`;
    await pool.query(query, [id]);
  }
}
EOF

# Create Controller file
echo -e "${YELLOW}Creating ${SERVICE_NAME}Controller.ts...${NC}"
cat > "src/controllers/${SERVICE_NAME}Controller.ts" << EOF
import { Request, Response } from "express";
import { ${SERVICE_NAME}Service } from "../services/${SERVICE_NAME}Service";

export class ${SERVICE_NAME}Controller {
  private ${SERVICE_NAME_CAMEL}Service = new ${SERVICE_NAME}Service();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 50;

      const result = await this.${SERVICE_NAME_CAMEL}Service.getAll({
        search,
        sortBy,
        sortOrder,
        page,
        pageSize
      });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await this.${SERVICE_NAME_CAMEL}Service.getById(parseInt(id));
      res.status(200).json({ ${SERVICE_NAME_CAMEL}: item });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 1;
      const item = await this.${SERVICE_NAME_CAMEL}Service.create(req.body, userId);
      res.status(201).json({ ${SERVICE_NAME_CAMEL}: item });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 1;
      const item = await this.${SERVICE_NAME_CAMEL}Service.update(parseInt(id), req.body, userId);
      res.status(200).json({ ${SERVICE_NAME_CAMEL}: item });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 1;
      await this.${SERVICE_NAME_CAMEL}Service.delete(parseInt(id), userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
EOF

# Create Routes file
echo -e "${YELLOW}Creating ${SERVICE_NAME_SNAKE}.routes.ts...${NC}"
cat > "src/routes/${SERVICE_NAME_SNAKE}.routes.ts" << EOF
import { Router, Request, Response } from "express";
import { ${SERVICE_NAME}Controller } from "../controllers/${SERVICE_NAME}Controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const ${SERVICE_NAME_CAMEL}Controller = new ${SERVICE_NAME}Controller();

/**
 * @swagger
 * tags:
 *   - name: ${SERVICE_NAME}s
 *     description: ${SERVICE_NAME} management endpoints
 */

/**
 * @swagger
 * /api/${SERVICE_NAME_PLURAL}:
 *   get:
 *     summary: Get all ${SERVICE_NAME}s with filters and pagination
 *     tags: [${SERVICE_NAME}s]
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search term
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
 *         description: List of ${SERVICE_NAME_PLURAL}
 */
router.get("/", authMiddleware, (req: Request, res: Response) => {
  ${SERVICE_NAME_CAMEL}Controller.getAll(req, res);
});

/**
 * @swagger
 * /api/${SERVICE_NAME_PLURAL}/{id}:
 *   get:
 *     summary: Get ${SERVICE_NAME} by ID
 *     tags: [${SERVICE_NAME}s]
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
 *         description: ${SERVICE_NAME} details
 */
router.get("/:id", authMiddleware, (req: Request, res: Response) => {
  ${SERVICE_NAME_CAMEL}Controller.getById(req, res);
});

/**
 * @swagger
 * /api/${SERVICE_NAME_PLURAL}:
 *   post:
 *     summary: Create new ${SERVICE_NAME}
 *     tags: [${SERVICE_NAME}s]
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
 *         description: ${SERVICE_NAME} created
 */
router.post("/", authMiddleware, (req: Request, res: Response) => {
  ${SERVICE_NAME_CAMEL}Controller.create(req, res);
});

/**
 * @swagger
 * /api/${SERVICE_NAME_PLURAL}/{id}:
 *   put:
 *     summary: Update ${SERVICE_NAME}
 *     tags: [${SERVICE_NAME}s]
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
 *         description: ${SERVICE_NAME} updated
 */
router.put("/:id", authMiddleware, (req: Request, res: Response) => {
  ${SERVICE_NAME_CAMEL}Controller.update(req, res);
});

/**
 * @swagger
 * /api/${SERVICE_NAME_PLURAL}/{id}:
 *   delete:
 *     summary: Delete ${SERVICE_NAME}
 *     tags: [${SERVICE_NAME}s]
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
 *         description: ${SERVICE_NAME} deleted
 */
router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  ${SERVICE_NAME_CAMEL}Controller.delete(req, res);
});

export default router;
EOF

# Create Types file
echo -e "${YELLOW}Creating types/index.ts (appending ${SERVICE_NAME} type)...${NC}"
cat >> "src/types/index.ts" << EOF

// ${SERVICE_NAME} Types
export interface ${SERVICE_NAME} {
  id: number;
  name?: string;
  created_at: Date;
  updated_at: Date;
}
EOF

# Success message
echo -e "${GREEN}✓ Service structure created successfully!${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Generated files:${NC}"
echo "  • src/services/${SERVICE_NAME}Service.ts"
echo "  • src/repositories/${SERVICE_NAME}Repository.ts"
echo "  • src/controllers/${SERVICE_NAME}Controller.ts"
echo "  • src/routes/${SERVICE_NAME_SNAKE}.routes.ts"
echo ""
echo -e "${YELLOW}Updated files:${NC}"
echo "  • src/types/index.ts (appended ${SERVICE_NAME} interface)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "${BLUE}1.${NC} Update the database schema (SQL migration):"
echo -e "   CREATE TABLE ${SERVICE_NAME_PLURAL} ("
echo "     id INT PRIMARY KEY AUTO_INCREMENT,"
echo "     name VARCHAR(255) NOT NULL,"
echo "     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"
echo "     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
echo "   );"
echo ""
echo -e "${BLUE}2.${NC} Update src/repositories/${SERVICE_NAME}Repository.ts:"
echo "   • Customize SQL queries based on your schema"
echo "   • Add specific filter logic"
echo "   • Update column mappings"
echo ""
echo -e "${BLUE}3.${NC} Update src/types/index.ts:"
echo "   • Customize the ${SERVICE_NAME} interface properties"
echo ""
echo -e "${BLUE}4.${NC} Register routes in src/app.ts:"
echo "   import ${SERVICE_NAME_CAMEL}Routes from './routes/${SERVICE_NAME_SNAKE}.routes';"
echo "   app.use('/api/${SERVICE_NAME_PLURAL}', ${SERVICE_NAME_CAMEL}Routes);"
echo ""
echo -e "${BLUE}5.${NC} Create database migration file (optional)"
echo ""
echo -e "${BLUE}6.${NC} Build and test:"
echo "   npm run build"
echo "   npm start"
echo ""
echo -e "${GREEN}API will be available at:${NC}"
echo "  GET    /api/${SERVICE_NAME_PLURAL}"
echo "  GET    /api/${SERVICE_NAME_PLURAL}/:id"
echo "  POST   /api/${SERVICE_NAME_PLURAL}"
echo "  PUT    /api/${SERVICE_NAME_PLURAL}/:id"
echo "  DELETE /api/${SERVICE_NAME_PLURAL}/:id"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
