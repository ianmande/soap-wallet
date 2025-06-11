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

export interface GetTransactionHistoryRequest {
  documento: string;
  celular: string;
  limit?: number;
  offset?: number;
}

export interface TransactionHistoryItem {
  transaction_id: number;
  type: "recharge" | "payment" | "payment_confirmation";
  amount: string;
  balance_before: string;
  balance_after: string;
  description: string;
  created_at: string;
  status: "completed" | "pending" | "failed";
}

export interface GetTransactionHistoryResponse {
  wallet_id: number;
  client_name: string;
  total_transactions: number;
  current_balance: string;
  transactions: TransactionHistoryItem[];
}
