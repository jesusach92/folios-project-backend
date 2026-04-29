# Garments Routes - Final Structure

## 📋 Resumen de Cambios

Se han **eliminado las rutas redundantes** de garments dentro de folios y se ha establecido una **estructura clara y centralizada** para la gestión de prendas.

### ❌ Rutas Eliminadas (Eran redundantes)

**De `/api/folios/{folioId}/garments`:**
- ~~POST /api/folios/{folioId}/garments~~ - Crear o asociar prenda a folio
- ~~POST /api/folios/{folioId}/garments/associate~~ - Asociar prenda existente
- ~~DELETE /api/folios/{folioId}/garments/{garmentId}~~ - Desasociar prenda

### ✅ Rutas Finales (Todas centralizadas en `/api/garments`)

| Método | Ruta | Descripción | Requiere Asociación |
|--------|------|-------------|----------------------|
| **GET** | `/api/garments` | Listar todas las prendas con filtros y paginación | No |
| **POST** | `/api/garments` | Crear nueva prenda (sin asociar a folio) | No |
| **GET** | `/api/garments/{id}` | Obtener prenda por ID | No |
| **PUT** | `/api/garments/{id}` | Actualizar número o estado de prenda | No |
| **DELETE** | `/api/garments/{id}` | Eliminar prenda (solo si no tiene asociaciones) | No |
| **GET** | `/api/garments/{id}/folios` | Ver folios asociados a la prenda | No |
| **POST** | `/api/garments/{id}/associate/{folioId}` | Asociar prenda a folio | Sí |
| **DELETE** | `/api/garments/{id}/disassociate/{folioId}` | Desasociar prenda de folio | Sí |

### 📍 Rutas de Folios (Solo lectura de contexto)

| Método | Ruta | Descripción |
|--------|------|-------------|
| **GET** | `/api/folios/{folioId}/garments` | Listar prendas del folio (READ-ONLY) |

## 💡 Flujo de Trabajo Recomendado

### Crear prendas primero (independientes):
```bash
POST /api/garments
{
  "garmentNumber": 1,
  "garmentCode": "PRENDA-001"
}
```

### Crear folio:
```bash
POST /api/folios
{
  "projectId": 1,
  "folioNumber": "FOLIO-001",
  "quantity": 10,
  "dueDate": "2026-05-15"
}
```

### Asociar prenda existente al folio:
```bash
POST /api/garments/1/associate/1
```

### Reutilizar la misma prenda en otro folio:
```bash
POST /api/garments/1/associate/2
```

### Ver prendas de un folio:
```bash
GET /api/folios/1/garments
```

## 🎯 Ventajas de Esta Estructura

✅ **Sin redundancia**: Un único lugar para cada operación  
✅ **Gestión independiente**: Crear prendas sin folios  
✅ **Reutilización**: Asociar la misma prenda a múltiples folios  
✅ **Claridad**: Operaciones de lectura de contexto separadas  
✅ **Escalabilidad**: Fácil agregar nuevas operaciones  

## 📊 Ejemplo de Swagger

En Swagger verás:

**Garments Section** (8 endpoints):
- CRUD completo
- Gestión de asociaciones
- Consultas

**Folios Section** (1 endpoint de garments):
- Solo GET para ver prendas en contexto del folio

## 🔗 Referencias

- Implementación: [garments.routes.ts](src/routes/garments.routes.ts)
- Controlador: [GarmentController.ts](src/controllers/GarmentController.ts)  
- Servicio: [GarmentService.ts](src/services/GarmentService.ts)
- Documentación API: [INDEPENDENT_GARMENTS_API.md](INDEPENDENT_GARMENTS_API.md)
