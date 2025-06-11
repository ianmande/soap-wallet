import { Router, Request, Response, NextFunction } from "express";
import { soapService } from "../services/soapService";
import {
  registerClientSchema,
  rechargeWalletSchema,
  paySchema,
  confirmPaymentSchema,
  checkBalanceSchema,
  getTransactionHistorySchema,
} from "../validators/walletValidators";

import {
  RegisterClientRequest,
  RechargeWalletRequest,
  PayRequest,
  ConfirmPaymentRequest,
  CheckBalanceRequest,
  GetTransactionHistoryRequest,
} from "../types/index";

const validateSchema = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        cod_error: "01",
        message_error: error.details[0]?.message || "Error de validación",
        data: null,
      });
      return;
    }
    next();
  };
};

const router = Router();

router.post(
  "/register-client",
  validateSchema(registerClientSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientData: RegisterClientRequest = req.body;

      console.log("🔐 Registrando cliente:", {
        documento: clientData.documento,
        email: clientData.email,
      });

      const result = await soapService.registerClient(clientData);

      if (result.success) {
        console.log(
          "✅ Cliente registrado exitosamente:",
          result.data?.client_id
        );
      } else {
        console.log("❌ Error al registrar cliente:", result.message_error);
      }

      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/recharge",
  validateSchema(rechargeWalletSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rechargeData: RechargeWalletRequest = req.body;

      console.log("💰 Recargando billetera:", {
        documento: rechargeData.documento,
        valor: rechargeData.valor,
      });

      const result = await soapService.rechargeWallet(rechargeData);

      if (result.success) {
        console.log(
          "✅ Recarga exitosa. Nuevo saldo:",
          result.data?.new_balance
        );
      } else {
        console.log("❌ Error en recarga:", result.message_error);
      }

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/pay",
  validateSchema(paySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentData: PayRequest = req.body;

      console.log("💳 Iniciando pago:", {
        documento: paymentData.documento,
        valor: paymentData.valor,
      });

      const result = await soapService.initiatePayment(paymentData);

      if (result.success) {
        console.log("✅ Pago iniciado. Session ID:", result.data?.session_id);
      } else {
        console.log("❌ Error al iniciar pago:", result.message_error);
      }

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/confirm-payment",
  validateSchema(confirmPaymentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const confirmData: ConfirmPaymentRequest = req.body;

      console.log("🔐 Confirmando pago:", {
        session_id: confirmData.session_id,
        token: "******",
      });

      const result = await soapService.confirmPayment(confirmData);

      if (result.success) {
        console.log(
          "✅ Pago confirmado. Transacción ID:",
          result.data?.transaction_id
        );
      } else {
        console.log("❌ Error al confirmar pago:", result.message_error);
      }

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/balance",
  validateSchema(checkBalanceSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const balanceData: CheckBalanceRequest = req.body;

      console.log("💼 Consultando saldo:", {
        documento: balanceData.documento,
      });

      const result = await soapService.checkBalance(balanceData);

      if (result.success) {
        console.log("✅ Saldo consultado:", result.data?.current_balance);
      } else {
        console.log("❌ Error al consultar saldo:", result.message_error);
      }

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/history",
  validateSchema(getTransactionHistorySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const historyData: GetTransactionHistoryRequest = req.body;

      console.log("💼 Consultando historial de transacciones:", {
        documento: historyData.documento,
      });

      const result = await soapService.getTransactionHistory(historyData);

      if (result.success) {
        console.log("✅ Historial de transacciones consultado:", {
          total_transactions: result.data?.total_transactions,
          current_balance: result.data?.current_balance,
        });
      } else {
        console.log(
          "❌ Error al consultar historial de transacciones:",
          result.message_error
        );
      }

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export { router as walletRoutes };
