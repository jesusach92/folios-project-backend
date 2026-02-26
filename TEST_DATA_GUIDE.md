# Test Data & Demo Scripts Guide

Esta guía explica cómo crear y usar datos de prueba (test data) para el sistema de gestión de folios.

## 📋 Tabla de Contenidos

- [Opciones de Seeding de Datos](#opciones-de-seeding-de-datos)
- [Método 1: Script CLI (Recomendado)](#método-1-script-cli-recomendado)
- [Método 2: API REST Endpoint](#método-2-api-rest-endpoint)
- [Cuentas de Prueba](#cuentas-de-prueba)
- [Datos Generados](#datos-generados)
- [Estructura de Datos](#estructura-de-datos)

---

## Opciones de Seeding de Datos

Hay dos formas principales de cargar datos de prueba:

### 1. **Script de Línea de Comandos (Recomendado para desarrollo)**
- Ejecución rápida y directa
- Sin necesidad de estar viendo la UI
- Ideal para CI/CD y testing automatizado

### 2. **Endpoint REST (Ideal para UI)**
- Ejecutar desde la interfaz web
- Útil para resetear datos sin reiniciar el servidor
- Disponible solo en desarrollo

---

## Método 1: Script CLI (Recomendado)

### Instalación de Dependencias
Primero, asegúrate de que todas las dependencias estén instaladas:

```bash
cd backend
npm install
```

### Ejecutar el Script de Seed

Para cargar datos de prueba en la base de datos:

```bash
npm run seed
```

Este comando:
- ✅ Limpia todas las tablas existentes
- ✅ Crea roles, usuarios, secciones
- ✅ Genera clientes y proyectos
- ✅ Crea folios con prendas
- ✅ Configura rutas de producción
- ✅ Genera procesos y registros de auditoría
- ✅ Muestra las cuentas de prueba disponibles

**Salida esperada:**
```
🌱 Starting database seeding...

🧹 Clearing existing data...
✓ All data cleared successfully

📋 Seeding roles...
  ✓ Created role: ADMIN
  ✓ Created role: MANAGER
  ...

✅ Database seeding completed successfully!

📋 Test Accounts Created:
  Admin:      admin@folios.com / Admin123!
  Manager:    manager@folios.com / Manager123!
  Supervisor: supervisor.corte@folios.com / Super123!
  Operator:   operator.corte@folios.com / Operator123!
  Salesman:   salesman@folios.com / Sales123!
```

---

## Método 2: API REST Endpoint

### Opciones Disponibles

#### 🔄 Resetear Datos de Demostración

```bash
POST /api/admin/demo/reset
```

**cURL:**
```bash
curl -X POST http://localhost:3001/api/admin/demo/reset
```

**Respuesta:**
```json
{
  "message": "Demo data successfully reset",
  "accounts": {
    "admin": {
      "email": "admin@folios.com",
      "password": "Admin123!",
      "role": "ADMIN"
    },
    "manager": {...},
    "supervisor": {...},
    "operator": {...},
    "salesman": {...}
  }
}
```

#### ℹ️ Obtener Cuentas de Demostración

```bash
GET /api/admin/demo/accounts
```

**cURL:**
```bash
curl http://localhost:3001/api/admin/demo/accounts
```

**Respuesta:**
```json
{
  "message": "Available demo accounts",
  "accounts": {
    "admin": {
      "email": "admin@folios.com",
      "password": "Admin123!",
      "role": "ADMIN",
      "description": "Full system access"
    },
    ...
  }
}
```

#### 📊 Obtener Estadísticas de Base de Datos

```bash
GET /api/admin/demo/stats
```

**cURL:**
```bash
curl http://localhost:3001/api/admin/demo/stats
```

**Respuesta:**
```json
{
  "message": "Demo database statistics",
  "stats": {
    "users": 8,
    "roles": 5,
    "sections": 5,
    "clients": 4,
    "projects": 4,
    "folios": 5,
    "garments": 2750,
    "routes": 3,
    "processes": 11,
    "folio_routes": 5,
    "folio_processes": 45,
    "delivery_dates": 10,
    "audit_log": 3
  }
}
```

---

## Cuentas de Prueba

### Usuarios Generados

| Rol | Email | Contraseña | Sección | Descripción |
|-----|-------|-----------|---------|------------|
| **ADMIN** | admin@folios.com | Admin123! | - | Acceso total al sistema |
| **MANAGER** | manager@folios.com | Manager123! | - | Gestión de proyectos y folios |
| **SUPERVISOR** | supervisor.corte@folios.com | Super123! | Corte | Supervisión de sección |
| **SUPERVISOR** | supervisor.confeccion@folios.com | Super123! | Confección | Supervisión de sección |
| **SUPERVISOR** | supervisor.acabado@folios.com | Super123! | Acabado | Supervisión de sección |
| **OPERATOR** | operator.corte@folios.com | Operator123! | Corte | Ejecución de procesos |
| **OPERATOR** | operator.confeccion@folios.com | Operator123! | Confección | Ejecución de procesos |
| **SALESMAN** | salesman@folios.com | Sales123! | - | Creación de proyectos |

---

## Datos Generados

### Estructura Jerárquica

```
📦 Clientes (4)
  └─ 📊 Proyectos (4)
      └─ 📑 Folios (5)
          ├─ 👕 Prendas (2,750 total)
          ├─ 🛣️ Rutas de Producción (3)
          │   └─ Secciones en Secuencia
          └─ ⚙️ Procesos de Fabricación
              ├─ Corte
              ├─ Confección
              ├─ Acabado
              ├─ Empaque
              └─ Almacén
```

### Estadísticas de Datos

- **Clientes**: 4 empresas internacionales
- **Proyectos**: 4 proyectos de diferentes clientes
- **Folios**: 5 lotes de producción
- **Prendas**: 2,750 prendas individuales distribuidas en folios
- **Secciones**: 5 departamentos de producción
- **Procesos**: 11 procesos de fabricación específicos
- **Rutas**: 3 rutas de producción diferentes:
  - Ruta Standard (todas las secciones)
  - Ruta Expedita (3 secciones)
  - Ruta Custom (3 secciones selectas)
- **Estados de Progreso**: Prendas en diferentes estadios (PENDING, IN_PROGRESS, COMPLETED)

---

## Estructura de Datos

### Clientes Generados

1. **Textiles Internacionales S.A.** - Madrid, Spain
2. **Moda Global Ltd.** - São Paulo, Brazil
3. **Fashion Works Inc.** - New York, USA
4. **Confecciones del Sur** - Mexico City

### Proyectos Generados

1. Colección Primavera 2024 (500 prendas)
2. Línea Casual Premium (750 prendas)
3. Proyecto Corporativo (300 prendas)
4. Colección Verde Sustentable (200 prendas)

### Secciones de Producción

1. **Corte** - Preparación de telas y moldes
2. **Confección** - Costura y ensamblaje
3. **Acabado** - Planchado e inspección de calidad
4. **Empaque** - Preparación para envío
5. **Almacén** - Gestión de inventario

### Procesos por Sección

**Corte:**
- Corte de tela (POR_CANTIDAD)
- Preparación de moldes (UNITARIO)

**Confección:**
- Costura de piezas (POR_CANTIDAD)
- Montaje de mangas (UNITARIO)
- Costura de botones (UNITARIO)

**Acabado:**
- Planchado (UNITARIO)
- Control de calidad (UNITARIO)

**Empaque:**
- Empaque (POR_CANTIDAD)

**Almacén:**
- Etiquetado (UNITARIO)

---

## Flujos de Prueba

### Flujo 1: Ver Dashboard Completo

1. **Inicia sesión como ADMIN**
   - Email: admin@folios.com
   - Contraseña: Admin123!

2. **Explora las vistas:**
   - Dashboard general (métricas y estadísticas)
   - Lista de folios activos
   - Proyectos y clientes
   - Usuarios por sección

### Flujo 2: Seguimiento de Producción

1. **Inicia sesión como SUPERVISOR**
   - Email: supervisor.corte@folios.com
   - Contraseña: Super123!

2. **Verifica:**
   - Folios asignados a tu sección
   - Procesos en progreso
   - Prendas completadas vs pendientes

### Flujo 3: Actualizar Progreso

1. **Inicia sesión como OPERATOR**
   - Email: operator.corte@folios.com
   - Contraseña: Operator123!

2. **Realiza:**
   - Actualiza progreso de procesos
   - Marca prendas como completadas
   - Documenta razones de cambios

### Flujo 4: Crear Nuevos Proyectos

1. **Inicia sesión como SALESMAN**
   - Email: salesman@folios.com
   - Contraseña: Sales123!

2. **Crea:**
   - Nuevos proyectos
   - Asigna clientes
   - Define folios iniciales

---

## Troubleshooting

### Error: "Database connection failed"

```
❌ Database connection failed: Error
```

**Solución:**
1. Verifica que MySQL está corriendo
2. Revisa variables de .env:
   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=folios_db
   ```
3. Ejecuta:
   ```bash
   mysql -u root -p < DATABASE_SCHEMA.sql
   ```

### Error: "Foreign key constraint error"

**Solución:**
1. El script automáticamente deshabilita y rehabilita las restricciones
2. Si persiste, limpia la base de datos:
   ```bash
   mysql -u root -p -e "DROP DATABASE folios_db; CREATE DATABASE folios_db;"
   mysql -u root -p folios_db < DATABASE_SCHEMA.sql
   npm run seed
   ```

### Endpoint de reset no funciona

**Verificación:**
1. El servidor debe estar en DEV (verifica NODE_ENV)
2. Endpoint debe ser accesible: `http://localhost:3001/api/admin/demo/reset`
3. Verifica logs del servidor

---

## Desarrollo Adicional

### Modificar el Script de Seed

Edita [scripts/seedData.ts](scripts/seedData.ts) para:
- Cambiar cantidad de folios, prendas, etc.
- Agregar clientes o proyectos adicionales
- Modificar datos de procesos
- Ajustar estados iniciales

### Crear Scripts Personalizados

Crea nuevos scripts en la carpeta `scripts/`:
```typescript
// scripts/myCustomSeed.ts
import { getPool } from "../src/config/database";
import { seedDatabase } from "./seedDatabase";

async function customSeed() {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    // Tu código aquí
  } finally {
    connection.release();
    await pool.end();
  }
}

customSeed();
```

Ejecuta con:
```bash
ts-node scripts/myCustomSeed.ts
```

---

## Referencias

- [Tipos de Datos](src/types/index.ts)
- [Esquema de Base de Datos](DATABASE_SCHEMA.sql)
- [Controllers](src/controllers/)
- [Servicios](src/services/)

---

## Support

Para más información o problemas, consulta:
- README.md - Documentación general
- ARCHITECTURE.md - Arquitectura del sistema
- DATABASE_SCHEMA.sql - Esquema completo
