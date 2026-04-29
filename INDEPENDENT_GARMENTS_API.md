# Garments Independent API Documentation

## Overview

Garments are now fully independent entities that can exist without being associated with any folio. You can:

1. **Create garments** independently without a folio
2. **Manage garments** (list, update, delete) completely separately
3. **Associate garments** to folios when needed
4. **Disassociate garments** from folios without deleting the garment
5. **Reuse garments** across multiple folios

---

## API Endpoints

### 1. Get All Garments
```
GET /api/garments
```

**Query Parameters:**
- `search` (string): Search by garment code (partial match)
- `status` (string): Filter by status - PENDING, IN_PROGRESS, or COMPLETED
- `sortBy` (string): Sort by 'created_at' or 'garment_code' (default: created_at)
- `sortOrder` (string): 'asc' or 'desc' (default: desc)
- `page` (integer): Page number (default: 1)
- `pageSize` (integer): Items per page (default: 50)

**Response (200):**
```json
{
  "garments": [
    {
      "id": 1,
      "garmentNumber": 1,
      "garmentCode": "SHIRT-RED-L",
      "status": "PENDING",
      "createdAt": "2026-04-29T10:00:00Z",
      "updatedAt": "2026-04-29T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 50
}
```

---

### 2. Create a New Garment
```
POST /api/garments
```

**Request Body:**
```json
{
  "garmentNumber": 1,
  "garmentCode": "SHIRT-RED-L"
}
```

**Note:** `garmentCode` must be globally unique. Creating a garment with a code that already exists will fail.

**Response (201):**
```json
{
  "garment": {
    "id": 1,
    "garmentNumber": 1,
    "garmentCode": "SHIRT-RED-L",
    "status": "PENDING",
    "createdAt": "2026-04-29T10:00:00Z",
    "updatedAt": "2026-04-29T10:00:00Z"
  }
}
```

**Error (400):**
```json
{
  "error": "Garment with this code already exists"
}
```

---

### 3. Get Garment by ID
```
GET /api/garments/{id}
```

**Response (200):**
```json
{
  "garment": {
    "id": 1,
    "garmentNumber": 1,
    "garmentCode": "SHIRT-RED-L",
    "status": "PENDING",
    "createdAt": "2026-04-29T10:00:00Z",
    "updatedAt": "2026-04-29T10:00:00Z"
  }
}
```

---

### 4. Update Garment
```
PUT /api/garments/{id}
```

**Request Body:**
```json
{
  "garmentNumber": 2,
  "status": "IN_PROGRESS"
}
```

Only the fields you want to update are required.

**Response (200):**
```json
{
  "garment": {
    "id": 1,
    "garmentNumber": 2,
    "garmentCode": "SHIRT-RED-L",
    "status": "IN_PROGRESS",
    "createdAt": "2026-04-29T10:00:00Z",
    "updatedAt": "2026-04-29T10:05:00Z"
  }
}
```

---

### 5. Delete Garment
```
DELETE /api/garments/{id}
```

**Important:** A garment can only be deleted if it's not associated with any folios.

**Response (200):**
```json
{
  "message": "Garment deleted successfully"
}
```

**Error (400):**
```json
{
  "error": "Cannot delete garment: it is associated with 2 folio(s)"
}
```

---

### 6. Get Garment Folio Associations
```
GET /api/garments/{id}/folios
```

**Description:** Shows all folios that this garment is currently associated with.

**Response (200):**
```json
{
  "associations": [
    {
      "id": 5,
      "folio_number": "FOL-001",
      "project_id": 2,
      "status": "ACTIVE",
      "associated_at": "2026-04-29T10:00:00Z"
    },
    {
      "id": 8,
      "folio_number": "FOL-002",
      "project_id": 2,
      "status": "COMPLETED",
      "associated_at": "2026-04-29T10:30:00Z"
    }
  ],
  "count": 2
}
```

---

### 7. Associate Garment to Folio
```
POST /api/garments/{id}/associate/{folioId}
```

**Description:** Associates an existing garment to a specific folio. The garment and folio must both exist.

**Response (200):**
```json
{
  "message": "Garment associated to folio successfully"
}
```

**Error (400):**
```json
{
  "error": "Cannot delete garment: it is associated with 2 folio(s)"
}
```

---

### 8. Disassociate Garment from Folio
```
DELETE /api/garments/{id}/disassociate/{folioId}
```

**Description:** Removes the association between a garment and a folio. The garment is NOT deleted.

**Response (200):**
```json
{
  "message": "Garment disassociated from folio successfully"
}
```

---

## Use Cases

### Scenario 1: Create Multiple Garments Upfront

```bash
# Create garment 1
curl -X POST http://localhost:3001/api/garments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "garmentNumber": 1,
    "garmentCode": "SHIRT-RED-L"
  }'

# Create garment 2
curl -X POST http://localhost:3001/api/garments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "garmentNumber": 2,
    "garmentCode": "SHIRT-BLUE-M"
  }'

# Create garment 3
curl -X POST http://localhost:3001/api/garments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "garmentNumber": 3,
    "garmentCode": "SHIRT-GREEN-S"
  }'
```

---

### Scenario 2: Create a Folio and Associate Existing Garments

```bash
# Create folio (separate endpoint)
curl -X POST http://localhost:3001/api/folios \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "folioNumber": "FOL-001",
    "quantity": 100,
    "dueDate": "2026-05-31"
  }'

# Associate garment 1 to folio
curl -X POST http://localhost:3001/api/garments/1/associate/5 \
  -H "Authorization: Bearer <token>"

# Associate garment 2 to folio
curl -X POST http://localhost:3001/api/garments/2/associate/5 \
  -H "Authorization: Bearer <token>"

# Associate garment 3 to folio
curl -X POST http://localhost:3001/api/garments/3/associate/5 \
  -H "Authorization: Bearer <token>"
```

---

### Scenario 3: Reuse Garments in Multiple Folios

```bash
# Associate the same garments to a different folio
curl -X POST http://localhost:3001/api/garments/1/associate/8 \
  -H "Authorization: Bearer <token>"

curl -X POST http://localhost:3001/api/garments/2/associate/8 \
  -H "Authorization: Bearer <token>"

# Check which folios garment 1 belongs to
curl http://localhost:3001/api/garments/1/folios \
  -H "Authorization: Bearer <token>"
```

**Response shows garment 1 is now in 2 folios:**
```json
{
  "associations": [
    { "id": 5, "folio_number": "FOL-001", ... },
    { "id": 8, "folio_number": "FOL-002", ... }
  ],
  "count": 2
}
```

---

### Scenario 4: Update Garment Status

```bash
curl -X PUT http://localhost:3001/api/garments/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

---

### Scenario 5: Remove Garment from Specific Folio

```bash
# Disassociate garment 1 from folio 5
curl -X DELETE http://localhost:3001/api/garments/1/disassociate/5 \
  -H "Authorization: Bearer <token>"

# Garment 1 still exists and is only in folio 8
```

---

## Key Points

✅ **Independent Creation:** Garments can be created without any folio  
✅ **Unique Codes:** Each `garmentCode` is globally unique across all garments  
✅ **Many-to-Many:** One garment can be in multiple folios  
✅ **Soft Delete:** Garments can only be deleted if they have no associations  
✅ **Audit Trail:** All operations are logged in the audit_log table  
✅ **Status Management:** You can update garment status independently  

---

## Integration with Folios

You still have the convenience endpoint in the Folios API:

```bash
POST /api/folios/{folioId}/garments
```

This endpoint will:
1. Look for the garment by code
2. If not found, create it
3. Associate it to the folio

This is useful for quick workflows where you want to create and associate in one step, but the independent endpoints give you more control.
