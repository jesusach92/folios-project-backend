# API Documentation - Garments & Folios (Updated)

## Overview
The API now supports a many-to-many relationship between garments and folios. A single garment can be associated with multiple folios.

## Key Changes

### Database Schema
- **garments table**: No longer has `folio_id` field
- **folio_garments table**: New junction table managing the many-to-many relationship
- **garment_code**: Now globally unique (not unique per folio)

### API Endpoints

#### 1. Create or Associate Garment to Folio
```
POST /api/folios/{folioId}/garments
```

**Description**: Creates a new garment if it doesn't exist (by garment_code), then associates it to the folio. If the garment already exists, it simply creates the association.

**Request Body**:
```json
{
  "garmentNumber": 1,
  "garmentCode": "GAR-001-0001"
}
```

**Response** (201):
```json
{
  "garment": {
    "id": 1,
    "garmentNumber": 1,
    "garmentCode": "GAR-001-0001",
    "status": "PENDING",
    "createdAt": "2026-04-29T10:00:00Z",
    "updatedAt": "2026-04-29T10:00:00Z"
  }
}
```

---

#### 2. Get Garments by Folio
```
GET /api/folios/{folioId}/garments
```

**Description**: Returns all garments associated with a specific folio.

**Response** (200):
```json
{
  "garments": [
    {
      "id": 1,
      "garmentNumber": 1,
      "garmentCode": "GAR-001-0001",
      "status": "PENDING",
      "createdAt": "2026-04-29T10:00:00Z",
      "updatedAt": "2026-04-29T10:00:00Z"
    },
    {
      "id": 2,
      "garmentNumber": 2,
      "garmentCode": "GAR-001-0002",
      "status": "IN_PROGRESS",
      "createdAt": "2026-04-29T10:01:00Z",
      "updatedAt": "2026-04-29T10:01:00Z"
    }
  ],
  "count": 2
}
```

---

#### 3. Associate Existing Garment to Folio
```
POST /api/folios/{folioId}/garments/associate
```

**Description**: Associates an existing garment to a folio. Use this when you want to reuse a garment that was previously created for another folio.

**Request Body**:
```json
{
  "garmentId": 5
}
```

**Response** (201):
```json
{
  "association": {
    "id": 10,
    "folioId": 2,
    "garmentId": 5,
    "createdAt": "2026-04-29T10:05:00Z"
  }
}
```

---

#### 4. Disassociate Garment from Folio
```
DELETE /api/folios/{folioId}/garments/{garmentId}
```

**Description**: Removes the association between a garment and a folio. The garment is NOT deleted and remains available for other folios.

**Response** (200):
```json
{
  "message": "Garment disassociated successfully"
}
```

---

## Use Cases

### Scenario 1: Create a New Garment for a Folio
```bash
curl -X POST http://localhost:3001/api/folios/1/garments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "garmentNumber": 1,
    "garmentCode": "SHIRT-RED-L"
  }'
```

### Scenario 2: Reuse an Existing Garment in Another Folio
```bash
# First, find the garment ID from another folio
# Then associate it to the new folio

curl -X POST http://localhost:3001/api/folios/2/garments/associate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "garmentId": 5
  }'
```

### Scenario 3: Remove a Garment from a Folio
```bash
curl -X DELETE http://localhost:3001/api/folios/1/garments/5 \
  -H "Authorization: Bearer <token>"
```

The garment with ID 5 is now only associated with other folios (if any), not with folio 1.

---

## Swagger Schema Definitions

### Garment Schema (Updated)
```json
{
  "Garment": {
    "type": "object",
    "properties": {
      "id": { "type": "integer" },
      "garmentNumber": { "type": "integer" },
      "garmentCode": { "type": "string" },
      "status": { "type": "string", "enum": ["PENDING", "IN_PROGRESS", "COMPLETED"] },
      "createdAt": { "type": "string", "format": "date-time" },
      "updatedAt": { "type": "string", "format": "date-time" }
    }
  }
}
```

### FolioGarment Schema (New)
```json
{
  "FolioGarment": {
    "type": "object",
    "properties": {
      "id": { "type": "integer" },
      "folioId": { "type": "integer" },
      "garmentId": { "type": "integer" },
      "createdAt": { "type": "string", "format": "date-time" }
    }
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "garmentId is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Folio not found"
}
```

---

## Benefits

✅ **Reusability**: Create a garment once and use it in multiple folios  
✅ **Flexibility**: Easily add or remove garments from folios  
✅ **Efficiency**: Reduce data duplication  
✅ **Consistency**: Garment codes are unique across the system  
✅ **Scalability**: Better data model for complex production scenarios
