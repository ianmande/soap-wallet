export interface PayRequest {
  documento: string;
  celular: string;
  valor: number;
}

export interface PayResponse {
  session_id: string;
  token_sent: boolean;
  amount: string;
  expires_at: string;
}

export interface ConfirmPaymentRequest {
  session_id: string;
  token: string;
}

export interface ConfirmPaymentResponse {
  transaction_id: number;
  amount_paid: string;
  new_balance: string;
  payment_confirmed: boolean;
}
