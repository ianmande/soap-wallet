# 🚀 Wallet REST Service - ePayco

## 📋 Descripción

Servicio REST desarrollado en **Node.js + TypeScript + Express** que actúa como puente entre clientes y el servicio SOAP de billetera virtual. Este proyecto forma parte de la prueba técnica para el cargo de **Desarrollador BackEnd** en ePayco.

## ⚡ Características Principales

- ✅ **TypeScript** con tipado estricto
- ✅ **ESM** (ES Modules) con imports nativos
- ✅ **Validación** con Joi

## 🛠️ Tecnologías Utilizadas

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.3+
- **Framework**: Express 4.18+
- **Validación**: Joi 17+
- **HTTP Client**: Fetch API nativo

## 🚀 Instalación y Configuración

### **Requisitos Previos**

- Node.js 18+
- npm

### **Pasos de Instalación**

```bash
# 1. Clonar el repositorio
# git clone [URL_DEL_REPOSITORIO]
cd rest

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Iniciar servidor de desarrollo
npm run dev
```

## 📡 Endpoints API Disponibles

### **Base URL**: `http://localhost:3000`

| Método | Endpoint                      | Descripción                |
| ------ | ----------------------------- | -------------------------- |
| `GET`  | `/`                           | Información del servicio   |
| `POST` | `/api/wallet/register-client` | Registrar nuevo cliente    |
| `POST` | `/api/wallet/recharge`        | Recargar billetera         |
| `POST` | `/api/wallet/pay`             | Iniciar pago               |
| `POST` | `/api/wallet/confirm-payment` | Confirmar pago con token   |
| `POST` | `/api/wallet/balance`         | Consultar saldo            |
| `POST` | `/api/wallet/history`         | Historial de transacciones |

## 📁 Estructura del Proyecto

```
src/
├── api/
│   └── httpClient.ts          # Cliente HTTP con fetch
├── config/
│   └── config.ts              # Configuración centralizada
├── middleware/
│   └── errorHandler.ts        # Manejo de errores
├── routes/
│   └── walletRoutes.ts        # Rutas de billetera
├── services/
│   └── soapService.ts         # Comunicación con SOAP
├── types/
│   └── index.ts               # Definiciones TypeScript
├── validators/
│   └── walletValidators.ts    # Esquemas Joi
└── app.ts                     # Aplicación principal
```

## 🔧 Códigos de Error

| Código | Descripción                 |
| ------ | --------------------------- |
| `00`   | Operación exitosa           |
| `01`   | Error de validación         |
| `404`  | Endpoint no encontrado      |
| `503`  | Servicio SOAP no disponible |
| `99`   | Error interno               |

## 🔄 Flujo de Trabajo

1. **Cliente solicita registro o transacción** → Se valida y procesa la solicitud
2. **Interacción con servicio SOAP** → Se comunica con el servicio SOAP para operaciones de billetera
3. **Respuesta al cliente** → Se devuelve el resultado de la operación al cliente

## 🔗 Comunicación con SOAP

El servicio consume automáticamente los endpoints SOAP:

- `POST /soap/registerClient`
- `POST /soap/rechargeWallet`
- `POST /soap/pay`
- `POST /soap/confirmPayment`
- `POST /soap/checkBalance`
- `GET /soap/info`

Configurar `SOAP_BASE_URL` para cambiar la URL del servicio SOAP.

## 🧪 Ejemplos de Uso

### **1. Información del Servicio**

```bash
curl -X GET http://localhost:3000/
```

### **2. Registrar Cliente**

```bash
curl -X POST http://localhost:3000/api/wallet/register-client \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "nombres": "Juan Pérez",
    "email": "juan@example.com",
    "celular": "555-1234"
  }'
```

### **3. Recargar Billetera**

```bash
curl -X POST http://localhost:3000/api/wallet/recharge \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "celular": "555-1234",
    "valor": 100000
  }'
```

### **4. Iniciar Pago**

```bash
curl -X POST http://localhost:3000/api/wallet/pay \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "celular": "555-1234",
    "valor": 25000
  }'
```

### **5. Confirmar Pago**

```bash
curl -X POST http://localhost:3000/api/wallet/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "uuid-generado",
    "token": "123456"
  }'
```

### **6. Consultar Saldo**

```bash
curl -X POST http://localhost:3000/api/wallet/balance \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "celular": "555-1234"
  }'
```

### **7. Historial de Transacciones**

```bash
curl -X POST http://localhost:3000/api/wallet/history \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "celular": "555-1234",
    "limit": 10,
    "offset": 0
  }'
```
