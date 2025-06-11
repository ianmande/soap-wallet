import { ApiResponse } from "../../src/types/index";

export const mockSoapService = {
  registerClient: jest.fn(),
  rechargeWallet: jest.fn(),
  initiatePayment: jest.fn(),
  confirmPayment: jest.fn(),
  checkBalance: jest.fn(),
  getTransactionHistory: jest.fn(),
};

// Respuestas mock exitosas
export const mockSuccessResponses = {
  registerClient: {
    success: true,
    cod_error: "00",
    message_error: "Cliente registrado exitosamente",
    data: {
      client_id: 1,
      document: "12345678",
      names: "Juan Pérez",
      email: "juan@example.com",
      phone: "5551234567",
      wallet_id: 1,
      initial_balance: "0.00",
    },
  } as ApiResponse<any>,

  rechargeWallet: {
    success: true,
    cod_error: "00",
    message_error: "Recarga exitosa",
    data: {
      transaction_id: "tx_123",
      new_balance: "100000.00",
      amount_recharged: "100000.00",
    },
  } as ApiResponse<any>,

  initiatePayment: {
    success: true,
    cod_error: "00",
    message_error: "Pago iniciado exitosamente",
    data: {
      session_id: "session_123",
      token_sent: true,
      expires_at: "2024-01-15T10:35:00.000Z",
    },
  } as ApiResponse<any>,

  confirmPayment: {
    success: true,
    cod_error: "00",
    message_error: "Pago confirmado exitosamente",
    data: {
      transaction_id: "tx_456",
      amount: "25000.00",
      new_balance: "75000.00",
    },
  } as ApiResponse<any>,

  checkBalance: {
    success: true,
    cod_error: "00",
    message_error: "Saldo consultado exitosamente",
    data: {
      current_balance: "75000.00",
      last_transaction: "2024-01-15T10:30:00.000Z",
    },
  } as ApiResponse<any>,
};

// Respuestas mock de error
export const mockErrorResponses = {
  validationError: {
    success: false,
    cod_error: "01",
    message_error: "Datos de entrada inválidos",
    data: null,
  } as ApiResponse<any>,

  clientNotFound: {
    success: false,
    cod_error: "03",
    message_error: "Cliente no encontrado",
    data: null,
  } as ApiResponse<any>,

  insufficientFunds: {
    success: false,
    cod_error: "06",
    message_error: "Saldo insuficiente",
    data: null,
  } as ApiResponse<any>,
};
