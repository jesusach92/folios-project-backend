// EXAMPLES: API Request Body Reference

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// POST /auth/register
{
  "email": "alice@company.com",
  "password": "SecurePassword123!",
  "fullName": "Alice Johnson",
  "role": "ADMIN",
  "sectionId": null
}

// POST /auth/login
{
  "email": "alice@company.com",
  "password": "SecurePassword123!"
}

// Response:
{
  "user": {
    "id": 1,
    "email": "alice@company.com",
    "role": "ADMIN",
    "section_id": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// ============================================
// USERS ENDPOINTS
// ============================================

// GET /users/me
// Headers: Authorization: Bearer <token>
// Response:
{
  "user": {
    "id": 1,
    "email": "alice@company.com",
    "full_name": "Alice Johnson",
    "role": "ADMIN",
    "section_id": null,
    "is_active": true,
    "created_at": "2026-02-19T10:00:00Z",
    "updated_at": "2026-02-19T10:00:00Z"
  }
}

// GET /users/list?limit=50&offset=0
// Headers: Authorization: Bearer <token>

// GET /users/role/OPERATOR
// Headers: Authorization: Bearer <token>

// POST /users/assign-section
{
  "userId": 2,
  "sectionId": 1
}

// ============================================
// FOLIOS ENDPOINTS
// ============================================

// POST /folios
{
  "projectId": 1,
  "folioNumber": "FOL-2026-001",
  "quantity": 100,
  "dueDate": "2026-03-19"
}

// Response:
{
  "folio": {
    "id": 1,
    "project_id": 1,
    "folio_number": "FOL-2026-001",
    "quantity": 100,
    "due_date": "2026-03-19",
    "status": "ACTIVE",
    "created_at": "2026-02-19T10:00:00Z",
    "updated_at": "2026-02-19T10:00:00Z"
  }
}

// POST /folios/1/pieces
{
  "pieceNumber": 1,
  "pieceCode": "PIECE-001"
}

// PUT /folios/1/due-date
{
  "newDueDate": "2026-03-25",
  "reason": "Production delay due to material shortage"
}

// GET /folios/1
// Response:
{
  "folio": {
    "id": 1,
    "project_id": 1,
    "folio_number": "FOL-2026-001",
    "quantity": 100,
    "due_date": "2026-03-19",
    "status": "ACTIVE",
    "created_at": "2026-02-19T10:00:00Z",
    "updated_at": "2026-02-19T10:00:00Z"
  }
}

// GET /folios/1/pieces
// Response:
{
  "pieces": [
    {
      "id": 1,
      "folio_id": 1,
      "piece_number": 1,
      "piece_code": "PIECE-001",
      "status": "PENDING",
      "created_at": "2026-02-19T10:00:00Z",
      "updated_at": "2026-02-19T10:00:00Z"
    }
  ],
  "count": 1
}

// POST /folios/1/close
// Headers: Authorization: Bearer <token>

// ============================================
// PROCESSES ENDPOINTS
// ============================================

// GET /processes/1
// Response:
{
  "process": {
    "id": 1,
    "piece_id": 1,
    "process_config_id": 1,
    "section_id": 1,
    "status": "NOT_STARTED",
    "total_quantity": 100,
    "completed_quantity": 0,
    "started_at": null,
    "completed_at": null,
    "created_at": "2026-02-19T10:00:00Z",
    "updated_at": "2026-02-19T10:00:00Z"
  }
}

// POST /processes/1/start
// Headers: Authorization: Bearer <token>

// POST /processes/1/progress
{
  "quantityCompleted": 25,
  "reason": "First batch completed",
  "comments": "Production ran smoothly",
  "isPartial": true
}

// Response:
{
  "message": "Progress updated successfully"
}

// POST /processes/1/progress (Complete process)
{
  "quantityCompleted": 75,
  "reason": "Final batch completed",
  "comments": "All units passed quality check",
  "isPartial": false
}

// GET /processes/1/history
// Response:
{
  "history": [
    {
      "id": 1,
      "process_instance_id": 1,
      "quantity_completed": 25,
      "updated_by_user_id": 2,
      "full_name": "Bob Smith",
      "reason": "First batch completed",
      "comments": "Production ran smoothly",
      "is_partial": true,
      "updated_at": "2026-02-19T14:00:00Z"
    },
    {
      "id": 2,
      "process_instance_id": 1,
      "quantity_completed": 75,
      "updated_by_user_id": 2,
      "full_name": "Bob Smith",
      "reason": "Final batch completed",
      "comments": "All units passed quality check",
      "is_partial": false,
      "updated_at": "2026-02-19T15:30:00Z"
    }
  ],
  "count": 2
}

// GET /processes/piece/1
// Response:
{
  "processes": [
    {
      "id": 1,
      "piece_id": 1,
      "process_config_id": 1,
      "section_id": 1,
      "status": "COMPLETED",
      "total_quantity": 100,
      "completed_quantity": 100,
      "started_at": "2026-02-19T10:00:00Z",
      "completed_at": "2026-02-19T15:30:00Z",
      "created_at": "2026-02-19T10:00:00Z",
      "updated_at": "2026-02-19T15:30:00Z"
    }
  ],
  "count": 1
}

// POST /processes/1/pause
// Headers: Authorization: Bearer <token>

// ============================================
// CURL EXAMPLES
// ============================================

// Login
// curl -X POST http://localhost:3000/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"alice@company.com","password":"SecurePassword123!"}'

// Create Folio
// curl -X POST http://localhost:3000/folios \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer <token>" \
//   -d '{"projectId":1,"folioNumber":"FOL-2026-001","quantity":100,"dueDate":"2026-03-19"}'

// Update Progress
// curl -X POST http://localhost:3000/processes/1/progress \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer <token>" \
//   -d '{"quantityCompleted":25,"reason":"First batch completed","comments":"Production ran smoothly","isPartial":true}'
