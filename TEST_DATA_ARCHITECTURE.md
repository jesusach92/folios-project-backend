# Test Data Architecture & Flow

Arquitectura completa del sistema de datos de prueba.

## 🏗️ Arquitectura General

```
┌────────────────────────────────────────────────────────────────┐
│                     TEST DATA SYSTEM                            │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐                 ┌─────────────────────┐   │
│  │   CLI Script    │                 │   REST API          │   │
│  │   (seedData.ts) │                 │   (/api/.../demo)   │   │
│  │                 │                 │                     │   │
│  │  npm run seed   │                 │   POST /reset       │   │
│  └────────┬────────┘                 │   GET /accounts     │   │
│           │                          │   GET /stats        │   │
│           │                          └────────────┬────────┘   │
│           │                                       │             │
│           └───────┬──────────────────────────────┘             │
│                   │                                             │
│                   ▼                                             │
│           ┌──────────────────────────────┐                     │
│           │  Shared Logic                │                     │
│           │ (seedDatabase.ts)            │                     │
│           │                              │                     │
│           │ - seedDatabase()             │                     │
│           │ - Clear DB                   │                     │
│           │ - Seed all entities          │                     │
│           └──────────────┬───────────────┘                     │
│                          │                                      │
│                          ▼                                      │
│           ┌──────────────────────────────┐                     │
│           │    MySQL Database            │                     │
│           │    (folios_db)               │                     │
│           │                              │                     │
│           │ - 2,750+ records             │                     │
│           │ - 13 tables                  │                     │
│           │ - Complete schema            │                     │
│           └──────────────────────────────┘                     │
│                                                                  │
│  ┌─────────────────┐                 ┌─────────────────────┐   │
│  │   UI Component  │                 │   Documentation     │   │
│  │   DemoManager   │                 │   (4 guides)        │   │
│  │   (React)       │                 │                     │   │
│  │   (Próximo)     │                 │   - TEST_DATA_...   │   │
│  └─────────────────┘                 │   - QUICK_START_... │   │
│                                       │   - FRONTEND_...    │   │
│                                       │   - scripts/README  │   │
│                                       └─────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Ejecución

### Flujo 1: CLI (npm run seed)

```
┌──────────────────┐
│  npm run seed    │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ seedData.ts                              │
│ - Lee variables de .env                  │
│ - Conecta a MySQL                        │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ seedDatabase(connection)                 │
│                                          │
│ 1. TRUNCATE all tables                   │
│ 2. INSERT roles (5)                      │
│ 3. INSERT sections (5)                   │
│ 4. INSERT users (8)                      │
│ 5. INSERT clients (4)                    │
│ 6. INSERT projects (4)                   │
│ 7. INSERT folios (5)                     │
│ 8. INSERT garments (2,750)               │
│ 9. INSERT routes (3)                     │
│ 10. INSERT processes (11)                │
│ 11. INSERT folio_routes (5)              │
│ 12. INSERT folio_processes (45)          │
│ 13. INSERT delivery_dates (10)           │
│ 14. INSERT audit_log (3+)                │
└────────┬────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Database State: ✅ Ready             │
│ - All tables populated               │
│ - 2,750+ records                     │
│ - Relationships established          │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Console Output:                      │
│ ✅ Database seeding completed!       │
│ 📋 Test Accounts:                    │
│    admin@folios.com / Admin123!      │
│    manager@folios.com / Manager123!  │
│    ...                               │
└──────────────────────────────────────┘
```

### Flujo 2: API (POST /api/admin/demo/reset)

```
┌─────────────────────────────────────────────┐
│ HTTP POST /api/admin/demo/reset             │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ DemoController.resetDemoData()              │
│ - Check NODE_ENV (must be dev)              │
│ - Get DB connection from pool               │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ seedDatabase(connection)                    │
│ (Same logic as CLI)                         │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ HTTP 200 Response                           │
│ {                                           │
│   "message": "Demo data successfully reset",│
│   "accounts": { ... }                       │
│ }                                           │
└─────────────────────────────────────────────┘
```

### Flujo 3: UI (React - Próximo)

```
┌────────────────────────────────┐
│ User clicks "Reset Demo Data"  │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Confirmation Dialog            │
│ "This will clear all data"     │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ useDemoData() hook             │
│ Call resetData()               │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ POST /api/admin/demo/reset     │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Display Success Message        │
│ Show test accounts             │
│ Auto-refresh statistics        │
└────────────────────────────────┘
```

---

## 📦 Data Structure

### Entity Relationships

```
users (8)
  ├── role_id ──→ roles (5)
  └── section_id ──→ sections (5)

sections (5)
  └── (referenced by route_sections, processes)

clients (4)
  └── (referenced by projects)

projects (4)
  ├── client_id ──→ clients (4)
  ├── salesman_id ──→ users (8)
  └── (referenced by folios)

folios (5)
  ├── project_id ──→ projects (4)
  ├── (referenced by folios_routes)
  └── (referenced by garments)

garments (2,750)
  └── folio_id ──→ folios (5)

routes (3)
  └── (referenced by route_sections, folio_routes)

route_sections (11)
  ├── route_id ──→ routes (3)
  └── section_id ──→ sections (5)

processes (11)
  └── section_id ──→ sections (5)

folio_routes (5)
  ├── folio_id ──→ folios (5)
  ├── route_id ──→ routes (3)
  └── (referenced by folio_processes)

folio_processes (45)
  ├── folio_id ──→ folios (5)
  ├── garment_id ──→ garments (2,750)
  ├── process_id ──→ processes (11)
  └── route_section_id ──→ route_sections (11)

delivery_dates (10)
  └── folio_id ──→ folios (5)

audit_log (3+)
  └── user_id ──→ users (8)
```

---

## 🔗 Integration Points

### Backend Integration

```
┌───────────────────────────────────────────────┐
│ Express Application (app.ts)                  │
├───────────────────────────────────────────────┤
│                                               │
│  Routes:                                      │
│  - /api/auth → authRoutes                     │
│  - /api/users → userRoutes                    │
│  - /api/clients → clientRoutes                │
│  - /api/folios → folioRoutes                  │
│  ✨ /api/admin/demo → demoRoutes ✨           │
│                                               │
│  DemoController Methods:                      │
│  - POST /reset → resetDemoData()              │
│  - GET /accounts → getDemoAccounts()          │
│  - GET /stats → getDemoStats()                │
│                                               │
└───────────────────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────────┐
│ seedDatabase() Module                         │
│ - Shared logic                                │
│ - Importable function                        │
│ - Used by CLI and API                        │
└───────────────────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────────┐
│ MySQL Database                                │
│ - 13 tables                                   │
│ - 2,750+ records                              │
│ - Full relationships                          │
└───────────────────────────────────────────────┘
```

### Frontend Integration (Próxima)

```
┌────────────────────────────────────────────────────┐
│ React Application                                  │
├────────────────────────────────────────────────────┤
│                                                    │
│ Components:                                        │
│ ┌────────────────────────────────────────────┐   │
│ │ AdminPanel                                 │   │
│ │  ├── DemoManager ✨                        │   │
│ │  │   ├── DemoAccounts                      │   │
│ │  │   └── DemoStats                         │   │
│ │  └── ...other admin pages                  │   │
│ └────────────────────────────────────────────┘   │
│                                                    │
│ Hooks:                                             │
│ - useDemoData() ✨                                 │
│   ├── resetData()                                  │
│   ├── getAccounts()                               │
│   └── getStats()                                  │
│                                                    │
└──────────────────┬─────────────────────────────────┘
                   │
                   ▼
         API Calls to Backend:
        - POST /api/admin/demo/reset
        - GET /api/admin/demo/accounts
        - GET /api/admin/demo/stats
```

---

## 📊 Data Generation Flow

```
Create Data Structure
├── Roles (5 types)
│   └── Assign to Users
│
├── Sections (5 departments)
│   ├── Assign Supervisors
│   └── Assign Operators
│
├── Clients (4)
│   └── Assign Projects
│       └── Create Folios (5)
│           ├── Generate Garments (2,750)
│           └── Track Status
│
├── Production Routes (3)
│   └── Sequence Sections in Order
│       └── Link to Folios
│
├── Processes (11 total)
│   ├── 2 in Corte
│   ├── 3 in Confección
│   ├── 2 in Acabado
│   ├── 1 in Empaque
│   └── 1 in Almacén
│
├── Folio Processes (45)
│   └── Track Garment Progress
│
├── Delivery Dates (10)
│   └── 2 per folio
│
└── Audit Logs (3+)
    └── Track State Changes
```

---

## 🔐 Security Flows

### Development Only Check

```
Request to /api/admin/demo/reset
        │
        ▼
Check NODE_ENV
        │
      ┌─┴─┐
      │   │
   DEV    PROD
      │   │
      ▼   ▼
    ✅   ❌
  Execute  Return 403
  Reset    Forbidden
```

### Password Handling

```
seedDatabase()
      │
      ├─ plaintext password
      │      │
      │      ▼
      │ bcryptjs.hash()
      │      │
      └─→ password_hash
             │
             ▼
           Save to DB
          (Never plaintext)
```

---

## 📈 Scalability

### Current Capacity

```
Total Records: ~2,800
- Roles: 5
- Users: 8
- Sections: 5
- Clients: 4
- Projects: 4
- Folios: 5
- Garments: 2,750 ← Largest dataset
- Routes: 3
- Processes: 11
- Relations: 100+
```

### To Increase Load

Modify in `seedDatabase.ts`:

```typescript
// Increase number of folios
const folios = [
  // Add more entries...
  { folio_number: "FOL-2024-010", ... },
  { folio_number: "FOL-2024-011", ... },
];

// Increase quantity per folio
for (let i = 1; i <= 5000; i++) { // Changed from quantity
  // Generate garments...
}
```

Execution time scales linearly with record count.

---

## 🎯 Use Cases

### Use Case 1: Local Development
```
Dev → npm run seed → Fresh DB → npm run dev → Ready
```

### Use Case 2: Reset Mid-Session
```
Working → Issue with data → npm run seed → Clean slate
```

### Use Case 3: Demo Data
```
Meeting → Click Reset → Load data → Demo to client
```

### Use Case 4: Automated Testing
```
CI Pipeline → npm run seed → Run tests → Cleanup
```

### Use Case 5: Multiple Developers
```
Dev1 → npm run seed → DB reset
Dev2 → npm run seed → DB reset  (No conflicts)
Dev3 → npm run seed → DB reset
```

---

## 📝 Key Technologies

```
Scripts:
  - TypeScript  (Type safety)
  - ts-node     (Execute TS files)
  - mysql2      (Database driver)
  - bcryptjs    (Password hashing)
  - dotenv      (Config management)

Backend:
  - Express.js  (Web framework)
  - Controller  (Business logic)
  - Routes      (API endpoints)
  - Middleware  (Security)

Database:
  - MySQL 8.0+  (Data persistence)
  - InnoDB      (Referential integrity)
  - UTF8MB4     (Unicode support)

Frontend (Próximo):
  - React       (UI framework)
  - Hooks       (State management)
  - Fetch API   (HTTP client)
  - CSS Modules (Styling)
```

---

## ✅ Implementation Checklist

### Backend ✅
- [x] seedData.ts CLI script
- [x] seedDatabase.ts module
- [x] DemoController
- [x] demo.routes.ts
- [x] Integration with app.ts
- [x] package.json scripts
- [x] Documentation (4 files)

### Frontend 🔄 (Ready to implement)
- [ ] Create DemoManager component
- [ ] Create useDemoData hook
- [ ] Integrate into Admin Panel
- [ ] Add styles (CSS module)
- [ ] Register in navigation
- [ ] Test all flows

### Testing 🔄 (Optional)
- [ ] Unit tests for seeding
- [ ] API endpoint tests
- [ ] Integration tests
- [ ] E2E tests with real UI

---

Este documento proporciona una visión completa de la arquitectura y los flujos del sistema de datos de prueba.

Para implementación específica, consulta:
- [TEST_DATA_GUIDE.md](../TEST_DATA_GUIDE.md)
- [FRONTEND_TEST_DATA_INTEGRATION.md](../FRONTEND_TEST_DATA_INTEGRATION.md)
- [QUICK_START_TEST_DATA.md](../QUICK_START_TEST_DATA.md)
