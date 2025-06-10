import { Request, Response, NextFunction } from "express";
import { ValidationError } from "joi";
import { ApiResponse, ErrorCodes } from "../types/index";

interface CustomError extends Error {
  isJoi?: boolean;
  details?: Array<{ message: string }>;
  response?: {
    status?: number;
    data?: any;
  };
  code?: string;
}

export const errorHandler = (
  err: CustomError | ValidationError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error capturado:", err);

  if ("isJoi" in err && err.isJoi) {
    const joiError = err as ValidationError;
    res.status(400).json({
      success: false,
      cod_error: ErrorCodes.VALIDATION_ERROR,
      message_error: `Error de validación: ${joiError.details[0]?.message}`,
      data: null,
    } as ApiResponse);
    return;
  }

  if (
    "code" in err &&
    (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND")
  ) {
    res.status(503).json({
      success: false,
      cod_error: ErrorCodes.SERVICE_UNAVAILABLE,
      message_error: "Servicio SOAP no disponible",
      data: null,
    } as ApiResponse);
    return;
  }

  if ((err as any).statusCode) {
    const statusCode = (err as any).statusCode as number;
    res.status(statusCode).json({
      success: false,
      cod_error: statusCode.toString(),
      message_error: err.message,
      data: null,
    } as ApiResponse);
    return;
  }

  res.status(500).json({
    success: false,
    cod_error: ErrorCodes.INTERNAL_ERROR,
    message_error: "Error interno del servidor",
    data: null,
  } as ApiResponse);
};
