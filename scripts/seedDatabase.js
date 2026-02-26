"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seedDatabase(connection) {
    console.log("🧹 Clearing existing data...");
    // Disable foreign key checks temporarily
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
    const tables = [
        "audit_log",
        "delivery_date_history",
        "delivery_dates",
        "process_progress",
        "folio_processes",
        "folio_routes",
        "route_sections",
        "routes",
        "garments",
        "folios",
        "processes",
        "projects",
        "users",
        "clients",
        "sections",
        "roles"
    ];
    for (const table of tables) {
        await connection.execute(`TRUNCATE TABLE ${table}`);
    }
    // Re-enable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✓ All data cleared successfully");
    // Seed Roles
    console.log("📋 Seeding roles...");
    const roles = [
        { name: "ADMIN", description: "Administrator - Full system access" },
        { name: "MANAGER", description: "Project Manager" },
        { name: "SUPERVISOR", description: "Section Supervisor" },
        { name: "OPERATOR", description: "Process Operator" },
        { name: "SALESMAN", description: "Sales Representative" }
    ];
    const roleIds = [];
    for (const role of roles) {
        const [result] = await connection.execute("INSERT INTO roles (name, description, is_active) VALUES (?, ?, TRUE)", [role.name, role.description]);
        roleIds.push(result.insertId);
    }
    // Seed Sections
    console.log("🏢 Seeding sections...");
    const sections = [
        {
            name: "Corte",
            description: "Cutting department - responsible for cutting fabric"
        },
        {
            name: "Confección",
            description: "Sewing department - assembles garments"
        },
        {
            name: "Acabado",
            description: "Finishing department - quality control and finishing"
        },
        {
            name: "Empaque",
            description: "Packaging department - prepares orders for delivery"
        },
        {
            name: "Almacén",
            description: "Warehouse - manages inventory"
        }
    ];
    const sectionIds = [];
    for (const section of sections) {
        const [result] = await connection.execute("INSERT INTO sections (name, description, is_active) VALUES (?, ?, TRUE)", [section.name, section.description]);
        sectionIds.push(result.insertId);
    }
    // Seed Users
    console.log("👥 Seeding users...");
    const users = [
        {
            email: "admin@folios.com",
            password: "Admin123!",
            full_name: "Administrator",
            role_id: roleIds[0],
            section_id: null
        },
        {
            email: "manager@folios.com",
            password: "Manager123!",
            full_name: "Juan García",
            role_id: roleIds[1],
            section_id: null
        },
        {
            email: "supervisor.corte@folios.com",
            password: "Super123!",
            full_name: "Maria López",
            role_id: roleIds[2],
            section_id: sectionIds[0]
        },
        {
            email: "supervisor.confeccion@folios.com",
            password: "Super123!",
            full_name: "Carlos Rodríguez",
            role_id: roleIds[2],
            section_id: sectionIds[1]
        },
        {
            email: "supervisor.acabado@folios.com",
            password: "Super123!",
            full_name: "Ana Martínez",
            role_id: roleIds[2],
            section_id: sectionIds[2]
        },
        {
            email: "operator.corte@folios.com",
            password: "Operator123!",
            full_name: "Pedro Sánchez",
            role_id: roleIds[3],
            section_id: sectionIds[0]
        },
        {
            email: "operator.confeccion@folios.com",
            password: "Operator123!",
            full_name: "Rosa Díaz",
            role_id: roleIds[3],
            section_id: sectionIds[1]
        },
        {
            email: "salesman@folios.com",
            password: "Sales123!",
            full_name: "Miguel Torres",
            role_id: roleIds[4],
            section_id: null
        }
    ];
    const userIds = [];
    for (const user of users) {
        const passwordHash = await bcryptjs_1.default.hash(user.password, 10);
        const [result] = await connection.execute(`INSERT INTO users (email, password_hash, full_name, role_id, section_id, is_active)
       VALUES (?, ?, ?, ?, ?, TRUE)`, [
            user.email,
            passwordHash,
            user.full_name,
            user.role_id,
            user.section_id
        ]);
        userIds.push(result.insertId);
    }
    // Seed Clients
    console.log("🏭 Seeding clients...");
    const clients = [
        {
            name: "Textiles Internacionales S.A.",
            contact_email: "contact@textiles-intl.com",
            phone: "+34 91 123 4567",
            address: "Calle Principal 123, Madrid, Spain"
        },
        {
            name: "Moda Global Ltd.",
            contact_email: "info@modaglobal.br",
            phone: "+55 11 98765 4321",
            address: "Avenida Paulista 1000, São Paulo, Brazil"
        },
        {
            name: "Fashion Works Inc.",
            contact_email: "sales@fashionworks.us",
            phone: "+1 212 555 0123",
            address: "5th Avenue 500, New York, USA"
        },
        {
            name: "Confecciones del Sur",
            contact_email: "ventas@confdelsu.com",
            phone: "+52 55 1234 5678",
            address: "Paseo de la Reforma 505, Mexico City"
        }
    ];
    const clientIds = [];
    for (const client of clients) {
        const [result] = await connection.execute(`INSERT INTO clients (name, contact_email, phone, address, is_active)
       VALUES (?, ?, ?, ?, TRUE)`, [client.name, client.contact_email, client.phone, client.address]);
        clientIds.push(result.insertId);
    }
    // Seed Projects
    console.log("📊 Seeding projects...");
    const projects = [
        {
            name: "Colección Primavera 2024",
            client_id: clientIds[0],
            salesman_id: userIds[7],
            description: "Spring collection with 5000 pieces"
        },
        {
            name: "Línea Casual Premium",
            client_id: clientIds[1],
            salesman_id: userIds[7],
            description: "Premium casual wear line - 3000 pieces"
        },
        {
            name: "Proyecto Corporativo",
            client_id: clientIds[2],
            salesman_id: userIds[7],
            description: "Corporate wear uniforms - 2000 pieces"
        },
        {
            name: "Colección Verde Sustentable",
            client_id: clientIds[3],
            salesman_id: userIds[7],
            description: "Sustainable collection - eco-friendly materials"
        }
    ];
    const projectIds = [];
    for (const project of projects) {
        const [result] = await connection.execute(`INSERT INTO projects (name, client_id, salesman_id, description, is_active)
       VALUES (?, ?, ?, ?, TRUE)`, [
            project.name,
            project.client_id,
            project.salesman_id,
            project.description
        ]);
        projectIds.push(result.insertId);
    }
    // Seed Folios
    console.log("📑 Seeding folios...");
    const folios = [
        {
            folio_number: "FOL-2024-001",
            project_id: projectIds[0],
            quantity: 500,
            status: "ACTIVE"
        },
        {
            folio_number: "FOL-2024-002",
            project_id: projectIds[0],
            quantity: 750,
            status: "ACTIVE"
        },
        {
            folio_number: "FOL-2024-003",
            project_id: projectIds[1],
            quantity: 300,
            status: "COMPLETED"
        },
        {
            folio_number: "FOL-2024-004",
            project_id: projectIds[2],
            quantity: 200,
            status: "ACTIVE"
        },
        {
            folio_number: "FOL-2024-005",
            project_id: projectIds[3],
            quantity: 400,
            status: "ACTIVE"
        }
    ];
    const folioIds = [];
    for (const folio of folios) {
        const [result] = await connection.execute(`INSERT INTO folios (folio_number, project_id, quantity, status)
       VALUES (?, ?, ?, ?)`, [folio.folio_number, folio.project_id, folio.quantity, folio.status]);
        folioIds.push(result.insertId);
    }
    // Seed Garments
    console.log("👕 Seeding garments...");
    const garmentsByFolio = new Map();
    for (const folioId of folioIds) {
        const [folioData] = await connection.execute("SELECT quantity FROM folios WHERE id = ?", [folioId]);
        const quantity = folioData[0].quantity;
        const garmentIds = [];
        for (let i = 1; i <= quantity; i++) {
            const garmentCode = `GAR-${folioId}-${String(i).padStart(4, "0")}`;
            const status = i % 3 === 0 ? "COMPLETED" : i % 2 === 0 ? "IN_PROGRESS" : "PENDING";
            const [result] = await connection.execute(`INSERT INTO garments (folio_id, garment_number, garment_code, status)
         VALUES (?, ?, ?, ?)`, [folioId, i, garmentCode, status]);
            garmentIds.push(result.insertId);
        }
        garmentsByFolio.set(folioId, garmentIds);
    }
    // Seed Routes
    console.log("🛣️ Seeding routes...");
    const routes = [
        {
            name: "Ruta Standard",
            description: "Standard production route through all sections"
        },
        {
            name: "Ruta Expedita",
            description: "Fast track route for urgent orders"
        },
        {
            name: "Ruta Custom",
            description: "Custom route with selective sections"
        }
    ];
    const routeMap = new Map();
    for (const route of routes) {
        const [result] = await connection.execute(`INSERT INTO routes (name, description, is_active) VALUES (?, ?, TRUE)`, [route.name, route.description]);
        const routeId = result.insertId;
        routeMap.set(route.name, routeId);
        if (route.name === "Ruta Standard") {
            for (let i = 0; i < sectionIds.length; i++) {
                await connection.execute(`INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)
           VALUES (?, ?, ?, TRUE)`, [routeId, sectionIds[i], i + 1]);
            }
        }
        else if (route.name === "Ruta Expedita") {
            for (let i = 0; i < 3; i++) {
                await connection.execute(`INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)
           VALUES (?, ?, ?, TRUE)`, [routeId, sectionIds[i], i + 1]);
            }
        }
        else {
            const selectedSections = [sectionIds[0], sectionIds[1], sectionIds[3]];
            for (let i = 0; i < selectedSections.length; i++) {
                await connection.execute(`INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)
           VALUES (?, ?, ?, TRUE)`, [routeId, selectedSections[i], i + 1]);
            }
        }
    }
    // Seed Processes
    console.log("⚙️ Seeding processes...");
    const processTemplates = [
        {
            sectionIndex: 0,
            processes: [
                {
                    name: "Corte de tela",
                    description: "Cutting fabric into pieces",
                    type: "POR_CANTIDAD"
                },
                {
                    name: "Preparación de moldes",
                    description: "Preparing cutting templates",
                    type: "UNITARIO"
                }
            ]
        },
        {
            sectionIndex: 1,
            processes: [
                {
                    name: "Costura de piezas",
                    description: "Sewing pieces together",
                    type: "POR_CANTIDAD"
                },
                {
                    name: "Montaje de mangas",
                    description: "Attaching sleeves",
                    type: "UNITARIO"
                },
                {
                    name: "Costura de botones",
                    description: "Sewing buttons",
                    type: "UNITARIO"
                }
            ]
        },
        {
            sectionIndex: 2,
            processes: [
                {
                    name: "Planchado",
                    description: "Ironing garments",
                    type: "UNITARIO"
                },
                {
                    name: "Control de calidad",
                    description: "Quality inspection",
                    type: "UNITARIO"
                }
            ]
        },
        {
            sectionIndex: 3,
            processes: [
                {
                    name: "Empaque",
                    description: "Packaging items",
                    type: "POR_CANTIDAD"
                }
            ]
        },
        {
            sectionIndex: 4,
            processes: [
                {
                    name: "Etiquetado",
                    description: "Labeling inventory",
                    type: "UNITARIO"
                }
            ]
        }
    ];
    const processBySectionMap = new Map();
    for (const template of processTemplates) {
        const sectionId = sectionIds[template.sectionIndex];
        const processIds = [];
        for (const proc of template.processes) {
            const [result] = await connection.execute(`INSERT INTO processes (section_id, name, description, type, is_active)
         VALUES (?, ?, ?, ?, TRUE)`, [sectionId, proc.name, proc.description, proc.type]);
            processIds.push(result.insertId);
        }
        processBySectionMap.set(sectionId, processIds);
    }
    // Seed Folio Routes
    console.log("🔗 Seeding folio routes...");
    const folioRouteMap = new Map();
    for (let i = 0; i < folioIds.length; i++) {
        const folioId = folioIds[i];
        const routeName = i % 3 === 0 ? "Ruta Standard" : "Ruta Expedita";
        const routeId = routeMap.get(routeName);
        const status = i % 2 === 0 ? "IN_PROGRESS" : "NOT_STARTED";
        const startedAt = status === "IN_PROGRESS"
            ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            : null;
        const [result] = await connection.execute(`INSERT INTO folio_routes (folio_id, route_id, status, started_at)
       VALUES (?, ?, ?, ?)`, [folioId, routeId, status, startedAt]);
        folioRouteMap.set(folioId, result.insertId);
    }
    // Seed Folio Processes
    console.log("🔧 Seeding folio processes...");
    for (const folioId of folioIds) {
        const garmentIds = garmentsByFolio.get(folioId) || [];
        const [routeData] = await connection.execute(`SELECT rs.id, rs.section_id, rs.sequence_order
       FROM folio_routes fr
       JOIN routes r ON fr.route_id = r.id
       JOIN route_sections rs ON r.id = rs.route_id
       WHERE fr.folio_id = ? AND rs.is_active = TRUE
       ORDER BY rs.sequence_order`, [folioId]);
        for (const route of routeData) {
            const routeSectionId = route.id;
            const sectionId = route.section_id;
            const processIds = processBySectionMap.get(sectionId) || [];
            for (let i = 0; i < Math.min(3, garmentIds.length); i++) {
                const garmentId = garmentIds[i];
                const processId = processIds[0];
                if (processId) {
                    const status = i % 3 === 0 ? "COMPLETED" : "IN_PROGRESS";
                    const totalQuantity = 5;
                    const completedQuantity = status === "COMPLETED" ? 5 : 2;
                    await connection.execute(`INSERT INTO folio_processes
             (folio_id, garment_id, process_id, route_section_id, status, total_quantity, completed_quantity)
             VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                        folioId,
                        garmentId,
                        processId,
                        routeSectionId,
                        status,
                        totalQuantity,
                        completedQuantity
                    ]);
                }
            }
        }
    }
    // Seed Delivery Dates
    console.log("📅 Seeding delivery dates...");
    for (const folioId of folioIds) {
        for (let i = 0; i < 2; i++) {
            const daysFromNow = 30 + i * 15;
            const dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
            const notes = i === 0 ? "Original delivery date" : "Revised delivery date";
            const isActive = i === 0;
            await connection.execute(`INSERT INTO delivery_dates (folio_id, due_date, notes, is_active)
         VALUES (?, ?, ?, ?)`, [folioId, dueDate, notes, isActive]);
        }
    }
    // Seed Audit Logs
    console.log("📝 Seeding audit logs...");
    const auditLogs = [
        {
            action: "CREATED",
            entity_type: "FOLIO",
            entity_id: folioIds[0],
            user_id: userIds[1],
            description: "Folio created from new project"
        },
        {
            action: "STATE_CHANGE",
            entity_type: "FOLIO",
            entity_id: folioIds[1],
            user_id: userIds[2],
            description: "Folio status changed to IN_PROGRESS",
            old_value: "NOT_STARTED",
            new_value: "IN_PROGRESS"
        },
        {
            action: "PROGRESS_UPDATE",
            entity_type: "FOLIO_PROCESS",
            entity_id: 1,
            user_id: userIds[5],
            description: "100 units completed in cutting section"
        }
    ];
    for (const log of auditLogs) {
        await connection.execute(`INSERT INTO audit_log
       (action, entity_type, entity_id, user_id, old_value, new_value, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [
            log.action,
            log.entity_type,
            log.entity_id,
            log.user_id,
            log.old_value || null,
            log.new_value || null,
            log.description
        ]);
    }
    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📋 Test Accounts Created:");
    console.log("  Admin:      admin@folios.com / Admin123!");
    console.log("  Manager:    manager@folios.com / Manager123!");
    console.log("  Supervisor: supervisor.corte@folios.com / Super123!");
    console.log("  Operator:   operator.corte@folios.com / Operator123!");
    console.log("  Salesman:   salesman@folios.com / Sales123!");
}
//# sourceMappingURL=seedDatabase.js.map