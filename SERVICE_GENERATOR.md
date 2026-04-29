# Service Generator Script

This script automates the creation of the complete service structure for the Folios backend project, following the established patterns and architecture.

## Overview

The script creates a full CRUD service scaffold including:
- **Service** - Business logic layer with audit logging
- **Repository** - Data access layer with database queries
- **Controller** - HTTP request handling layer
- **Routes** - API endpoint definitions with Swagger documentation
- **Types** - TypeScript interfaces

## Usage

### Basic Command

```bash
./create-service.sh <ServiceName>
```

### Examples

```bash
# Create a Delivery service
./create-service.sh Delivery

# Create a ShippingMethod service
./create-service.sh ShippingMethod

# Create a Warehouse service
./create-service.sh Warehouse
```

**Note:** Service name must be in PascalCase (e.g., `Delivery`, `DeliveryDate`, `ShippingMethod`)

## What Gets Created

For a service named `Delivery`, the script creates:

### Files
```
src/
├── services/
│   └── DeliveryService.ts          # Business logic with CRUD operations
├── repositories/
│   └── DeliveryRepository.ts       # Database queries
├── controllers/
│   └── DeliveryController.ts       # HTTP request handling
├── routes/
│   └── delivery.routes.ts          # API endpoint definitions
└── types/
    └── index.ts (updated)          # TypeScript interfaces
```

### API Endpoints

```
GET    /api/deliverys              - Get all deliverys with pagination
GET    /api/deliverys/:id          - Get delivery by ID
POST   /api/deliverys              - Create new delivery
PUT    /api/deliverys/:id          - Update delivery
DELETE /api/deliverys/:id          - Delete delivery
```

## Generated Code Structure

### Service Layer (`DeliveryService.ts`)

```typescript
export class DeliveryService {
  async getAll(filters): Promise<{ deliverys, total, page, pageSize }>
  async getById(id): Promise<Delivery>
  async create(data, userId): Promise<Delivery>
  async update(id, data, userId): Promise<Delivery>
  async delete(id, userId): Promise<void>
}
```

### Repository Layer (`DeliveryRepository.ts`)

```typescript
export class DeliveryRepository {
  async findAll(filters): Promise<{ deliverys, total }>
  async findById(id): Promise<Delivery | null>
  async create(data): Promise<Delivery>
  async update(id, data): Promise<Delivery>
  async delete(id): Promise<void>
}
```

### Controller Layer (`DeliveryController.ts`)

```typescript
export class DeliveryController {
  async getAll(req, res): Promise<void>
  async getById(req, res): Promise<void>
  async create(req, res): Promise<void>
  async update(req, res): Promise<void>
  async delete(req, res): Promise<void>
}
```

### Routes (`delivery.routes.ts`)

- Full REST API with Swagger documentation
- Authentication middleware on all endpoints
- Proper HTTP status codes and error handling

## Post-Generation Steps

After running the script, complete these steps to integrate your service:

### 1. Create Database Table

Create a migration file or run SQL directly:

```sql
CREATE TABLE deliverys (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Important:** Customize columns based on your service requirements.

### 2. Update Repository (`src/repositories/DeliveryRepository.ts`)

Customize the SQL queries and filter logic:

```typescript
// Update columns and table name
const query = `INSERT INTO deliverys (name, status, user_id, created_at, updated_at) 
              VALUES (?, ?, ?, NOW(), NOW())`;

// Add specific filter logic
if (filters.status) {
  whereConditions.push("status = ?");
  params.push(filters.status);
}
```

### 3. Update Types (`src/types/index.ts`)

Define your service's properties:

```typescript
export interface Delivery {
  id: number;
  name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
```

### 4. Register Routes (`src/app.ts`)

Add the routes to your Express app:

```typescript
import deliveryRoutes from './routes/delivery.routes';

// Add this line with other route registrations
app.use('/api/deliverys', deliveryRoutes);
```

### 5. Build and Test

```bash
npm run build
npm start
```

## Naming Conventions

The script automatically handles naming conversions:

| Input        | PascalCase   | camelCase    | snake_case   | Plural      |
|--------------|-------------|-------------|-------------|------------|
| `Delivery`   | Delivery    | delivery    | delivery    | deliverys  |
| `ShippingMethod` | ShippingMethod | shippingMethod | shipping_method | shipping_methods |
| `DeliveryDate`   | DeliveryDate   | deliveryDate   | delivery_date   | delivery_dates |

## File Structure Explanation

### Service Layer Responsibilities

- **Business Logic:** All application rules and validations
- **Audit Logging:** Tracks all changes (CREATE, UPDATE, DELETE, STATE_CHANGE)
- **Error Handling:** Proper exception throwing with messages
- **Pagination:** Handles page/pageSize parameters

### Repository Layer Responsibilities

- **Database Queries:** All SQL operations
- **Type Safety:** Proper TypeScript types for database results
- **Filter Building:** Constructs WHERE clauses from filter objects
- **Pool Management:** Uses getPool() from database config

### Controller Layer Responsibilities

- **HTTP Handling:** Processes request/response
- **Parameter Extraction:** Gets filters, IDs, and body data from requests
- **Status Codes:** Returns appropriate HTTP status codes
- **Error Response:** Formats errors for API clients

### Routes Layer Responsibilities

- **Endpoint Definition:** Defines all CRUD routes
- **Middleware:** Applies authentication and other middleware
- **Swagger Docs:** Documents endpoints with OpenAPI spec
- **Route Handlers:** Maps HTTP methods to controller methods

## Features Included

✅ **Pagination** - Built-in page/pageSize support  
✅ **Search** - Generic search functionality  
✅ **Sorting** - Dynamic sort by field and order  
✅ **Audit Logging** - Automatic change tracking  
✅ **Authentication** - All routes protected with authMiddleware  
✅ **Error Handling** - Try-catch with proper status codes  
✅ **Swagger Docs** - Auto-generated API documentation  
✅ **TypeScript** - Full type safety  

## Common Customizations

### Add Status Filter

```typescript
// In Repository findAll()
if (filters.status) {
  whereConditions.push("status = ?");
  params.push(filters.status);
}
```

### Add Project Filtering

```typescript
// In Repository findAll()
if (filters.projectId) {
  whereConditions.push("project_id = ?");
  params.push(filters.projectId);
}
```

### Modify Audit Action

```typescript
// In Service
await this.auditRepository.log(
  AuditAction.STATE_CHANGE,  // Different action type
  "DELIVERY",
  id,
  userId,
  `Status changed from ${oldStatus} to ${newStatus}`,
  oldStatus,
  newStatus
);
```

## Troubleshooting

### Error: Service name must be in PascalCase

Make sure the service name starts with uppercase:
```bash
# ❌ Wrong
./create-service.sh delivery

# ✅ Correct
./create-service.sh Delivery
```

### Error: package.json not found

Run the script from the backend directory:
```bash
cd folios-project/backend
./create-service.sh Delivery
```

### Files not created

Ensure the script has execute permissions:
```bash
chmod +x create-service.sh
```

## Related Files

- **Database Config:** `src/config/database.ts`
- **Logger Config:** `src/config/logger.ts`
- **Audit Repository:** `src/repositories/AuditRepository.ts`
- **Auth Middleware:** `src/middlewares/auth.ts`
- **Types:** `src/types/index.ts`
- **Main App:** `src/app.ts`

## Example: Complete Flow

1. **Generate Service**
   ```bash
   ./create-service.sh Payment
   ```

2. **Create Database Table**
   ```sql
   CREATE TABLE payments (
     id INT PRIMARY KEY AUTO_INCREMENT,
     amount DECIMAL(10,2),
     status VARCHAR(50),
     folio_id INT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

3. **Update Repository**
   - Customize SQL queries
   - Add Payment-specific columns

4. **Update Types**
   ```typescript
   export interface Payment {
     id: number;
     amount: number;
     status: 'PENDING' | 'COMPLETED' | 'FAILED';
     folio_id: number;
     created_at: Date;
     updated_at: Date;
   }
   ```

5. **Register in app.ts**
   ```typescript
   import paymentRoutes from './routes/payment.routes';
   app.use('/api/payments', paymentRoutes);
   ```

6. **Build & Test**
   ```bash
   npm run build
   npm start
   ```

## API Response Format

### Success Response (GET /api/payments)
```json
{
  "payments": [...],
  "total": 50,
  "page": 1,
  "pageSize": 50
}
```

### Single Item Response (GET /api/payments/1)
```json
{
  "payment": {
    "id": 1,
    "amount": 100.50,
    "status": "COMPLETED",
    "folio_id": 5,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

### Create Response (POST /api/payments)
```json
{
  "payment": {
    "id": 51,
    "amount": 150.00,
    "status": "PENDING",
    "folio_id": 10,
    "created_at": "2025-01-20T14:22:00Z",
    "updated_at": "2025-01-20T14:22:00Z"
  }
}
```

## Version

Script Version: 2.0  
Created: 2025-01-29  
Last Updated: 2025-01-29  
Compatible with: folios-project backend structure

---

For questions or issues, refer to the ARCHITECTURE.md file or check existing services like FolioService for reference implementations.
