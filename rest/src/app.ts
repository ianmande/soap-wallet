import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";

import { walletRoutes } from "./routes/walletRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { ApiResponse, ErrorCodes } from "./types/index";
import config from "./config/config";

const app = express();
const PORT = config.port;

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
  })
);

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.method === "POST" && !req.is("application/json")) {
    res.status(400).json({
      success: false,
      cod_error: ErrorCodes.VALIDATION_ERROR,
      message_error: "Content-Type debe ser application/json",
      data: null,
    } as ApiResponse);
    return;
  }
  next();
});

app.use("/api/wallet", walletRoutes);
//app.use("/api/transaction", transactionRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    cod_error: ErrorCodes.SUCCESS,
    message_error: "Servicio REST Billetera Virtual - ePayco",
    data: {
      service: "Wallet REST API",
      version: "1.0.0",
      description:
        "Servicio REST que consume servicio SOAP para billetera virtual",
      endpoints: [
        "POST /api/wallet/register-client",
        "POST /api/wallet/recharge",
        "POST /api/wallet/pay",
        "POST /api/wallet/confirm-payment",
        "POST /api/wallet/balance",
      ],
      status: "active",
      soap_service: config.soapBaseUrl,
    },
  } as ApiResponse);
});

app.use(errorHandler);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    cod_error: ErrorCodes.NOT_FOUND,
    message_error: "Endpoint no encontrado",
    data: null,
  } as ApiResponse);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor REST iniciado en puerto ${PORT}`);
  console.log(`📡 Consumiendo servicio SOAP: ${config.soapBaseUrl}`);
  console.log(`🌍 Modo: ${config.nodeEnv}`);
});

export default app;
