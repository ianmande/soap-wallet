export interface RechargeWalletRequest {
  documento: string;
  celular: string;
  valor: number;
}

export interface RechargeWalletResponse {
  wallet_id: number;
  previous_balance: string;
  amount_added: string;
  new_balance: string;
  transaction_id: number;
}

export interface CheckBalanceRequest {
  documento: string;
  celular: string;
}

export interface CheckBalanceResponse {
  wallet_id: number;
  current_balance: string;
  client_name: string;
  last_transaction_date: string;
}
