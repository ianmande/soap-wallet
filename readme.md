# 💰 Wallet Virtual - ePayco

## 📋 Descripción

Sistema completo de billetera virtual desarrollado para **ePayco** que consta de:

- **🧼 Servicio SOAP** (Laravel) - Backend principal con lógica de negocio
- **🚀 Servicio REST** (Node.js + TypeScript) - API REST que consume el servicio SOAP
- **📮 Colección Postman** - Para pruebas de endpoints

## 🏗️ Arquitectura

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    SOAP    ┌─────────────────┐
│     Cliente     │ ───────────────► │  Servicio REST  │ ─────────► │  Servicio SOAP  │
│   (Postman)     │                 │   (Node.js)     │            │   (Laravel)     │
└─────────────────┘                 └─────────────────┘            └─────────────────┘
```

## 🚀 Instalación y Configuración

### **Paso 1: Configurar Servicio SOAP (Laravel)**

```bash
# 1. Navegar a la carpeta SOAP
cd soap

# 2. Instalar dependencias
composer install

# 3. Configurar ambiente
cp .env.example .env
php artisan key:generate

# 4. Configurar MySQL
# Crear base de datos y usuario MySQL:
mysql -u root -p
CREATE DATABASE wallet_epayco;
CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'contraseña';
GRANT ALL PRIVILEGES ON wallet_epayco.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Configurar variables en .env (ver sección Variables de Entorno)

# 5. Ejecutar migraciones
php artisan migrate

# 6. Iniciar servidor SOAP
php artisan serve
# ✅ Servidor corriendo en: http://127.0.0.1:8000
```

### **Paso 2: Configurar Servicio REST (Node.js)**

```bash
# 1. Abrir nueva terminal y navegar a la carpeta REST
cd rest

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear archivo .env con:
PORT=3000
NODE_ENV=development
SOAP_BASE_URL=http://127.0.0.1:8000/soap
CORS_ORIGIN=*

# 4. Iniciar servidor REST
npm run dev
# ✅ Servidor corriendo en: http://localhost:3000
```

### **Paso 3: Importar Colección Postman**

1. **Descargar colección:** `rest/Wallet-REST-Service.postman_collection.json`
2. **Abrir Postman**
3. **Importar:** File → Import → Seleccionar el archivo JSON
4. **Configurar variable:**
   - Variable: `base_url`
   - Valor: `http://localhost:3000`

```bash
# Verificar SOAP
curl http://127.0.0.1:8000/soap/info

# Verificar REST
curl http://localhost:3000/
```

#### **Obtener Token desde Logs**

**🔍 Monitorear logs del SOAP:**

```bash
# En la terminal del servicio SOAP, buscar línea similar a:
# Token de pago generado para sesión [uuid]: 123456

# O ver logs directamente:
tail -f soap/storage/logs/laravel.log | grep "Token de pago"
```

## 📡 Endpoints Disponibles

### **Servicio REST (Puerto 3000)**

| Método | Endpoint                      | Descripción                |
| ------ | ----------------------------- | -------------------------- |
| `GET`  | `/`                           | Información del servicio   |
| `POST` | `/api/wallet/register-client` | Registrar cliente          |
| `POST` | `/api/wallet/recharge`        | Recargar billetera         |
| `POST` | `/api/wallet/pay`             | Iniciar pago               |
| `POST` | `/api/wallet/confirm-payment` | Confirmar pago             |
| `POST` | `/api/wallet/balance`         | Consultar saldo            |
| `POST` | `/api/wallet/history`         | Historial de transacciones |

### **Servicio SOAP (Puerto 8000)**

| Método | Endpoint               | Descripción              |
| ------ | ---------------------- | ------------------------ |
| `GET`  | `/soap/info`           | Información del servicio |
| `POST` | `/soap/registerClient` | Registrar cliente        |
| `POST` | `/soap/rechargeWallet` | Recargar billetera       |
| `POST` | `/soap/pay`            | Iniciar pago             |
| `POST` | `/soap/confirmPayment` | Confirmar pago           |
| `POST` | `/soap/checkBalance`   | Consultar saldo          |

## 📊 Estructura del Proyecto

```
node-wallet/
├── soap/                          # Servicio SOAP (Laravel)
│   ├── app/Http/Controllers/Soap/ # Controladores SOAP
│   ├── app/Models/                # Modelos de datos
│   ├── database/migrations/       # Migraciones BD
│   └── storage/logs/              # 📋 Logs con tokens
├── rest/                          # Servicio REST (Node.js)
│   ├── src/api/                   # Cliente HTTP
│   ├── src/routes/                # Rutas REST
│   ├── src/services/              # Servicios
│   └── Wallet-REST-Service.postman_collection.json
└── README.md                      # Este archivo
```

## 🎯 Flujo de Tokens

1. **Cliente inicia pago** → `POST /api/wallet/pay`
2. **Sistema genera token** → Token de 6 dígitos
3. **Token se registra en logs** → `soap/storage/logs/laravel.log`
4. **Cliente consulta logs** → Buscar `"Token de pago generado"`
5. **Cliente confirma pago** → `POST /api/wallet/confirm-payment`

## 🔐 Variables de Entorno

### **SOAP (.env)**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wallet_epayco
DB_USERNAME=wallet_user
DB_PASSWORD=wallet_2024
```

### **REST (.env)**

```env
PORT=3000
NODE_ENV=development
SOAP_BASE_URL=http://127.0.0.1:8000/soap
CORS_ORIGIN=*
```

## 📝 Notas Importantes

⚠️ **IPv4 vs IPv6:** Usar `127.0.0.1` en lugar de `localhost` para evitar problemas de conectividad en macOS.

⚠️ **Tokens:** Los tokens tienen **5 minutos** de expiración desde su generación.

⚠️ **Base de datos:** SQLite se usa por defecto. Para producción, cambiar a MySQL en `.env` del SOAP.

## 🏁 ¡Listo para Probar!

1. ✅ **SOAP corriendo** en `http://127.0.0.1:8000`
2. ✅ **REST corriendo** en `http://localhost:3000`
3. ✅ **Postman configurado** con colección importada
4. ✅ **Logs monitoreados** para obtener tokens

**¡Todo configurado! Ahora puedes probar el sistema completo de billetera virtual.**
