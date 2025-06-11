import {
  registerClientSchema,
  rechargeWalletSchema,
  paySchema,
  confirmPaymentSchema,
  checkBalanceSchema,
  getTransactionHistorySchema,
} from "../../src/validators/walletValidators";
import { v4 as uuid } from "uuid";

describe("Wallet Validators", () => {
  describe("registerClientSchema", () => {
    it("debe validar datos correctos de registro de cliente", () => {
      const validData = {
        documento: "12345678",
        nombres: "Juan Pérez",
        email: "juan@example.com",
        celular: "5551234567",
      };

      const { error } = registerClientSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it("debe rechazar documento inválido", () => {
      const invalidData = {
        documento: "123", // Muy corto
        nombres: "Juan Pérez",
        email: "juan@example.com",
        celular: "5551234567",
      };

      const { error } = registerClientSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect((error as any)?.details?.[0]?.message).toContain("documento");
    });

    it("debe rechazar email inválido", () => {
      const invalidData = {
        documento: "12345678",
        nombres: "Juan Pérez",
        email: "email-invalido", // Email inválido
        celular: "5551234567",
      };

      const { error } = registerClientSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect((error as any)?.details?.[0]?.message).toContain("email");
    });

    it("debe rechazar celular inválido", () => {
      const invalidData = {
        documento: "12345678",
        nombres: "Juan Pérez",
        email: "juan@example.com",
        celular: "123", // Muy corto
      };

      const { error } = registerClientSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect((error as any)?.details?.[0]?.message).toContain("celular");
    });
  });

  describe("rechargeWalletSchema", () => {
    it("debe validar datos correctos de recarga", () => {
      const validData = {
        documento: "12345678",
        celular: "5551234567",
        valor: 100000,
      };

      const { error } = rechargeWalletSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it("debe rechazar valor negativo", () => {
      const invalidData = {
        documento: "12345678",
        celular: "5551234567",
        valor: -100,
      };

      const { error } = rechargeWalletSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect((error as any)?.details?.[0]?.message).toContain("valor");
    });

    it("debe rechazar valor cero", () => {
      const invalidData = {
        documento: "12345678",
        celular: "5551234567",
        valor: 0,
      };

      const { error } = rechargeWalletSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe("paySchema", () => {
    it("debe validar datos correctos de pago", () => {
      const validData = {
        documento: "12345678",
        celular: "5551234567",
        valor: 25000,
      };

      const { error } = paySchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it("debe rechazar valor de pago inválido", () => {
      const invalidData = {
        documento: "12345678",
        celular: "5551234567",
        valor: -50,
      };

      const { error } = paySchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe("confirmPaymentSchema", () => {
    it("debe validar datos correctos de confirmación", () => {
      const validData = {
        session_id: uuid(),
        token: "123456",
      };

      const { error } = confirmPaymentSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it("debe rechazar token inválido", () => {
      const invalidData = {
        session_id: uuid(),
        token: "12", // Muy corto
      };

      const { error } = confirmPaymentSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect((error as any)?.details?.[0]?.message).toContain("token");
    });

    it("debe rechazar session_id vacío", () => {
      const invalidData = {
        session_id: "",
        token: "123456",
      };

      const { error } = confirmPaymentSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe("checkBalanceSchema", () => {
    it("debe validar datos correctos de consulta de saldo", () => {
      const validData = {
        documento: "12345678",
        celular: "5551234567",
      };

      const { error } = checkBalanceSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });

  describe("getTransactionHistorySchema", () => {
    it("debe validar datos correctos de historial", () => {
      const validData = {
        documento: "12345678",
        celular: "5551234567",
        limit: 10,
        offset: 0,
      };

      const { error } = getTransactionHistorySchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it("debe usar valores por defecto para limit y offset", () => {
      const validData = {
        documento: "12345678",
        celular: "5551234567",
      };

      const { error, value } = getTransactionHistorySchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value.limit).toBe(10);
      expect(value.offset).toBe(0);
    });

    it("debe rechazar limit excesivo", () => {
      const invalidData = {
        documento: "12345678",
        celular: "5551234567",
        limit: 150, // Más del máximo permitido
      };

      const { error } = getTransactionHistorySchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });
});
