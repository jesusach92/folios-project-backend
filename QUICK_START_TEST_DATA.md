# ⚡ Quick Start - Test Data Setup

Guía rápida para levantar el sistema con datos de prueba en 5 minutos.

## 🚀 Inicio Rápido (5 minutos)

### Paso 1: Instalar Dependencias (1 min)

```bash
cd backend
npm install
```

### Paso 2: Configurar Base de Datos (1 min)

Asegúrate de que MySQL está corriendo:

```bash
# Windows (CMD/PowerShell)
mysql -u root -p

# O para sistemas con MySQL en PATH:
mysql -u root -p folios_db < DATABASE_SCHEMA.sql
```

**Nota:** Si no tienes credenciales, actualiza `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=folios_db
```

### Paso 3: Cargar Datos de Prueba (1 min)

```bash
npm run seed
```

Output esperado:
```
🌱 Starting database seeding...
✓ All data cleared successfully
✅ Database seeding completed successfully!

📋 Test Accounts Created:
  Admin:      admin@folios.com / Admin123!
  Manager:    manager@folios.com / Manager123!
  Operator:   operator.corte@folios.com / Operator123!
```

### Paso 4: Iniciar Servidor Backend (1 min)

```bash
npm run dev
```

El servidor estará disponible en: http://localhost:3001

### Paso 5: Iniciar Frontend (1 min)

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Accede a: http://localhost:5173

---

## 🔐 Credenciales para Prueba

### Cuenta Administrador
```
Email: admin@folios.com
Password: Admin123!
```

### Cuenta Gerente
```
Email: manager@folios.com
Password: Manager123!
```

### Cuenta Supervisor (Sección Corte)
```
Email: supervisor.corte@folios.com
Password: Super123!
```

### Cuenta Operario
```
Email: operator.corte@folios.com
Password: Operator123!
```

### Cuenta Vendedor
```
Email: salesman@folios.com
Password: Sales123!
```

---

## 🔄 Resetear Datos (Sin Reiniciar)

Si necesitas volver a cargar datos sin reiniciar el servidor:

### Opción 1: CLI (Recomendado)
```bash
npm run seed
```

### Opción 2: API Endpoint
```bash
curl -X POST http://localhost:3001/api/admin/demo/reset
```

### Opción 3: Desde UI
1. Inicia sesión como Admin
2. Ve a: Admin Panel → Demo Data
3. Haz clic en "Reset Demo Data"

---

## 📊 Datos Generados

| Entidad | Cantidad |
|---------|----------|
| Usuarios | 8 |
| Clientes | 4 |
| Proyectos | 4 |
| Folios | 5 |
| Prendas | 2,750 |
| Secciones | 5 |
| Procesos | 11 |
| Rutas de Producción | 3 |

---

## ✅ Checklist de Verificación

- [ ] MySQL está corriendo
- [ ] Base de datos `folios_db` existe
- [ ] `npm install` ejecutado en backend
- [ ] `npm run seed` completado sin errores  
- [ ] `npm run dev` iniciado (backend)
- [ ] Backend accesible en http://localhost:3001
- [ ] Frontend inicializado (si aplica)
- [ ] Puedes iniciar sesión con credenciales de prueba

---

## 🔧 Troubleshooting

### Error: "ECONNREFUSED"
MySQL no está corriendo. Reinicia MySQL:
```bash
# Windows
net start MySQL57  # u otro nombre del servicio

# macOS
brew services start mysql
```

### Error: "Table doesn't exist"
Crea la base de datos:
```bash
mysql -u root -p folios_db < DATABASE_SCHEMA.sql
```

### Error: "Unknown database"
- Verifica el nombre en `.env`
- Corre nuevamente el schema
- Ejecuta `npm run seed`

### Credenciales incorrectas
Regenera los datos:
```bash
npm run seed
```

---

## 📚 Referencias Completas

Para más detalles, consulta:

- [TEST_DATA_GUIDE.md](TEST_DATA_GUIDE.md) - Documentación completa
- [FRONTEND_TEST_DATA_INTEGRATION.md](FRONTEND_TEST_DATA_INTEGRATION.md) - Integración en UI
- [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql) - Esquema de BD
- [scripts/seedData.ts](scripts/seedData.ts) - Script de datos

---

## 💡 Tips

### Probar diferentes roles
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend (en background)
npm run dev &

# Inicia sesión → Cierra sesión → Inicia con otra cuenta
```

### Monitorear base de datos
```bash
mysql -u root -p
> SELECT COUNT(*) FROM folios;
> SELECT COUNT(*) FROM garments;
```

### Ver logs de API
```bash
# Ya visible en terminal de npm run dev
# Busca líneas como:
# GET /api/folios
# POST /api/admin/demo/reset
```

---

## 🎯 Próximos Pasos

1. ✅ Datos de prueba cargados
2. ⬜ Explorar dashboard principal
3. ⬜ Probar flujos con diferentes roles
4. ⬜ Verificar reportes y gráficos
5. ⬜ Desarrollar nuevas features

---

Listo para empezar! 🚀
