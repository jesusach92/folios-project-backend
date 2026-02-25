# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Node.js 16+ installed
- MySQL 8.0 or Docker
- Git (optional)

### Step 1: Install Dependencies
```bash
cd production-control-backend
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

Update `.env` if needed (defaults work with Docker):
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=production_control
JWT_SECRET=change_this_in_production
```

### Step 3: Start MySQL (Using Docker)
```bash
docker-compose up -d
```

Or manually import schema:
```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

### Step 4: Start Development Server
```bash
npm run dev
```

Expected output:
```
✓ Database connection successful
✓ Server running on http://localhost:3000
✓ Health check: http://localhost:3000/health
```

## First API Calls

### 1. Create Admin User (Registration)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "Password123!",
    "fullName": "Admin User",
    "role": "ADMIN"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "role": "ADMIN",
    "section_id": null
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "Password123!"
  }'
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "admin@company.com",
    "role": "ADMIN",
    "section_id": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token** - you'll need it for all other requests!

### 3. Get Current User Profile
```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

### 4. Create a Client
```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "name": "Acme Corporation",
    "contactEmail": "contact@acme.com",
    "phone": "+1-555-0100",
    "address": "123 Main St, City"
  }'
```

### 5. Create a Project
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "name": "Project Alpha",
    "clientId": 1,
    "salesmanId": 1,
    "description": "Production order for client"
  }'
```

### 6. Create a Section
```bash
curl -X POST http://localhost:3000/sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "name": "Assembly Section",
    "description": "Main assembly production area"
  }'
```

### 7. Create a Folio
```bash
curl -X POST http://localhost:3000/folios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "projectId": 1,
    "folioNumber": "FOL-2026-001",
    "quantity": 100,
    "dueDate": "2026-03-20"
  }'
```

### 8. Add Pieces to Folio
```bash
curl -X POST http://localhost:3000/folios/1/pieces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "pieceNumber": 1,
    "pieceCode": "PART-001"
  }'
```

### 9. Get Folio Details
```bash
curl -X GET http://localhost:3000/folios/1 \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

## Next Steps

1. **Read the docs:**
   - [Full API Examples](API_EXAMPLES.md)
   - [Architecture Guide](ARCHITECTURE.md)
   - [README](README.md)

2. **Database:**
   - Review [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql)
   - Add test data directly via MySQL if needed

3. **Roles Setup:**
   - Create operators, section chiefs, planners
   - Assign to sections
   - Test role-based access control

4. **API Testing:**
   - Use Postman or Insomnia
   - Import the collections
   - Test all endpoints

5. **Production:**
   - Generate strong JWT_SECRET
   - Setup environment-specific configs
   - Configure database backups
   - Setup monitoring/logging
   - Deploy to production

## Troubleshooting

### "Database connection failed"
- Make sure MySQL is running: `docker-compose ps`
- Check DB credentials in `.env`
- Verify schema imported: `mysql -u root -p production_control -e "SHOW TABLES;"`

### "Invalid token" error
- Token may have expired (24 hours default)
- Login again to get new token
- Make sure Bearer prefix is included: `Authorization: Bearer <token>`

### Port 3000 already in use
- Change PORT in `.env`
- Or kill process: `lsof -i :3000` → `kill -9 <PID>`

### CORS errors
- CORS is enabled for all origins in development
- Modify `src/app.ts` for production

## Commands Reference

```bash
# Development
npm run dev              # Start with hot-reload
npm run typecheck       # Check TypeScript errors

# Production
npm run build           # Compile TypeScript
npm start               # Run compiled code

# Database
docker-compose up -d    # Start MySQL container
docker-compose down     # Stop MySQL container
docker-compose logs     # View MySQL logs
```

## Project Structure Quick Reference

```
src/
├── config/              # App configuration
├── controllers/         # HTTP request handlers
├── middlewares/         # Express middleware
├── repositories/        # Database access layer
├── routes/             # API route definitions
├── services/           # Business logic
├── types/              # TypeScript types
└── utils/              # Helpers and constants
```

## Need Help?

1. Check [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture
2. Review [API_EXAMPLES.md](API_EXAMPLES.md) for endpoint examples
3. Look at the code comments in key files
4. Check database schema: [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql)
