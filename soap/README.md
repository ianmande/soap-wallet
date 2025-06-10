# 💰 Wallet SOAP Service - ePayco

## 📋 Descripción

Servicio SOAP desarrollado en Laravel para simular una **billetera virtual**. Este proyecto forma parte de la prueba técnica para el cargo de **Desarrollador BackEnd** en ePayco.

El sistema permite registrar clientes, cargar dinero, realizar pagos con confirmación por token y consultar saldos, siguiendo las mejores prácticas de desarrollo y arquitectura de software.

## ⚡ Características Principales

### 🔐 **Funcionalidades Core**

-   ✅ **Registro de Clientes** - Validación completa de datos únicos
-   ✅ **Recarga de Billetera** - Transacciones atómicas con auditoría
-   ✅ **Pagos Seguros** - Tokens de 6 dígitos con expiración
-   ✅ **Confirmación de Pagos** - Validación de sesión y token
-   ✅ **Consulta de Saldos** - Verificación por documento y celular

## 🛠️ Tecnologías Utilizadas

-   **Framework**: Laravel 10+
-   **Base de Datos**: SQLite (desarrollo) / MySQL (producción)
-   **ORM**: Eloquent
-   **SOAP**: artisaninweb/laravel-soap
-   **Validación**: Laravel Form Requests
-   **Logs**: Laravel Logging

## 🚀 Instalación y Configuración

### **Requisitos Previos**

-   PHP 8.1+
-   Composer
-   SQLite o MySQL

### **Pasos de Instalación**

```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd soap

# 2. Instalar dependencias
composer install

# 3. Configurar ambiente
cp .env.example .env
php artisan key:generate

# 4. Configurar base de datos (SQLite por defecto)
touch database/database.sqlite

# 5. Ejecutar migraciones
php artisan migrate

# 6. Iniciar servidor
php artisan serve
```

## 📡 Endpoints SOAP Disponibles

### **Base URL**: `http://localhost:8000/soap`

| Método | Endpoint          | Descripción                  |
| ------ | ----------------- | ---------------------------- |
| `POST` | `/registerClient` | Registrar nuevo cliente      |
| `POST` | `/rechargeWallet` | Recargar billetera           |
| `POST` | `/pay`            | Iniciar pago (generar token) |
| `POST` | `/confirmPayment` | Confirmar pago con token     |
| `POST` | `/checkBalance`   | Consultar saldo              |
| `GET`  | `/info`           | Información del servicio     |

## 🧪 Ejemplos de Uso

### **1. Registrar Cliente**

```bash
curl -X POST http://localhost:8000/soap/registerClient \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "nombres": "Juan Pérez",
    "email": "juan@example.com",
    "celular": "555-1234"
  }'
```

**Respuesta:**

```json
{
    "success": true,
    "cod_error": "00",
    "message_error": "Cliente registrado exitosamente",
    "data": {
        "client_id": 1,
        "document": "12345678",
        "names": "Juan Pérez",
        "email": "juan@example.com",
        "phone": "555-1234",
        "wallet_id": 1,
        "initial_balance": "0.00"
    }
}
```

### **2. Recargar Billetera**

```bash
curl -X POST http://localhost:8000/soap/rechargeWallet \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "celular": "555-1234",
    "valor": 100.00
  }'
```

### **3. Iniciar Pago**

```bash
curl -X POST http://localhost:8000/soap/pay \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "celular": "555-1234",
    "valor": 25.00
  }'
```

### **4. Confirmar Pago**

```bash
curl -X POST http://localhost:8000/soap/confirmPayment \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "uuid-generado",
    "token": "123456"
  }'
```

### **5. Consultar Saldo**

```bash
curl -X POST http://localhost:8000/soap/checkBalance \
  -H "Content-Type: application/json" \
  -d '{
    "documento": "12345678",
    "celular": "555-1234"
  }'
```

## 📁 Estructura del Proyecto

```
app/
├── Http/Controllers/Soap/
│   └── WalletSoapController.php    # Controlador SOAP principal
├── Models/
│   ├── Client.php                  # Modelo de clientes
│   ├── Wallet.php                  # Modelo de billeteras
│   ├── Token.php                   # Modelo de tokens de pago
│   └── Transaction.php             # Modelo de transacciones
├── Services/
│   └── WalletService.php           # Lógica de negocio
├── Traits/
│   └── ApiResponseTrait.php        # Respuestas estandarizadas
database/migrations/
├── create_clients_table.php        # Tabla de clientes
├── create_wallets_table.php        # Tabla de billeteras
├── create_tokens_table.php         # Tabla de tokens
└── create_transactions_table.php   # Tabla de transacciones
routes/
└── web.php                         # Rutas SOAP
```

## 🔧 Códigos de Error

| Código | Descripción                 |
| ------ | --------------------------- |
| `00`   | Operación exitosa           |
| `01`   | Datos de entrada inválidos  |
| `02`   | Error al registrar cliente  |
| `03`   | Cliente no encontrado       |
| `04`   | Billetera no activa         |
| `05`   | Error al recargar billetera |
| `06`   | Saldo insuficiente          |
| `07`   | Error al iniciar pago       |
| `08`   | Token inválido o expirado   |
| `09`   | Error al confirmar pago     |
| `10`   | Error al consultar saldo    |
| `99`   | Error interno del servidor  |

## 🔄 Flujo de Pagos

1. **Cliente solicita pago** → Se genera token de 6 dígitos
2. **Token enviado por email** → Usuario recibe código de confirmación
3. **Cliente confirma con token** → Se valida y descuenta saldo
4. **Transacción registrada** → Auditoría completa en base de datos

## ⚙️ Configuración Adicional

### **Variables de Entorno Importantes**

```env
DB_CONNECTION=sqlite
DB_DATABASE=/ruta/completa/database.sqlite

# Para MySQL en producción:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=wallet_db
# DB_USERNAME=usuario
# DB_PASSWORD=contraseña
```

### **Logs de Tokens**

Los tokens se registran en `storage/logs/laravel.log` para facilitar las pruebas:

```bash
tail -f storage/logs/laravel.log | grep "Token de pago"
```

## 🧪 Testing

### **Pruebas Rápidas**

```bash
# Listar todas las rutas
php artisan route:list

# Verificar información del servicio
curl http://localhost:8000/soap/info
```
