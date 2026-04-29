"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = __importDefault(require("mysql2/promise"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var pool = promise_1.default.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "folios_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
function clearAllData() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, tables, _i, tables_1, table;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.getConnection()];
                case 1:
                    connection = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 9, 10]);
                    console.log("🧹 Clearing existing data...");
                    // Disable foreign key checks temporarily
                    return [4 /*yield*/, connection.execute("SET FOREIGN_KEY_CHECKS = 0")];
                case 3:
                    // Disable foreign key checks temporarily
                    _a.sent();
                    tables = [
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
                    _i = 0, tables_1 = tables;
                    _a.label = 4;
                case 4:
                    if (!(_i < tables_1.length)) return [3 /*break*/, 7];
                    table = tables_1[_i];
                    return [4 /*yield*/, connection.execute("TRUNCATE TABLE ".concat(table))];
                case 5:
                    _a.sent();
                    console.log("  \u2713 Cleared ".concat(table));
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: 
                // Re-enable foreign key checks
                return [4 /*yield*/, connection.execute("SET FOREIGN_KEY_CHECKS = 1")];
                case 8:
                    // Re-enable foreign key checks
                    _a.sent();
                    console.log("✓ All data cleared successfully\n");
                    return [3 /*break*/, 10];
                case 9:
                    connection.release();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function seedRoles(connection) {
    return __awaiter(this, void 0, void 0, function () {
        var roles, roleIds, _i, roles_1, role, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("📋 Seeding roles...");
                    roles = [
                        { name: "ADMIN", description: "Administrator - Full system access" },
                        { name: "MANAGER", description: "Project Manager" },
                        { name: "SUPERVISOR", description: "Section Supervisor" },
                        { name: "OPERATOR", description: "Process Operator" },
                        { name: "SALESMAN", description: "Sales Representative" }
                    ];
                    roleIds = [];
                    _i = 0, roles_1 = roles;
                    _a.label = 1;
                case 1:
                    if (!(_i < roles_1.length)) return [3 /*break*/, 4];
                    role = roles_1[_i];
                    return [4 /*yield*/, connection.execute("INSERT INTO roles (name, description, is_active) VALUES (?, ?, TRUE)", [role.name, role.description])];
                case 2:
                    result = (_a.sent())[0];
                    roleIds.push(result.insertId);
                    console.log("  \u2713 Created role: ".concat(role.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, roleIds];
            }
        });
    });
}
function seedSections(connection) {
    return __awaiter(this, void 0, void 0, function () {
        var sections, sectionIds, _i, sections_1, section, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n🏢 Seeding sections...");
                    sections = [
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
                    sectionIds = [];
                    _i = 0, sections_1 = sections;
                    _a.label = 1;
                case 1:
                    if (!(_i < sections_1.length)) return [3 /*break*/, 4];
                    section = sections_1[_i];
                    return [4 /*yield*/, connection.execute("INSERT INTO sections (name, description, is_active) VALUES (?, ?, TRUE)", [section.name, section.description])];
                case 2:
                    result = (_a.sent())[0];
                    sectionIds.push(result.insertId);
                    console.log("  \u2713 Created section: ".concat(section.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, sectionIds];
            }
        });
    });
}
function seedUsers(connection, roleIds, sectionIds) {
    return __awaiter(this, void 0, void 0, function () {
        var users, userIds, _i, users_1, user, passwordHash, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n👥 Seeding users...");
                    users = [
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
                    userIds = [];
                    _i = 0, users_1 = users;
                    _a.label = 1;
                case 1:
                    if (!(_i < users_1.length)) return [3 /*break*/, 5];
                    user = users_1[_i];
                    return [4 /*yield*/, bcryptjs_1.default.hash(user.password, 10)];
                case 2:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, connection.execute("INSERT INTO users (email, password_hash, full_name, role_id, section_id, is_active)\n       VALUES (?, ?, ?, ?, ?, TRUE)", [
                            user.email,
                            passwordHash,
                            user.full_name,
                            user.role_id,
                            user.section_id
                        ])];
                case 3:
                    result = (_a.sent())[0];
                    userIds.push(result.insertId);
                    console.log("  \u2713 Created user: ".concat(user.full_name, " (").concat(user.email, ")"));
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, userIds];
            }
        });
    });
}
function seedClients(connection) {
    return __awaiter(this, void 0, void 0, function () {
        var clients, clientIds, _i, clients_1, client, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n🏭 Seeding clients...");
                    clients = [
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
                    clientIds = [];
                    _i = 0, clients_1 = clients;
                    _a.label = 1;
                case 1:
                    if (!(_i < clients_1.length)) return [3 /*break*/, 4];
                    client = clients_1[_i];
                    return [4 /*yield*/, connection.execute("INSERT INTO clients (name, contact_email, phone, address, is_active)\n       VALUES (?, ?, ?, ?, TRUE)", [client.name, client.contact_email, client.phone, client.address])];
                case 2:
                    result = (_a.sent())[0];
                    clientIds.push(result.insertId);
                    console.log("  \u2713 Created client: ".concat(client.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, clientIds];
            }
        });
    });
}
function seedProjects(connection, clientIds, userIds) {
    return __awaiter(this, void 0, void 0, function () {
        var projects, projectIds, _i, projects_1, project, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n📊 Seeding projects...");
                    projects = [
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
                    projectIds = [];
                    _i = 0, projects_1 = projects;
                    _a.label = 1;
                case 1:
                    if (!(_i < projects_1.length)) return [3 /*break*/, 4];
                    project = projects_1[_i];
                    return [4 /*yield*/, connection.execute("INSERT INTO projects (name, client_id, salesman_id, description, is_active)\n       VALUES (?, ?, ?, ?, TRUE)", [
                            project.name,
                            project.client_id,
                            project.salesman_id,
                            project.description
                        ])];
                case 2:
                    result = (_a.sent())[0];
                    projectIds.push(result.insertId);
                    console.log("  \u2713 Created project: ".concat(project.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, projectIds];
            }
        });
    });
}
function seedFolios(connection, projectIds) {
    return __awaiter(this, void 0, void 0, function () {
        var folios, folioIds, _i, folios_1, folio, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n📑 Seeding folios...");
                    folios = [
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
                    folioIds = [];
                    _i = 0, folios_1 = folios;
                    _a.label = 1;
                case 1:
                    if (!(_i < folios_1.length)) return [3 /*break*/, 4];
                    folio = folios_1[_i];
                    return [4 /*yield*/, connection.execute("INSERT INTO folios (folio_number, project_id, quantity, status)\n       VALUES (?, ?, ?, ?)", [folio.folio_number, folio.project_id, folio.quantity, folio.status])];
                case 2:
                    result = (_a.sent())[0];
                    folioIds.push(result.insertId);
                    console.log("  \u2713 Created folio: ".concat(folio.folio_number, " (").concat(folio.quantity, " pieces)"));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, folioIds];
            }
        });
    });
}
function seedGarments(connection, folioIds) {
    return __awaiter(this, void 0, void 0, function () {
        var garmentsByFolio, _i, folioIds_1, folioId, folioData, quantity, garmentIds, i, garmentCode, garmentDescription, existingGarment, garmentId, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n👕 Seeding garments...");
                    garmentsByFolio = new Map();
                    _i = 0, folioIds_1 = folioIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < folioIds_1.length)) return [3 /*break*/, 14];
                    folioId = folioIds_1[_i];
                    return [4 /*yield*/, connection.execute("SELECT quantity FROM folios WHERE id = ?", [folioId])];
                case 2:
                    folioData = (_a.sent())[0];
                    quantity = folioData[0].quantity;
                    garmentIds = [];
                    i = 1;
                    _a.label = 3;
                case 3:
                    if (!(i <= quantity)) return [3 /*break*/, 12];
                    garmentCode = "GAR-".concat(folioId, "-").concat(String(i).padStart(4, "0"));
                    garmentDescription = "Garment #".concat(i, " for Folio ").concat(folioId);
                    return [4 /*yield*/, connection.execute("SELECT id FROM garments WHERE garment_code = ?", [garmentCode])];
                case 4:
                    existingGarment = (_a.sent())[0];
                    garmentId = void 0;
                    if (!(existingGarment && existingGarment[0])) return [3 /*break*/, 5];
                    garmentId = existingGarment[0].id;
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, connection.execute("INSERT INTO garments (garment_description, garment_code)\n           VALUES (?, ?)", [garmentDescription, garmentCode])];
                case 6:
                    result = (_a.sent())[0];
                    garmentId = result.insertId;
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, connection.execute("INSERT INTO folio_garments (folio_id, garment_id)\n           VALUES (?, ?)", [folioId, garmentId])];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    // Ignore duplicate key errors (association already exists)
                    if (error_1.code !== 'ER_DUP_ENTRY') {
                        throw error_1;
                    }
                    return [3 /*break*/, 10];
                case 10:
                    garmentIds.push(garmentId);
                    _a.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 3];
                case 12:
                    garmentsByFolio.set(folioId, garmentIds);
                    console.log("  \u2713 Created ".concat(quantity, " garments for folio ").concat(folioId));
                    _a.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 1];
                case 14: return [2 /*return*/, garmentsByFolio];
            }
        });
    });
}
function seedRoutes(connection, sectionIds) {
    return __awaiter(this, void 0, void 0, function () {
        var routes, routeMap, _i, routes_1, route, result, routeId, i, i, selectedSections, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n🛣️ Seeding routes...");
                    routes = [
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
                    routeMap = new Map();
                    _i = 0, routes_1 = routes;
                    _a.label = 1;
                case 1:
                    if (!(_i < routes_1.length)) return [3 /*break*/, 18];
                    route = routes_1[_i];
                    return [4 /*yield*/, connection.execute("INSERT INTO routes (name, description, is_active) VALUES (?, ?, TRUE)", [route.name, route.description])];
                case 2:
                    result = (_a.sent())[0];
                    routeId = result.insertId;
                    routeMap.set(route.name, routeId);
                    if (!(route.name === "Ruta Standard")) return [3 /*break*/, 7];
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < sectionIds.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, connection.execute("INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)\n           VALUES (?, ?, ?, TRUE)", [routeId, sectionIds[i], i + 1])];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 16];
                case 7:
                    if (!(route.name === "Ruta Expedita")) return [3 /*break*/, 12];
                    i = 0;
                    _a.label = 8;
                case 8:
                    if (!(i < 3)) return [3 /*break*/, 11];
                    return [4 /*yield*/, connection.execute("INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)\n           VALUES (?, ?, ?, TRUE)", [routeId, sectionIds[i], i + 1])];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 16];
                case 12:
                    selectedSections = [sectionIds[0], sectionIds[1], sectionIds[3]];
                    i = 0;
                    _a.label = 13;
                case 13:
                    if (!(i < selectedSections.length)) return [3 /*break*/, 16];
                    return [4 /*yield*/, connection.execute("INSERT INTO route_sections (route_id, section_id, sequence_order, is_active)\n           VALUES (?, ?, ?, TRUE)", [routeId, selectedSections[i], i + 1])];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15:
                    i++;
                    return [3 /*break*/, 13];
                case 16:
                    console.log("  \u2713 Created route: ".concat(route.name));
                    _a.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 1];
                case 18: return [2 /*return*/, routeMap];
            }
        });
    });
}
function seedProcesses(connection, sectionIds) {
    return __awaiter(this, void 0, void 0, function () {
        var processBySectionMap, processTemplates, _i, processTemplates_1, template, sectionId, processIds, _a, _b, proc, result;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("\n⚙️ Seeding processes...");
                    processBySectionMap = new Map();
                    processTemplates = [
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
                    _i = 0, processTemplates_1 = processTemplates;
                    _c.label = 1;
                case 1:
                    if (!(_i < processTemplates_1.length)) return [3 /*break*/, 7];
                    template = processTemplates_1[_i];
                    sectionId = sectionIds[template.sectionIndex];
                    processIds = [];
                    _a = 0, _b = template.processes;
                    _c.label = 2;
                case 2:
                    if (!(_a < _b.length)) return [3 /*break*/, 5];
                    proc = _b[_a];
                    return [4 /*yield*/, connection.execute("INSERT INTO processes (section_id, name, description, type, is_active)\n         VALUES (?, ?, ?, ?, TRUE)", [sectionId, proc.name, proc.description, proc.type])];
                case 3:
                    result = (_c.sent())[0];
                    processIds.push(result.insertId);
                    console.log("  \u2713 Created process: ".concat(proc.name, " in section ").concat(sectionId));
                    _c.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5:
                    processBySectionMap.set(sectionId, processIds);
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, processBySectionMap];
            }
        });
    });
}
function seedFolioProcesses(connection, folioIds, garmentsByFolio, processBySectionMap, routeMap) {
    return __awaiter(this, void 0, void 0, function () {
        var processCount, folioIdx, folioId, garmentIds, routeName, routeId, routeData, _i, routeData_1, route, routeSectionId, sectionId, processIds, i, garmentId, processId, status_1, totalQuantity, completedQuantity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n🔧 Seeding folio processes...");
                    processCount = 0;
                    folioIdx = 0;
                    _a.label = 1;
                case 1:
                    if (!(folioIdx < folioIds.length)) return [3 /*break*/, 9];
                    folioId = folioIds[folioIdx];
                    garmentIds = garmentsByFolio.get(folioId) || [];
                    routeName = folioIdx % 3 === 0 ? "Ruta Standard" : "Ruta Expedita";
                    routeId = routeMap.get(routeName);
                    return [4 /*yield*/, connection.execute("SELECT rs.id, rs.section_id, rs.sequence_order\n       FROM route_sections rs\n       WHERE rs.route_id = ? AND rs.is_active = TRUE\n       ORDER BY rs.sequence_order", [routeId])];
                case 2:
                    routeData = (_a.sent())[0];
                    _i = 0, routeData_1 = routeData;
                    _a.label = 3;
                case 3:
                    if (!(_i < routeData_1.length)) return [3 /*break*/, 8];
                    route = routeData_1[_i];
                    routeSectionId = route.id;
                    sectionId = route.section_id;
                    processIds = processBySectionMap.get(sectionId) || [];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < Math.min(3, garmentIds.length))) return [3 /*break*/, 7];
                    garmentId = garmentIds[i];
                    processId = processIds[0];
                    if (!processId) return [3 /*break*/, 6];
                    status_1 = i % 3 === 0 ? "COMPLETED" : "IN_PROGRESS";
                    totalQuantity = 5;
                    completedQuantity = status_1 === "COMPLETED" ? 5 : 2;
                    return [4 /*yield*/, connection.execute("INSERT INTO folio_processes\n             (folio_id, garment_id, process_id, route_section_id, status, total_quantity, completed_quantity)\n             VALUES (?, ?, ?, ?, ?, ?, ?)", [
                            folioId,
                            garmentId,
                            processId,
                            routeSectionId,
                            status_1,
                            totalQuantity,
                            completedQuantity
                        ])];
                case 5:
                    _a.sent();
                    processCount++;
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    folioIdx++;
                    return [3 /*break*/, 1];
                case 9:
                    console.log("  \u2713 Created ".concat(processCount, " folio process records"));
                    return [2 /*return*/];
            }
        });
    });
}
function seedDeliveryDates(connection, folioIds) {
    return __awaiter(this, void 0, void 0, function () {
        var count, _i, folioIds_2, folioId, i, daysFromNow, dueDate, notes, isActive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n📅 Seeding delivery dates...");
                    count = 0;
                    _i = 0, folioIds_2 = folioIds;
                    _a.label = 1;
                case 1:
                    if (!(_i < folioIds_2.length)) return [3 /*break*/, 6];
                    folioId = folioIds_2[_i];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < 2)) return [3 /*break*/, 5];
                    daysFromNow = 30 + i * 15;
                    dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
                    notes = i === 0 ? "Original delivery date" : "Revised delivery date";
                    isActive = i === 0;
                    return [4 /*yield*/, connection.execute("INSERT INTO delivery_dates (folio_id, due_date, notes, is_active)\n         VALUES (?, ?, ?, ?)", [folioId, dueDate, notes, isActive])];
                case 3:
                    _a.sent();
                    count++;
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("  \u2713 Created ".concat(count, " delivery date records"));
                    return [2 /*return*/];
            }
        });
    });
}
function seedAuditLogs(connection, userIds, folioIds) {
    return __awaiter(this, void 0, void 0, function () {
        var auditLogs, _i, auditLogs_1, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\n📝 Seeding audit logs...");
                    auditLogs = [
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
                    _i = 0, auditLogs_1 = auditLogs;
                    _a.label = 1;
                case 1:
                    if (!(_i < auditLogs_1.length)) return [3 /*break*/, 4];
                    log = auditLogs_1[_i];
                    return [4 /*yield*/, connection.execute("INSERT INTO audit_log\n       (action, entity_type, entity_id, user_id, old_value, new_value, description)\n       VALUES (?, ?, ?, ?, ?, ?, ?)", [
                            log.action,
                            log.entity_type,
                            log.entity_id,
                            log.user_id,
                            log.old_value || null,
                            log.new_value || null,
                            log.description
                        ])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("  \u2713 Created ".concat(auditLogs.length, " audit log records"));
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, arguments, void 0, function (config) {
        var connection, roleIds, sectionIds, userIds, clientIds, projectIds, folioIds, garmentsByFolio, routeMap, processBySectionMap, error_2;
        if (config === void 0) { config = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 17, 18, 20]);
                    console.log("🌱 Starting database seeding...\n");
                    return [4 /*yield*/, pool.getConnection()];
                case 2:
                    connection = _a.sent();
                    if (!(config.clearData !== false)) return [3 /*break*/, 4];
                    return [4 /*yield*/, clearAllData()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, seedRoles(connection)];
                case 5:
                    roleIds = _a.sent();
                    return [4 /*yield*/, seedSections(connection)];
                case 6:
                    sectionIds = _a.sent();
                    return [4 /*yield*/, seedUsers(connection, roleIds, sectionIds)];
                case 7:
                    userIds = _a.sent();
                    return [4 /*yield*/, seedClients(connection)];
                case 8:
                    clientIds = _a.sent();
                    return [4 /*yield*/, seedProjects(connection, clientIds, userIds)];
                case 9:
                    projectIds = _a.sent();
                    return [4 /*yield*/, seedFolios(connection, projectIds)];
                case 10:
                    folioIds = _a.sent();
                    return [4 /*yield*/, seedGarments(connection, folioIds)];
                case 11:
                    garmentsByFolio = _a.sent();
                    return [4 /*yield*/, seedRoutes(connection, sectionIds)];
                case 12:
                    routeMap = _a.sent();
                    return [4 /*yield*/, seedProcesses(connection, sectionIds)];
                case 13:
                    processBySectionMap = _a.sent();
                    return [4 /*yield*/, seedFolioProcesses(connection, folioIds, garmentsByFolio, processBySectionMap, routeMap)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, seedDeliveryDates(connection, folioIds)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, seedAuditLogs(connection, userIds, folioIds)];
                case 16:
                    _a.sent();
                    console.log("\n✅ Database seeding completed successfully!\n");
                    console.log("📋 Test Accounts Created:");
                    console.log("  Admin:      admin@folios.com / Admin123!");
                    console.log("  Manager:    manager@folios.com / Manager123!");
                    console.log("  Supervisor: supervisor.corte@folios.com / Super123!");
                    console.log("  Operator:   operator.corte@folios.com / Operator123!");
                    console.log("  Salesman:   salesman@folios.com / Sales123!");
                    console.log("\nYou can now use these accounts to test the application!\n");
                    process.exit(0);
                    return [3 /*break*/, 20];
                case 17:
                    error_2 = _a.sent();
                    console.error("❌ Error seeding database:", error_2);
                    process.exit(1);
                    return [3 /*break*/, 20];
                case 18:
                    if (connection) {
                        connection.release();
                    }
                    return [4 /*yield*/, pool.end()];
                case 19:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 20: return [2 /*return*/];
            }
        });
    });
}
// Run the seed script
main({ clearData: true });
