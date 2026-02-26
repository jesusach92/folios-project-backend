# Scripts Utilities Documentation

This folder contains utility scripts for database seeding and data management.

## 📂 Files

### `seedData.ts`
Main CLI script for seeding the database with test data.

**Features:**
- Clears existing data
- Creates roles, users, and sections
- Generates clients and projects
- Creates folios with garments
- Sets up production routes
- Generates processes and audit logs
- Shows available test accounts

**Usage:**
```bash
npm run seed
```

**Output:**
```
🌱 Starting database seeding...
✅ Database seeding completed successfully!

📋 Test Accounts Created:
  Admin:      admin@folios.com / Admin123!
  Manager:    manager@folios.com / Manager123!
  ...
```

---

### `seedDatabase.ts`
Reusable database seeding logic exported as a module.

**Purpose:**
- Exportable function for use in API endpoints
- Can be imported by DemoController
- Shared database seeding logic between CLI and API

**Usage:**
```typescript
import { seedDatabase } from './seedDatabase';

const connection = await pool.getConnection();
await seedDatabase(connection);
```

---

## 🔍 Data Generated

### Hierarchy
```
Users (8 total)
├── ADMIN (1)
├── MANAGER (1)  
├── SUPERVISOR (3)
├── OPERATOR (2)
└── SALESMAN (1)

Sections (5)
├── Corte
├── Confección
├── Acabado
├── Empaque
└── Almacén

Clients (4)
└── Projects (4)
    └── Folios (5)
        └── Garments (2,750)

Routes (3)
├── Ruta Standard
├── Ruta Expedita
└── Ruta Custom

Processes (11 total)
├── Corte: 2
├── Confección: 3
├── Acabado: 2
├── Empaque: 1
└── Almacén: 1
```

---

## 👥 Test Accounts

| User | Email | Password | Role | Permissions |
|------|-------|----------|------|------------|
| Admin | admin@folios.com | Admin123! | ADMIN | Full system access |
| Manager | manager@folios.com | Manager123! | MANAGER | Project & folio management |
| Super Corte | supervisor.corte@folios.com | Super123! | SUPERVISOR | Corte section supervision |
| Super Confección | supervisor.confeccion@folios.com | Super123! | SUPERVISOR | Confección section supervision |
| Super Acabado | supervisor.acabado@folios.com | Super123! | SUPERVISOR | Acabado section supervision |
| Operator Corte | operator.corte@folios.com | Operator123! | OPERATOR | Process execution in Corte |
| Operator Confección | operator.confeccion@folios.com | Operator123! | OPERATOR | Process execution in Confección |
| Salesman | salesman@folios.com | Sales123! | SALESMAN | Project creation |

---

## 🔄 Usage Patterns

### Pattern 1: Initial Setup (Recommended)
```bash
# 1. Create database
mysql -u root -p folios_db < DATABASE_SCHEMA.sql

# 2. Load test data
npm run seed

# 3. Start server
npm run dev
```

### Pattern 2: Reset During Development
```bash
# Quick reset without restart
npm run seed

# Or via API
curl -X POST http://localhost:3001/api/admin/demo/reset
```

### Pattern 3: Custom Seed Script
```typescript
// scripts/customSeed.ts
import mysql from 'mysql2/promise';
import { seedDatabase } from './seedDatabase';

async function customSeed() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'folios_db'
  });
  
  const connection = await pool.getConnection();
  try {
    // Your custom logic here
    await seedDatabase(connection);
  } finally {
    connection.release();
    await pool.end();
  }
}

customSeed();
```

Then run:
```bash
npx ts-node scripts/customSeed.ts
```

---

## 🛠️ Customization

### Modify Number of Records

Edit `seedData.ts`:

```typescript
// Change number of projects
const projects = [
  // ... 4 projects by default
  // Add more here
];

// Change folio quantities
const folios = [
  {
    folio_number: "FOL-2024-001",
    project_id: projectIds[0],
    quantity: 500,  // ← Change this number
    status: "ACTIVE"
  },
  // ...
];
```

Then run:
```bash
npm run seed
```

### Add Custom Clients

```typescript
const clients = [
  {
    name: "Your New Client",
    contact_email: "contact@yourclient.com",
    phone: "+1 234 567 8900",
    address: "123 Main St"
  },
  // ... existing clients
];
```

### Add Custom Processes

```typescript
const processTemplates = [
  {
    sectionIndex: 0,  // Corte
    processes: [
      {
        name: "Your New Process",
        description: "Description here",
        type: "POR_CANTIDAD"  // or "UNITARIO"
      },
      // ... existing processes
    ]
  },
  // ... rest of sections
];
```

---

## 🧪 Testing

### Verify Seeding Success

```bash
# Check if data was created
mysql -u root -p -e "SELECT COUNT(*) as users FROM folios_db.users;"
mysql -u root -p -e "SELECT COUNT(*) as clients FROM folios_db.clients;"
mysql -u root -p -e "SELECT COUNT(*) as folios FROM folios_db.folios;"
mysql -u root -p -e "SELECT COUNT(*) as garments FROM folios_db.garments;"
```

Expected output:
```
+-------+
| users |
+-------+
|     8 |
+-------+

users: 4
folios: 5
garments: 2750
```

### Test Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@folios.com",
    "password": "Admin123!"
  }'
```

---

## 📊 Database Statistics After Seeding

| Table | Count |
|-------|-------|
| roles | 5 |
| users | 8 |
| sections | 5 |
| clients | 4 |
| projects | 4 |
| folios | 5 |
| garments | 2750 |
| routes | 3 |
| route_sections | 11 |
| processes | 11 |
| folio_routes | 5 |
| folio_processes | 45 |
| delivery_dates | 10 |
| audit_log | 3 |

---

## 🚨 Common Issues

### Issue: "ENOENT: no such file or directory"
**Solution:** Make sure you're in the `backend` directory:
```bash
cd backend
npm run seed
```

### Issue: "Cannot find module 'bcryptjs'"
**Solution:** Install dependencies:
```bash
npm install
npm run seed
```

### Issue: "ER_BAD_DB_ERROR"
**Solution:** Create database first:
```bash
mysql -u root -p folios_db < DATABASE_SCHEMA.sql
npm run seed
```

### Issue: "ER_ACCESS_DENIED_ERROR"
**Solution:** Update `.env` with correct credentials:
```env
DB_USER=root
DB_PASSWORD=your_password
```

---

## 📖 Related Documentation

- [TEST_DATA_GUIDE.md](../TEST_DATA_GUIDE.md) - Complete guide
- [QUICK_START_TEST_DATA.md](../QUICK_START_TEST_DATA.md) - Quick start
- [FRONTEND_TEST_DATA_INTEGRATION.md](../FRONTEND_TEST_DATA_INTEGRATION.md) - UI integration
- [DATABASE_SCHEMA.sql](../DATABASE_SCHEMA.sql) - Database schema

---

## 🔐 Security Notes

- Test accounts and seeding scripts are **development only**
- Do NOT use in production
- Passwords are hardcoded for testing purposes only
- Use proper authentication in production environments

---

## 📝 Maintenance

### Update Test Data When...
- Model schema changes
- New entity types added
- Business logic changes
- Testing new features

### Steps to Update:
1. Edit `seedDatabase.ts` with new data
2. Test locally: `npm run seed`
3. Verify data: Check database stats
4. Commit changes to version control

---

Created: 2024
Folder: `backend/scripts/`
Database: MySQL 8.0+
Framework: Node.js + Express + TypeScript
