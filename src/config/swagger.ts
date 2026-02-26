import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Production Control System API",
      version: "1.0.0",
      description: "API for managing production chain control with folios, garments, and processes",
      contact: {
        name: "API Support",
        url: "https://example.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string" },
            fullName: { type: "string" },
            role: { type: "integer" },
            section: { type: ["integer", "null"] },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Folio: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folioNumber: { type: "string" },
            projectId: { type: "integer" },
            quantity: { type: "integer" },
            status: { type: "string", enum: ["ACTIVE", "COMPLETED", "CANCELLED"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Garment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folioId: { type: "integer" },
            garmentNumber: { type: "integer" },
            garmentCode: { type: "string" },
            status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        DeliveryDate: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folioId: { type: "integer" },
            dueDate: { type: "string", format: "date" },
            notes: { type: ["string", "null"] },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        FolioProcess: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folioId: { type: "integer" },
            garmentId: { type: "integer" },
            processId: { type: "integer" },
            routeSectionId: { type: "integer" },
            status: { type: "string", enum: ["NOT_STARTED", "IN_PROGRESS", "PAUSED", "COMPLETED"] },
            totalQuantity: { type: "integer" },
            completedQuantity: { type: "integer" },
            startedAt: { type: ["string", "null"], format: "date-time" },
            completedAt: { type: ["string", "null"], format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        ProcessProgress: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folioProcessId: { type: "integer" },
            quantityCompleted: { type: "integer" },
            updatedByUserId: { type: "integer" },
            reason: { type: "string" },
            comments: { type: ["string", "null"] },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
