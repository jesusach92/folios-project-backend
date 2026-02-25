# Production Control Backend - Project Architecture

## Overview

This is a production-grade MVP backend for a Production Chain Control System built with Node.js, TypeScript, and Express.

**Stack:**
- **Runtime:** Node.js
- **Language:** TypeScript (strict mode)
- **Framework:** Express.js
- **Database:** MySQL 8.0 (with mysql2/promise)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs

## Layered Architecture

```
HTTP Request
    ↓
Routes (Entry Points)
    ↓
Controllers (Request Handlers)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
MySQL Database
```

### 1. **Routes** (`src/routes/`)
- Define HTTP endpoints
- Apply middlewares (auth, role-based access)
- Map requests to controllers
- No business logic here

### 2. **Controllers** (`src/controllers/`)
- Receive HTTP requests
- Validate input from request body/params
- Call service methods
- Return JSON responses
- Handle HTTP status codes

### 3. **Services** (`src/services/`)
- Implement business rules
- Coordinate between repositories
- Handle validation
- Perform calculations
- Manage audit trails

### 4. **Repositories** (`src/repositories/`)
- Direct SQL query execution
- No ORM (raw SQL with mysql2/promise)
- Database abstraction
- Connection pooling handled by mysql2

### 5. **Middlewares** (`src/middlewares/`)
- JWT verification
- Role-based access control
- Error handling
- Request/response transformation

## Key Files

| File | Purpose |
|------|---------|
| `src/server.ts` | Entry point - starts server |
| `src/app.ts` | Express app configuration |
| `src/config/database.ts` | MySQL connection pool |
| `src/config/jwt.ts` | JWT token generation/validation |
| `src/types/index.ts` | All TypeScript interfaces & enums |
| `src/middlewares/auth.ts` | Auth & role middlewares |
| `DATABASE_SCHEMA.sql` | Complete database schema |

## Request Flow Example

**Creating a Folio:**

```
POST /folios
  ↓
auth.routes.ts (route handler)
  ↓
FolioController.createFolio()
  ↓
FolioService.createFolio()
    - Validate input
    - Audit log entry
  ↓
FolioRepository.create()
    - Execute INSERT query
    - Return new folio
  ↓
JSON Response
```

## Core Business Entities

### Folio Workflow
```
Folio (Project delivery unit)
  ├── Due Date (can change with reason)
  ├── Contains → Pieces
  │   └── Each Piece goes through
  │       └── Process Instances
  │           ├── Type: POR_CANTIDAD or UNITARIO
  │           ├── Status tracking
  │           └── Progress Updates
```

### Process Lifecycle
```
NOT_STARTED → IN_PROGRESS → PAUSED (↔ IN_PROGRESS) → COMPLETED

Progress tracking:
- POR_CANTIDAD: Track quantity_completed / total_quantity
- UNITARIO: quantity = 1 (no partial updates)
```

### Critical Business Rules (Validated in Services)

1. **Folio Closure:**
   - Can only close when ALL pieces are COMPLETED
   - All pieces must complete ALL their processes

2. **Process Quantity:**
   - UNITARIO processes: max quantity = 1
   - POR_CANTIDAD processes: allow partial updates

3. **Simultaneous Processes:**
   - Multiple processes in same section must coordinate
   - Query `simultaneous_processes` in ProcessRepository

4. **Auditing:**
   - Every state change logged
   - Every progress update logged
   - Due date changes with reason
   - User tracking (who changed what, when)

## Authentication & Authorization

### JWT Payload
```typescript
{
  id: number;
  email: string;
  role: UserRole;
  section_id: number | null;
  iat: number;
  exp: number;
}
```

### Roles & Permissions

| Role | Can Do |
|------|--------|
| **ADMIN** | Everything |
| **PLANNING** | Create/manage folios, projects |
| **SECTION_CHIEF** | Manage section operations |
| **OPERATOR** | Execute processes, update progress |
| **SALES** | Manage clients, projects |
| **MANAGEMENT** | View reports, analytics |

### Protected Routes
```
GET /users/me ← All authenticated users
GET /users/list ← ADMIN only
POST /folios ← ADMIN, PLANNING
POST /processes/:id/progress ← ADMIN, SECTION_CHIEF, OPERATOR
```

## Direct SQL Queries

All database interactions use raw SQL (no ORM). Example:

```typescript
// From FolioRepository
async findById(id: number): Promise<Folio | null> {
  const pool = getPool();
  const [rows] = await pool.query<any[]>(
    "SELECT * FROM folios WHERE id = ?",
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}
```

**Benefits:**
- Full control over queries
- Easy to optimize
- No ORM overhead
- Explicit SQL for auditing

## Error Handling

Errors are caught at controller level and returned as JSON:

```json
{
  "error": "User not found"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## Database Connection

**Connection Pool Configuration:**
```typescript
{
  host: localhost,
  port: 3306,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true
}
```

- Max 10 concurrent connections
- Unlimited queue
- Connection reuse enabled

## Performance Considerations

### Indexes
Database schema includes indexes on:
- User email & role
- Folio project & status
- Piece folio & status
- Process instance section & status
- Audit logs entity & timestamp

### Pagination
All list endpoints support:
- `limit` query param (default: 50)
- `offset` query param (default: 0)

### N+1 Prevention
Repositories use JOINs when needed (e.g., progress history includes user names)

## Deployment

### Local Development
```bash
npm install
cp .env.example .env
docker-compose up -d  # Start MySQL
npm run dev           # Start server
```

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
```
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=produser
DB_PASSWORD=secure_password
DB_NAME=production_control
JWT_SECRET=very_long_secret_key
JWT_EXPIRATION=24h
```

## Testing Strategy

No mock data. All calls require:
1. Database setup with `DATABASE_SCHEMA.sql`
2. Valid JWT token from login
3. Proper role for endpoint
4. Valid entity IDs

## Monitoring

Health check endpoint:
```
GET /health
→ { "status": "ok", "timestamp": "2026-02-19T10:00:00Z" }
```

Audit logs capture:
- All state changes
- Progress updates
- Date modifications
- User actions with timestamps

## Future Enhancements

- API rate limiting
- Request logging middleware
- WebSocket support for real-time updates
- Export/reporting endpoints
- Backup/restore procedures
- Advanced search with Elasticsearch
- Caching layer (Redis)
- Message queues (RabbitMQ)
