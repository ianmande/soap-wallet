# 🚀 Wallet REST Service - ePayco

Servicio REST desarrollado en **Node.js + TypeScript + Express** que actúa como puente entre clientes y el servicio SOAP de billetera virtual.

## ⚡ Características

- **TypeScript** con tipado estricto
- **ESM** (ES Modules) con imports nativos
- **Validación** con Joi

## 🛠️ Tecnologías

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5.3+
- **Framework**: Express 4.18+
- **Validación**: Joi 17+
- **HTTP Client**: Fetch API nativo

## 📋 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🔧 Configuración

Todas las variables están centralizadas en `src/config/config.ts`:

```typescript
export const config = {
  port: 3000,
  nodeEnv: "development",
  soapBaseUrl: "http://localhost:8000/soap",
  corsOrigin: "*",
};
```

### Variables de Entorno

```env
PORT=3000
NODE_ENV=development
SOAP_BASE_URL=http://localhost:8000/soap
CORS_ORIGIN=*
```

## 📡 Endpoints API

Base URL: `http://localhost:3000`

### Información del Servicio

```http
GET /
```

### Registro de Cliente

```http
POST /api/wallet/register-client
Content-Type: application/json

{
  "documento": "12345678",
  "nombres": "Juan Pérez",
  "email": "juan@example.com",
  "celular": "555-1234"
}
```

### Recargar Billetera

```http
POST /api/wallet/recharge
Content-Type: application/json

{
  "documento": "12345678",
  "celular": "555-1234",
  "valor": 100000
}
```

### Iniciar Pago

```http
POST /api/wallet/pay
Content-Type: application/json

{
  "documento": "12345678",
  "celular": "555-1234",
  "valor": 25000
}
```

### Confirmar Pago

```http
POST /api/wallet/confirm-payment
Content-Type: application/json

{
  "session_id": "uuid-generado",
  "token": "123456"
}
```

### Consultar Saldo

```http
POST /api/wallet/balance
Content-Type: application/json

{
  "documento": "12345678",
  "celular": "555-1234"
}
```

## 📊 Estructura de Respuesta

Todas las respuestas siguen el mismo formato:

```json
{
  "success": true,
  "cod_error": "00",
  "message_error": "Operación exitosa",
  "data": {
    // datos específicos según el endpoint
  }
}
```

### Códigos de Error

| Código | Descripción                 |
| ------ | --------------------------- |
| `00`   | Operación exitosa           |
| `01`   | Error de validación         |
| `404`  | Endpoint no encontrado      |
| `503`  | Servicio SOAP no disponible |
| `99`   | Error interno               |

## 🏗️ Estructura del Proyecto

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

## 🔍 Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar a JavaScript
npm start            # Ejecutar versión compilada
npm run clean        # Limpiar carpeta dist
```

Respuesta:

```json
{
  "success": true,
  "cod_error": "00",
  "message_error": "Estado del servicio verificado",
  "data": {
    "rest_service": "active",
    "soap_service": "active",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🔗 Comunicación con SOAP

El servicio consume automáticamente los endpoints SOAP:

- `POST /soap/registerClient`
- `POST /soap/rechargeWallet`
- `POST /soap/pay`
- `POST /soap/confirmPayment`
- `POST /soap/checkBalance`
- `GET /soap/info`

Configurar `SOAP_BASE_URL` para cambiar la URL del servicio SOAP.
