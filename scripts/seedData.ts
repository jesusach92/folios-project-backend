import mysql from "mysql2/promise";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

interface SeedConfig {
  clearData?: boolean;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "folios_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function clearAllData(): Promise<void> {
  const connection = await pool.getConnection();
  try {
    console.log("🧹 Clearing existing data...");

    // Disable foreign key checks temporarily
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

    const tables = [
      "audit_log",
      "delivery_date_history",
      "delivery_dates",
      "process_progress",
      "folio_processes",
      "route_sections",
      "routes",
      "garments_routes",
      "folio_garments",
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
      console.log(`  ✓ Cleared ${table}`);
    }

    // Re-enable foreign key checks
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
    console.log("✓ All data cleared successfully\n");
  } finally {
    connection.release();
  }
}

async function seedRoles(connection: mysql.PoolConnection): Promise<number[]> {
  console.log("📋 Seeding roles...");

  const roles = [
    { name: "ADMIN", description: "Administrator - Full system access" },
    { name: "MANAGER", description: "Project Manager" },
    { name: "SUPERVISOR", description: "Section Supervisor" },
    { name: "OPERATOR", description: "Process Operator" },
    { name: "SALESMAN", description: "Sales Representative" }
  ];

  const roleIds: number[] = [];

  for (const role of roles) {
    const [result] = await connection.execute<any>(
      "INSERT INTO roles (name, description, is_active) VALUES (?, ?, TRUE)",
      [role.name, role.description]
    );
    roleIds.push(result.insertId);
    console.log(`  ✓ Created role: ${role.name}`);
  }

  return roleIds;
}

async function seedSections(connection: mysql.PoolConnection): Promise<number[]> {
  console.log("\n🏢 Seeding sections...");

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

  const sectionIds: number[] = [];

  for (const section of sections) {
    const [result] = await connection.execute<any>(
      "INSERT INTO sections (name, description, is_active) VALUES (?, ?, TRUE)",
      [section.name, section.description]
    );
    sectionIds.push(result.insertId);
    console.log(`  ✓ Created section: ${section.name}`);
  }

  return sectionIds;
}

async function seedUsers(
  connection: mysql.PoolConnection,
  roleIds: number[],
  sectionIds: number[]
): Promise<number[]> {
  console.log("\n👥 Seeding users...");

  const users = [
    {
      email: "admin@folios.com",
      password: "Admin123!",
      full_name: "Administrator",
      role_id: roleIds[0], // ADMIN
      section_id: null
    },
    {
      email: "manager@folios.com",
      password: "Manager123!",
      full_name: "Juan García",
      role_id: roleIds[1], // MANAGER
      section_id: null
    },
    {
      email: "supervisor.corte@folios.com",
      password: "Super123!",
      full_name: "Maria López",
      role_id: roleIds[2], // SUPERVISOR
      section_id: sectionIds[0] // Corte
    },
    {
      email: "supervisor.confeccion@folios.com",
      password: "Super123!",
      full_name: "Carlos Rodríguez",
      role_id: roleIds[2], // SUPERVISOR
      section_id: sectionIds[1] // Confección
    },
    {
      email: "supervisor.acabado@folios.com",
      password: "Super123!",
      full_name: "Ana Martínez",
      role_id: roleIds[2], // SUPERVISOR
      section_id: sectionIds[2] // Acabado
    },
    {
      email: "operator.corte@folios.com",
      password: "Operator123!",
      full_name: "Pedro Sánchez",
      role_id: roleIds[3], // OPERATOR
      section_id: sectionIds[0] // Corte
    },
    {
      email: "operator.confeccion@folios.com",
      password: "Operator123!",
      full_name: "Rosa Díaz",
      role_id: roleIds[3], // OPERATOR
      section_id: sectionIds[1] // Confección
    },
    {
      email: "salesman@folios.com",
      password: "Sales123!",
      full_name: "Miguel Torres",
      role_id: roleIds[4], // SALESMAN
      section_id: null
    }
  ];

  const userIds: number[] = [];

  for (const user of users) {
    const passwordHash = await bcryptjs.hash(user.password, 10);

    const [result] = await connection.execute<any>(
      `INSERT INTO users (email, password_hash, full_name, role_id, section_id, is_active)
       VALUES (?, ?, ?, ?, ?, TRUE)`,
      [
        user.email,
        passwordHash,
        user.full_name,
        user.role_id,
        user.section_id
      ]
    );
    userIds.push(result.insertId);
    console.log(`  ✓ Created user: ${user.full_name} (${user.email})`);
  }

  return userIds;
}

async function seedClients(connection: mysql.PoolConnection): Promise<number[]> {
  console.log("\n🏭 Seeding clients...");

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

  const clientIds: number[] = [];

  for (const client of clients) {
    const [result] = await connection.execute<any>(
      `INSERT INTO clients (name, contact_email, phone, address, is_active)
       VALUES (?, ?, ?, ?, TRUE)`,
      [client.name, client.contact_email, client.phone, client.address]
    );
    clientIds.push(result.insertId);
    console.log(`  ✓ Created client: ${client.name}`);
  }

  return clientIds;
}

async function seedProjects(
  connection: mysql.PoolConnection,
  clientIds: number[],
  userIds: number[]
): Promise<number[]> {
  console.log("\n📊 Seeding projects...");

  const projects = [
    {
      name: "Colección Primavera 2024",
      client_id: clientIds[0],
      salesman_id: userIds[7], // Miguel Torres (salesman)
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

  const projectIds: number[] = [];

  for (const project of projects) {
    const [result] = await connection.execute<any>(
      `INSERT INTO projects (name, client_id, salesman_id, description, is_active)
       VALUES (?, ?, ?, ?, TRUE)`,
      [
        project.name,
        project.client_id,
        project.salesman_id,
        project.description
      ]
    );
    projectIds.push(result.insertId);
    console.log(`  ✓ Created project: ${project.name}`);
  }

  return projectIds;
}

async function seedFolios(
  connection: mysql.PoolConnection,
  projectIds: number[]
): Promise<number[]> {
  console.log("\n📑 Seeding folios...");

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

  const folioIds: number[] = [];

  for (const folio of folios) {
    const [result] = await connection.execute<any>(
      `INSERT INTO folios (folio_number, project_id, quantity, status)
       VALUES (?, ?, ?, ?)`,
      [folio.folio_number, folio.project_id, folio.quantity, folio.status]
    );
    folioIds.push(result.insertId);
    console.log(`  ✓ Created folio: ${folio.folio_number} (${folio.quantity} pieces)`);
  }

  return folioIds;
}

async function seedGarments(
  connection: mysql.PoolConnection,
  folioIds: number[]
): Promise<Map<number, number[]>> {
  console.log("\n👕 Seeding garments...");

  const garmentsByFolio = new Map<number, number[]>();

  for (const folioId of folioIds) {
    const [folioData] = await connection.execute<any>(
      "SELECT quantity FROM folios WHERE id = ?",
      [folioId]
    );

    const quantity = folioData[0].quantity;
    const garmentIds: number[] = [];

    for (let i = 1; i <= quantity; i++) {
      const garmentCode = `GAR-${folioId}-${String(i).padStart(4, "0")}`;
      const garmentDescription = `Garment #${i} for Folio ${folioId}`;

      // Check if garment with this code already exists
      const [existingGarment] = await connection.execute<any>(
        "SELECT id FROM garments WHERE garment_code = ?",
        [garmentCode]
      );

      let garmentId: number;
      if (existingGarment && (existingGarment as any[])[0]) {
        garmentId = (existingGarment as any[])[0].id;
      } else {
        const [result] = await connection.execute<any>(
          `INSERT INTO garments (garment_description, garment_code)
           VALUES (?, ?)`,
          [garmentDescription, garmentCode]
        );
        garmentId = (result as any).insertId;
      }

      // Associate garment to folio in folio_garments table
      try {
        await connection.execute<any>(
          `INSERT INTO folio_garments (folio_id, garment_id)
           VALUES (?, ?)`,
          [folioId, garmentId]
        );
      } catch (error: any) {
        // Ignore duplicate key errors (association already exists)
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }

      garmentIds.push(garmentId);
    }

    garmentsByFolio.set(folioId, garmentIds);
    console.log(
      `  ✓ Created ${quantity} garments for folio ${folioId}`
    );
  }

  return garmentsByFolio;
}

async function seedRoutes(
  connection: mysql.PoolConnection,
  sectionIds: number[]
): Promise<Map<string, number>> {
  console.log("\n🛣️ Seeding routes...");

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

  const routeMap = new Map<string, number>();

  for (const route of routes) {
    const [result] = await connection.execute<any>(
      `INSERT INTO routes (name, description, is_active) VALUES (?, ?, TRUE)`,
      [route.name, route.description]
    );
    const routeId = result.insertId;
    routeMap.set(route.name, routeId);

    // Add route sections
    if (route.name === "Ruta Standard") {
      // All sections in order
      for (let i = 0; i < sectionIds.length; i++) {
        await connection.execute<any>(
          `INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)
           VALUES (?, ?, ?, TRUE)`,
          [routeId, sectionIds[i], i + 1]
        );
      }
    } else if (route.name === "Ruta Expedita") {
      // Only first 3 sections
      for (let i = 0; i < 3; i++) {
        await connection.execute<any>(
          `INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)
           VALUES (?, ?, ?, TRUE)`,
          [routeId, sectionIds[i], i + 1]
        );
      }
    } else {
      // Sections 0, 1, 3 (skip 2)
      const selectedSections = [sectionIds[0], sectionIds[1], sectionIds[3]];
      for (let i = 0; i < selectedSections.length; i++) {
        await connection.execute<any>(
          `INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)
           VALUES (?, ?, ?, TRUE)`,
          [routeId, selectedSections[i], i + 1]
        );
      }
    }

    console.log(`  ✓ Created route: ${route.name}`);
  }

  return routeMap;
}

async function seedProcesses(
  connection: mysql.PoolConnection,
  sectionIds: number[]
): Promise<Map<number, number[]>> {
  console.log("\n⚙️ Seeding processes...");

  const processBySectionMap = new Map<number, number[]>();

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

  for (const template of processTemplates) {
    const sectionId = sectionIds[template.sectionIndex];
    const processIds: number[] = [];

    for (const proc of template.processes) {
      const [result] = await connection.execute<any>(
        `INSERT INTO processes (section_id, name, description, type, is_active)
         VALUES (?, ?, ?, ?, TRUE)`,
        [sectionId, proc.name, proc.description, proc.type]
      );
      processIds.push(result.insertId);
      console.log(`  ✓ Created process: ${proc.name} in section ${sectionId}`);
    }

    processBySectionMap.set(sectionId, processIds);
  }

  return processBySectionMap;
}


async function seedFolioProcesses(
  connection: mysql.PoolConnection,
  folioIds: number[],
  garmentsByFolio: Map<number, number[]>,
  processBySectionMap: Map<number, number[]>,
  routeMap: Map<string, number>
): Promise<void> {
  console.log("\n🔧 Seeding folio processes...");

  let processCount = 0;

  for (let folioIdx = 0; folioIdx < folioIds.length; folioIdx++) {
    const folioId = folioIds[folioIdx];
    const garmentIds = garmentsByFolio.get(folioId) || [];

    // Select a route for this folio
    const routeName = folioIdx % 3 === 0 ? "Ruta Standard" : "Ruta Expedita";
    const routeId = routeMap.get(routeName)!;

    // Get route sections for the selected route
    const [routeData] = await connection.execute<any>(
      `SELECT rs.id, rs.section_id, rs.sequence_order
       FROM route_sections rs
       WHERE rs.route_id = ? AND rs.is_active = TRUE
       ORDER BY rs.sequence_order`,
      [routeId]
    );

    for (const route of routeData) {
      const routeSectionId = route.id;
      const sectionId = route.section_id;
      const processIds = processBySectionMap.get(sectionId) || [];

      for (let i = 0; i < Math.min(3, garmentIds.length); i++) {
        const garmentId = garmentIds[i];
        const processId = processIds[0]; // Use first process in section

        if (processId) {
          const status = i % 3 === 0 ? "COMPLETED" : "IN_PROGRESS";
          const totalQuantity = 5;
          const completedQuantity = status === "COMPLETED" ? 5 : 2;

          await connection.execute<any>(
            `INSERT INTO folio_processes
             (folio_id, garment_id, process_id, route_section_id, status, total_quantity, completed_quantity)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              folioId,
              garmentId,
              processId,
              routeSectionId,
              status,
              totalQuantity,
              completedQuantity
            ]
          );
          processCount++;
        }
      }
    }
  }

  console.log(`  ✓ Created ${processCount} folio process records`);
}

async function seedDeliveryDates(
  connection: mysql.PoolConnection,
  folioIds: number[]
): Promise<void> {
  console.log("\n📅 Seeding delivery dates...");

  let count = 0;

  for (const folioId of folioIds) {
    // Create multiple delivery dates for testing
    for (let i = 0; i < 2; i++) {
      const daysFromNow = 30 + i * 15;
      const dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
      const notes =
        i === 0 ? "Original delivery date" : "Revised delivery date";
      const isActive = i === 0;

      await connection.execute<any>(
        `INSERT INTO delivery_dates (folio_id, due_date, notes, is_active)
         VALUES (?, ?, ?, ?)`,
        [folioId, dueDate, notes, isActive]
      );
      count++;
    }
  }

  console.log(`  ✓ Created ${count} delivery date records`);
}

async function seedAuditLogs(
  connection: mysql.PoolConnection,
  userIds: number[],
  folioIds: number[]
): Promise<void> {
  console.log("\n📝 Seeding audit logs...");

  const auditLogs = [
    {
      action: "CREATED",
      entity_type: "FOLIO",
      entity_id: folioIds[0],
      user_id: userIds[1], // Manager
      description: "Folio created from new project"
    },
    {
      action: "STATE_CHANGE",
      entity_type: "FOLIO",
      entity_id: folioIds[1],
      user_id: userIds[2], // Supervisor Corte
      description: "Folio status changed to IN_PROGRESS",
      old_value: "NOT_STARTED",
      new_value: "IN_PROGRESS"
    },
    {
      action: "PROGRESS_UPDATE",
      entity_type: "FOLIO_PROCESS",
      entity_id: 1,
      user_id: userIds[5], // Operator Corte
      description: "100 units completed in cutting section"
    }
  ];

  for (const log of auditLogs) {
    await connection.execute<any>(
      `INSERT INTO audit_log
       (action, entity_type, entity_id, user_id, old_value, new_value, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        log.action,
        log.entity_type,
        log.entity_id,
        log.user_id,
        log.old_value || null,
        log.new_value || null,
        log.description
      ]
    );
  }

  console.log(`  ✓ Created ${auditLogs.length} audit log records`);
}

async function main(config: SeedConfig = {}): Promise<void> {
  let connection: mysql.PoolConnection | null = null;

  try {
    console.log("🌱 Starting database seeding...\n");

    connection = await pool.getConnection();

    if (config.clearData !== false) {
      await clearAllData();
    }

    // Seed all data in order
    const roleIds = await seedRoles(connection);
    const sectionIds = await seedSections(connection);
    const userIds = await seedUsers(connection, roleIds, sectionIds);
    const clientIds = await seedClients(connection);
    const projectIds = await seedProjects(connection, clientIds, userIds);
    const folioIds = await seedFolios(connection, projectIds);
    const garmentsByFolio = await seedGarments(connection, folioIds);
    const routeMap = await seedRoutes(connection, sectionIds);
    const processBySectionMap = await seedProcesses(connection, sectionIds);
    await seedFolioProcesses(
      connection,
      folioIds,
      garmentsByFolio,
      processBySectionMap,
      routeMap
    );
    await seedDeliveryDates(connection, folioIds);
    await seedAuditLogs(connection, userIds, folioIds);

    console.log("\n✅ Database seeding completed successfully!\n");
    console.log("📋 Test Accounts Created:");
    console.log("  Admin:      admin@folios.com / Admin123!");
    console.log("  Manager:    manager@folios.com / Manager123!");
    console.log("  Supervisor: supervisor.corte@folios.com / Super123!");
    console.log("  Operator:   operator.corte@folios.com / Operator123!");
    console.log("  Salesman:   salesman@folios.com / Sales123!");
    console.log("\nYou can now use these accounts to test the application!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
  }
}

// Run the seed script
main({ clearData: true });
