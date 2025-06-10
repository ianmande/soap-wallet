export interface ApiResponse<T = any> {
  success: boolean;
  cod_error: string;
  message_error: string;
  data: T | null;
}

export enum ErrorCodes {
  SUCCESS = "00",
  VALIDATION_ERROR = "01",
  REGISTER_ERROR = "02",
  CLIENT_NOT_FOUND = "03",
  WALLET_INACTIVE = "04",
  RECHARGE_ERROR = "05",
  INSUFFICIENT_BALANCE = "06",
  PAYMENT_ERROR = "07",
  INVALID_TOKEN = "08",
  CONFIRM_ERROR = "09",
  BALANCE_ERROR = "10",
  NOT_FOUND = "404",
  SERVICE_UNAVAILABLE = "503",
  INTERNAL_ERROR = "99",
}
