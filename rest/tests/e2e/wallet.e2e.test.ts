import request from "supertest";
import express from "express";
import {
  mockSoapService,
  mockSuccessResponses,
  mockErrorResponses,
} from "../mocks/soapService.mock";
import { v4 as uuid } from "uuid";

// Mock del SoapService primero, antes de importar rutas
jest.mock("../../src/services/soapService", () => ({
  soapService: mockSoapService,
}));

import { walletRoutes } from "../../src/routes/walletRoutes";
import { errorHandler } from "../../src/middleware/errorHandler";

describe("Wallet E2E Tests", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/wallet", walletRoutes);
    app.use(errorHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/wallet/register-client", () => {
    it("debe registrar un cliente exitosamente", async () => {
      mockSoapService.registerClient.mockResolvedValue(
        mockSuccessResponses.registerClient
      );

      const clientData = {
        documento: "12345678",
        nombres: "Juan Pérez",
        email: "juan@example.com",
        celular: "5551234567",
      };

      const response = await request(app)
        .post("/api/wallet/register-client")
        .send(clientData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.cod_error).toBe("00");
      expect(response.body.data.client_id).toBe(1);
      expect(mockSoapService.registerClient).toHaveBeenCalledWith(clientData);
    });

    it("debe rechazar datos inválidos", async () => {
      const invalidData = {
        documento: "123", // Muy corto
        nombres: "Juan Pérez",
        email: "juan@example.com",
        celular: "5551234567",
      };

      const response = await request(app)
        .post("/api/wallet/register-client")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.cod_error).toBe("01");
      expect(mockSoapService.registerClient).not.toHaveBeenCalled();
    });

    it("debe manejar errores del servicio SOAP", async () => {
      mockSoapService.registerClient.mockResolvedValue(
        mockErrorResponses.validationError
      );

      const clientData = {
        documento: "12345678",
        nombres: "Juan Pérez",
        email: "juan@example.com",
        celular: "5551234567",
      };

      const response = await request(app)
        .post("/api/wallet/register-client")
        .send(clientData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.cod_error).toBe("01");
    });
  });

  describe("POST /api/wallet/recharge", () => {
    it("debe recargar billetera exitosamente", async () => {
      mockSoapService.rechargeWallet.mockResolvedValue(
        mockSuccessResponses.rechargeWallet
      );

      const rechargeData = {
        documento: "12345678",
        celular: "5551234567",
        valor: 100000,
      };

      const response = await request(app)
        .post("/api/wallet/recharge")
        .send(rechargeData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cod_error).toBe("00");
      expect(response.body.data.new_balance).toBe("100000.00");
      expect(mockSoapService.rechargeWallet).toHaveBeenCalledWith(rechargeData);
    });

    it("debe rechazar valor negativo", async () => {
      const invalidData = {
        documento: "12345678",
        celular: "5551234567",
        valor: -100,
      };

      const response = await request(app)
        .post("/api/wallet/recharge")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.cod_error).toBe("01");
    });
  });

  describe("POST /api/wallet/pay", () => {
    it("debe iniciar pago exitosamente", async () => {
      mockSoapService.initiatePayment.mockResolvedValue(
        mockSuccessResponses.initiatePayment
      );

      const paymentData = {
        documento: "12345678",
        celular: "5551234567",
        valor: 25000,
      };

      const response = await request(app)
        .post("/api/wallet/pay")
        .send(paymentData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cod_error).toBe("00");
      expect(response.body.data.session_id).toBe("session_123");
      expect(response.body.data.token_sent).toBe(true);
      expect(mockSoapService.initiatePayment).toHaveBeenCalledWith(paymentData);
    });

    it("debe rechazar saldo insuficiente", async () => {
      mockSoapService.initiatePayment.mockResolvedValue(
        mockErrorResponses.insufficientFunds
      );

      const paymentData = {
        documento: "12345678",
        celular: "5551234567",
        valor: 25000,
      };

      const response = await request(app)
        .post("/api/wallet/pay")
        .send(paymentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.cod_error).toBe("06");
      expect(response.body.message_error).toContain("Saldo insuficiente");
    });
  });

  describe("POST /api/wallet/confirm-payment", () => {
    it("debe confirmar pago exitosamente", async () => {
      mockSoapService.confirmPayment.mockResolvedValue(
        mockSuccessResponses.confirmPayment
      );

      const confirmData = {
        session_id: uuid(),
        token: "123456",
      };

      const response = await request(app)
        .post("/api/wallet/confirm-payment")
        .send(confirmData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cod_error).toBe("00");
      expect(response.body.data.transaction_id).toBe("tx_456");
      expect(mockSoapService.confirmPayment).toHaveBeenCalledWith(confirmData);
    });

    it("debe rechazar token inválido", async () => {
      const invalidData = {
        session_id: uuid(),
        token: "12", // Muy corto
      };

      const response = await request(app)
        .post("/api/wallet/confirm-payment")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.cod_error).toBe("01");
    });
  });

  describe("POST /api/wallet/balance", () => {
    it("debe consultar saldo exitosamente", async () => {
      mockSoapService.checkBalance.mockResolvedValue(
        mockSuccessResponses.checkBalance
      );

      const balanceData = {
        documento: "12345678",
        celular: "5551234567",
      };

      const response = await request(app)
        .post("/api/wallet/balance")
        .send(balanceData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cod_error).toBe("00");
      expect(response.body.data.current_balance).toBe("75000.00");
      expect(mockSoapService.checkBalance).toHaveBeenCalledWith(balanceData);
    });

    it("debe manejar cliente no encontrado", async () => {
      mockSoapService.checkBalance.mockResolvedValue(
        mockErrorResponses.clientNotFound
      );

      const balanceData = {
        documento: "99999999",
        celular: "5551234567",
      };

      const response = await request(app)
        .post("/api/wallet/balance")
        .send(balanceData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.cod_error).toBe("03");
      expect(response.body.message_error).toContain("Cliente no encontrado");
    });
  });

  describe("POST /api/wallet/history", () => {
    it("debe obtener historial de transacciones", async () => {
      const mockHistoryResponse = {
        success: true,
        cod_error: "00",
        message_error: "Historial obtenido exitosamente",
        data: {
          transactions: [
            {
              id: 1,
              type: "recharge",
              amount: "100000.00",
              date: "2024-01-15T10:00:00.000Z",
            },
          ],
          total_transactions: 1,
          current_balance: "75000.00",
        },
      };

      mockSoapService.getTransactionHistory.mockResolvedValue(
        mockHistoryResponse
      );

      const historyData = {
        documento: "12345678",
        celular: "5551234567",
        limit: 10,
        offset: 0,
      };

      const response = await request(app)
        .post("/api/wallet/history")
        .send(historyData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toHaveLength(1);
      expect(mockSoapService.getTransactionHistory).toHaveBeenCalledWith(
        historyData
      );
    });

    it("debe usar valores por defecto para paginación", async () => {
      const mockHistoryResponse = {
        success: true,
        cod_error: "00",
        message_error: "Historial obtenido exitosamente",
        data: {
          transactions: [],
          total_transactions: 0,
          current_balance: "0.00",
        },
      };

      mockSoapService.getTransactionHistory.mockResolvedValue(
        mockHistoryResponse
      );

      const historyData = {
        documento: "12345678",
        celular: "5551234567",
      };

      await request(app)
        .post("/api/wallet/history")
        .send(historyData)
        .expect(200);

      expect(mockSoapService.getTransactionHistory).toHaveBeenCalledWith(
        historyData
      );
    });
  });
});
