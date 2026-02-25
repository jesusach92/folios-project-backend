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
            full_name: { type: "string" },
            role_id: { type: "integer" },
            section_id: { type: ["integer", "null"] },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        Folio: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folio_number: { type: "string" },
            project_id: { type: "integer" },
            quantity: { type: "integer" },
            status: { type: "string", enum: ["ACTIVE", "COMPLETED", "CANCELLED"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        Garment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folio_id: { type: "integer" },
            garment_number: { type: "integer" },
            garment_code: { type: "string" },
            status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        DeliveryDate: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folio_id: { type: "integer" },
            due_date: { type: "string", format: "date" },
            notes: { type: ["string", "null"] },
            is_active: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        FolioProcess: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folio_id: { type: "integer" },
            garment_id: { type: "integer" },
            process_id: { type: "integer" },
            route_section_id: { type: "integer" },
            status: { type: "string", enum: ["NOT_STARTED", "IN_PROGRESS", "PAUSED", "COMPLETED"] },
            total_quantity: { type: "integer" },
            completed_quantity: { type: "integer" },
            started_at: { type: ["string", "null"], format: "date-time" },
            completed_at: { type: ["string", "null"], format: "date-time" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
          }
        },
        ProcessProgress: {
          type: "object",
          properties: {
            id: { type: "integer" },
            folio_process_id: { type: "integer" },
            status: { type: "string", enum: ["pending", "in_progress", "completed"] },
            percentage: { type: "number" },
            notes: { type: ["string", "null"] },
            updated_by: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" }
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
