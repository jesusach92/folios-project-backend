# Test Data Management - Frontend Integration

Este documento describe cómo integrar la gestión de datos de prueba en la interfaz de usuario.

## 📱 Interfaz de Usuario para Datos de Prueba

### Componente: Demo Data Manager

Se recomienda crear un componente que permita a los administradores:

1. **Ver Cuentas Disponibles** - Mostrar todas las cuentas de prueba
2. **Resetear Datos** - Cargar nuevamente los datos de demostración
3. **Ver Estadísticas** - Mostrar cantidad de registros en base de datos

### Ubicación Recomendada

```
src/
  components/
    Admin/
      DemoManager/
        DemoManager.jsx          # Componente principal
        DemoManager.module.css   # Estilos
        DemoAccounts.jsx         # Sub-componente para cuentas
        DemoStats.jsx            # Sub-componente para estadísticas
```

---

## 🔌 API Integration

### Hook Personalizado

Crea un hook para interactuar con los endpoints de demo:

```javascript
// src/hooks/useDemoData.js

import { useState, useCallback } from 'react';

const API_URL = 'http://localhost:3001';

export function useDemoData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [stats, setStats] = useState(null);

  const resetData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/admin/demo/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset demo data');
      }

      const data = await response.json();
      setAccounts(data.accounts);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/admin/demo/accounts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      setAccounts(data.accounts);
      return data.accounts;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/admin/demo/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data.stats);
      return data.stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    accounts,
    stats,
    resetData,
    getAccounts,
    getStats,
  };
}
```

---

## 🎨 Componente Ejemplo

### DemoManager.jsx

```jsx
import { useState, useEffect } from 'react';
import { useDemoData } from '../../hooks/useDemoData';
import DemoAccounts from './DemoAccounts';
import DemoStats from './DemoStats';
import styles from './DemoManager.module.css';

export default function DemoManager() {
  const { loading, error, accounts, stats, resetData, getAccounts, getStats } = useDemoData();
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    getAccounts();
    getStats();
  }, []);

  const handleResetClick = () => {
    setConfirmReset(true);
  };

  const handleConfirmReset = async () => {
    try {
      await resetData();
      setConfirmReset(false);
      // Mostrar notificación de éxito
      alert('✅ Demo data reset successfully!');
      // Recargar datos
      await getStats();
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setConfirmReset(false);
  };

  if (loading && !accounts) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>📊 Demo Data Management</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.section}>
        <h2>🔄 Reset Demo Data</h2>
        <p>Load fresh demo accounts and sample data into the database</p>

        {!confirmReset ? (
          <button 
            className={styles.resetButton}
            onClick={handleResetClick}
            disabled={loading}
          >
            {loading ? 'Processing...' : '⚡ Reset Demo Data'}
          </button>
        ) : (
          <div className={styles.confirmation}>
            <p className={styles.warning}>
              ⚠️ This will clear all data and load test data. Continue?
            </p>
            <div className={styles.buttons}>
              <button 
                className={styles.confirmButton}
                onClick={handleConfirmReset}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Yes, Reset Data'}
              </button>
              <button 
                className={styles.cancelButton}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {accounts && <DemoAccounts accounts={accounts} />}
      {stats && <DemoStats stats={stats} />}
    </div>
  );
}
```

### DemoAccounts.jsx

```jsx
import styles from './DemoManager.module.css';

export default function DemoAccounts({ accounts }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className={styles.section}>
      <h2>👥 Available Test Accounts</h2>
      <div className={styles.accountsGrid}>
        {Object.entries(accounts).map(([key, account]) => (
          <div key={key} className={styles.accountCard}>
            <div className={styles.role}>{account.role}</div>
            {account.section && <div className={styles.section}>{account.section}</div>}
            
            <div className={styles.credentials}>
              <div>
                <label>Email:</label>
                <span>{account.email}</span>
              </div>
              <div>
                <label>Password:</label>
                <span>{account.password}</span>
              </div>
            </div>

            <button 
              className={styles.copyButton}
              onClick={() => {
                copyToClipboard(`Email: ${account.email}\nPassword: ${account.password}`);
              }}
            >
              📋 Copy Credentials
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### DemoStats.jsx

```jsx
import styles from './DemoManager.module.css';

export default function DemoStats({ stats }) {
  const formatNumber = (num) => num.toLocaleString();

  return (
    <div className={styles.section}>
      <h2>📈 Database Statistics</h2>
      <div className={styles.statsGrid}>
        {Object.entries(stats).map(([table, count]) => (
          <div key={table} className={styles.statCard}>
            <div className={styles.statLabel}>{table}</div>
            <div className={styles.statValue}>{formatNumber(count)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### DemoManager.module.css

```css
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.container h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.section p {
  margin: 0 0 1rem 0;
  color: #666;
}

.resetButton {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.resetButton:hover {
  background: #0056b3;
}

.resetButton:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.confirmation {
  margin-top: 1rem;
  padding: 1rem;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.warning {
  color: #856404;
  margin: 0 0 1rem 0;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.confirmButton {
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirmButton:hover {
  background: #c82333;
}

.cancelButton {
  background: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancelButton:hover {
  background: #5a6268;
}

.accountsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.accountCard {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.accountCard .role {
  font-weight: bold;
  color: #007bff;
  margin-bottom: 0.5rem;
}

.accountCard .section {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.75rem;
}

.credentials {
  margin: 0.75rem 0;
}

.credentials div {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.credentials label {
  font-weight: bold;
  color: #333;
  display: block;
}

.credentials span {
  font-family: monospace;
  color: #666;
  display: block;
  background: white;
  padding: 0.4rem 0.6rem;
  border-radius: 3px;
  margin-top: 0.2rem;
}

.copyButton {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.copyButton:hover {
  background: #218838;
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.statCard {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  border-top: 3px solid #007bff;
  text-align: center;
}

.statLabel {
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.statValue {
  font-size: 1.75rem;
  font-weight: bold;
  color: #007bff;
}

.error {
  background: #f8d7da;
  color: #721c24;
  padding: 0.75rem 1.25rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
```

---

## 🚀 Integración en la Aplicación

### 1. Añadir a la Ruta Admin

```jsx
// src/pages/AdminPanel.jsx

import { Routes, Route } from 'react-router-dom';
import DemoManager from '../components/Admin/DemoManager/DemoManager';
import UserManagement from '../components/Admin/UserManagement/UserManagement';

export default function AdminPanel() {
  return (
    <div className="admin-panel">
      <h1>⚙️ Administration Panel</h1>
      
      <Routes>
        <Route path="demo" element={<DemoManager />} />
        <Route path="users" element={<UserManagement />} />
      </Routes>
    </div>
  );
}
```

### 2. Menú de Navegación

```jsx
// src/components/Sidebar/Sidebar.jsx

<nav>
  {user?.role === 'ADMIN' && (
    <section>
      <h3>Administration</h3>
      <ul>
        <li><Link to="/admin/demo">Demo Data</Link></li>
        <li><Link to="/admin/users">User Management</Link></li>
      </ul>
    </section>
  )}
</nav>
```

---

## 📋 Casos de Uso

### Caso 1: Empezar Sesión de Desarrollo Fresca

1. Navega a `/admin/demo`
2. Haz clic en "Reset Demo Data"
3. Confirma en el popup
4. Sistema carga automáticamente nuevos datos
5. Inicio sesión con cualquier cuenta de prueba

### Caso 2: Probar Diferentes Roles

1. Visualiza las cuentas disponibles en la sección "Available Test Accounts"
2. Copia credenciales con el botón "Copy Credentials"
3. Cierra sesión
4. Inicia sesión con otra cuenta
5. Prueba funcionalidades según el rol

### Caso 3: Verificar Integridad de Datos

1. Consulta la sección "Database Statistics"
2. Verifica que los números son coherentes:
   - 2,750 prendas (garments) distribuidas en 5 folios
   - 3 rutas (routes) con secciones asignadas
   - 11 procesos (processes) en 5 secciones

---

## 🔒 Seguridad

⚠️ **Importante**: El endpoint de reset solo está disponible en desarrollo:

```typescript
if (process.env.NODE_ENV === "production") {
  res.status(403).json({
    error: "This endpoint is not available in production"
  });
  return;
}
```

---

## 🎯 Próximos Pasos

1. Crear componente DemoManager en el frontend
2. Integrar en rutas de admin
3. Personalizar estilos según el diseño de la aplicación
4. Añadir notificaciones de éxito/error
5. Implementar auto-refresh de datos después del reset

---

## Reference

- [Test Data Guide](TEST_DATA_GUIDE.md) - Guía de datos de prueba
- [API Endpoints](#método-2-api-rest-endpoint)
- [Demo Controller](src/controllers/DemoController.ts)
