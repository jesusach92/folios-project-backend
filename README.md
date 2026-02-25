# Production Control Backend MVP

Backend for Production Chain Control System - Node.js + TypeScript + Express

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Create database and tables:**
```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

4. **Start development server:**
```bash
npm run dev
```

5. **Build for production:**
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── config/          # Database and JWT configuration
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares (auth, roles)
├── repositories/    # SQL queries (no ORM)
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript interfaces and enums
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users/me` - Get current user profile
- `GET /users/list` - List all users (ADMIN only)
- `GET /users/role/:role` - Get users by role (ADMIN only)
- `POST /users/assign-section` - Assign user to section (ADMIN only)

### Folios
- `GET /folios/:id` - Get folio details
- `GET /folios/project/:projectId` - Get folios by project
- `POST /folios` - Create new folio (ADMIN, PLANNING)
- `PUT /folios/:folioId/due-date` - Update due date (ADMIN, PLANNING)
- `POST /folios/:folioId/pieces` - Create piece in folio (ADMIN, PLANNING)
- `GET /folios/:folioId/pieces` - Get pieces in folio
- `POST /folios/:folioId/close` - Close folio (ADMIN, PLANNING)

### Processes
- `GET /processes/:id` - Get process instance
- `GET /processes/piece/:pieceId` - Get processes for piece
- `POST /processes/:processInstanceId/start` - Start process (ADMIN, SECTION_CHIEF, OPERATOR)
- `POST /processes/:processInstanceId/pause` - Pause process (ADMIN, SECTION_CHIEF, OPERATOR)
- `POST /processes/:processInstanceId/progress` - Update progress (ADMIN, SECTION_CHIEF, OPERATOR)
- `GET /processes/:processInstanceId/history` - Get progress history
- `GET /processes/section/:sectionId` - Get processes by section

## Environment Variables

```
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=production_control

JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRATION=24h

LOG_LEVEL=info
```

## Key Features

- **JWT Authentication** with role-based access control
- **Modular architecture** with clean separation of concerns
- **Direct SQL queries** using mysql2/promise (no ORM)
- **Audit logging** for all state changes and updates
- **Process management** with quantity tracking
- **Due date history** tracking with user and reason
- **Progress updates** for incremental process completion
- **Role-based access** with 6 user roles

## Roles

- **ADMIN** - Full system access
- **PLANNING** - Project and folio management
- **SECTION_CHIEF** - Section-level operations
- **OPERATOR** - Process execution
- **SALES** - Sales-related operations
- **MANAGEMENT** - Management reports

## Process Types

- **POR_CANTIDAD** - Quantity-based processes with partial completion
- **UNITARIO** - Unit processes (quantity = 1)

## Critical Business Rules

1. Folio closes only when ALL pieces completed ALL processes
2. Quantity tracking for POR_CANTIDAD processes
3. UNITARIO processes don't handle quantity
4. Simultaneous processes in same section must complete before advancing
5. All changes are audited with user, timestamp, and reason

## Type Safety

Full TypeScript support with strict mode enabled. All entities have proper typing.

## Email Credentials

Default admin account (must be created via register endpoint):
- Email: admin@example.com
- Password: Set during registration
- Role: ADMIN
