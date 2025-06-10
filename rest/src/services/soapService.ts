import {
  ApiResponse,
  RegisterClientRequest,
  RegisterClientResponse,
  RechargeWalletRequest,
  RechargeWalletResponse,
  PayRequest,
  PayResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  CheckBalanceRequest,
  CheckBalanceResponse,
} from "../types/index";
import { httpClient } from "../api/httpClient";

export class SoapService {
  async registerClient(
    data: RegisterClientRequest
  ): Promise<ApiResponse<RegisterClientResponse>> {
    try {
      return await httpClient.post<RegisterClientResponse>(
        "/registerClient",
        data
      );
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      throw error;
    }
  }

  async rechargeWallet(
    data: RechargeWalletRequest
  ): Promise<ApiResponse<RechargeWalletResponse>> {
    try {
      return await httpClient.post<RechargeWalletResponse>(
        "/rechargeWallet",
        data
      );
    } catch (error) {
      console.error("Error al recargar billetera:", error);
      throw error;
    }
  }

  async initiatePayment(data: PayRequest): Promise<ApiResponse<PayResponse>> {
    try {
      return await httpClient.post<PayResponse>("/pay", data);
    } catch (error) {
      console.error("Error al iniciar pago:", error);
      throw error;
    }
  }

  async confirmPayment(
    data: ConfirmPaymentRequest
  ): Promise<ApiResponse<ConfirmPaymentResponse>> {
    try {
      return await httpClient.post<ConfirmPaymentResponse>(
        "/confirmPayment",
        data
      );
    } catch (error) {
      console.error("Error al confirmar pago:", error);
      throw error;
    }
  }

  async checkBalance(
    data: CheckBalanceRequest
  ): Promise<ApiResponse<CheckBalanceResponse>> {
    try {
      return await httpClient.post<CheckBalanceResponse>("/checkBalance", data);
    } catch (error) {
      console.error("Error al consultar saldo:", error);
      throw error;
    }
  }
}

export const soapService = new SoapService();
