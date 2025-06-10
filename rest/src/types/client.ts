export interface RegisterClientRequest {
  documento: string;
  nombres: string;
  email: string;
  celular: string;
}

export interface RegisterClientResponse {
  client_id: number;
  document: string;
  names: string;
  email: string;
  phone: string;
  wallet_id: number;
  initial_balance: string;
}
