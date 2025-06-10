import Joi from "joi";
import {
  RegisterClientRequest,
  RechargeWalletRequest,
  PayRequest,
  ConfirmPaymentRequest,
  CheckBalanceRequest,
} from "../types/index";

// Validators
export const registerClientSchema = Joi.object<RegisterClientRequest>({
  documento: Joi.string()
    .trim()
    .min(6)
    .max(20)
    .pattern(/^[0-9A-Za-z]+$/)
    .required()
    .messages({
      "string.empty": "El documento es requerido",
      "string.min": "El documento debe tener al menos 6 caracteres",
      "string.max": "El documento no puede tener más de 20 caracteres",
      "string.pattern.base":
        "El documento solo puede contener números y letras",
      "any.required": "El documento es requerido",
    }),

  nombres: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/)
    .required()
    .messages({
      "string.empty": "Los nombres son requeridos",
      "string.min": "Los nombres deben tener al menos 2 caracteres",
      "string.max": "Los nombres no pueden tener más de 100 caracteres",
      "string.pattern.base":
        "Los nombres solo pueden contener letras y espacios",
      "any.required": "Los nombres son requeridos",
    }),

  email: Joi.string().trim().email().max(100).required().messages({
    "string.empty": "El email es requerido",
    "string.email": "El email debe tener un formato válido",
    "string.max": "El email no puede tener más de 100 caracteres",
    "any.required": "El email es requerido",
  }),

  celular: Joi.string()
    .trim()
    .min(10)
    .max(15)
    .pattern(/^[\+]?[0-9\-\s]+$/)
    .required()
    .messages({
      "string.empty": "El celular es requerido",
      "string.min": "El celular debe tener al menos 10 dígitos",
      "string.max": "El celular no puede tener más de 15 dígitos",
      "string.pattern.base":
        "El celular solo puede contener números, espacios, guiones y el símbolo +",
      "any.required": "El celular es requerido",
    }),
});

export const rechargeWalletSchema = Joi.object<RechargeWalletRequest>({
  documento: Joi.string()
    .trim()
    .min(6)
    .max(20)
    .pattern(/^[0-9A-Za-z]+$/)
    .required()
    .messages({
      "string.empty": "El documento es requerido",
      "string.min": "El documento debe tener al menos 6 caracteres",
      "string.max": "El documento no puede tener más de 20 caracteres",
      "string.pattern.base":
        "El documento solo puede contener números y letras",
      "any.required": "El documento es requerido",
    }),

  celular: Joi.string()
    .trim()
    .min(10)
    .max(15)
    .pattern(/^[\+]?[0-9\-\s]+$/)
    .required()
    .messages({
      "string.empty": "El celular es requerido",
      "string.min": "El celular debe tener al menos 10 dígitos",
      "string.max": "El celular no puede tener más de 15 dígitos",
      "string.pattern.base":
        "El celular solo puede contener números, espacios, guiones y el símbolo +",
      "any.required": "El celular es requerido",
    }),

  valor: Joi.number()
    .positive()
    .min(1000)
    .max(10000000)
    .precision(2)
    .required()
    .messages({
      "number.base": "El valor debe ser un número",
      "number.positive": "El valor debe ser mayor a cero",
      "number.min": "El valor mínimo de recarga es $1,000",
      "number.max": "El valor máximo de recarga es $10,000,000",
      "any.required": "El valor es requerido",
    }),
});

export const paySchema = Joi.object<PayRequest>({
  documento: Joi.string()
    .trim()
    .min(6)
    .max(20)
    .pattern(/^[0-9A-Za-z]+$/)
    .required()
    .messages({
      "string.empty": "El documento es requerido",
      "string.min": "El documento debe tener al menos 6 caracteres",
      "string.max": "El documento no puede tener más de 20 caracteres",
      "string.pattern.base":
        "El documento solo puede contener números y letras",
      "any.required": "El documento es requerido",
    }),

  celular: Joi.string()
    .trim()
    .min(10)
    .max(15)
    .pattern(/^[\+]?[0-9\-\s]+$/)
    .required()
    .messages({
      "string.empty": "El celular es requerido",
      "string.min": "El celular debe tener al menos 10 dígitos",
      "string.max": "El celular no puede tener más de 15 dígitos",
      "string.pattern.base":
        "El celular solo puede contener números, espacios, guiones y el símbolo +",
      "any.required": "El celular es requerido",
    }),

  valor: Joi.number()
    .positive()
    .min(100)
    .max(5000000)
    .precision(2)
    .required()
    .messages({
      "number.base": "El valor debe ser un número",
      "number.positive": "El valor debe ser mayor a cero",
      "number.min": "El valor mínimo de pago es $100",
      "number.max": "El valor máximo de pago es $5,000,000",
      "any.required": "El valor es requerido",
    }),
});

export const confirmPaymentSchema = Joi.object<ConfirmPaymentRequest>({
  session_id: Joi.string()
    .trim()
    .guid({ version: "uuidv4" })
    .required()
    .messages({
      "string.empty": "El ID de sesión es requerido",
      "string.guid": "El ID de sesión debe ser un UUID válido",
      "any.required": "El ID de sesión es requerido",
    }),

  token: Joi.string()
    .trim()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.empty": "El token es requerido",
      "string.length": "El token debe tener exactamente 6 dígitos",
      "string.pattern.base": "El token debe contener solo números",
      "any.required": "El token es requerido",
    }),
});

export const checkBalanceSchema = Joi.object<CheckBalanceRequest>({
  documento: Joi.string()
    .trim()
    .min(6)
    .max(20)
    .pattern(/^[0-9A-Za-z]+$/)
    .required()
    .messages({
      "string.empty": "El documento es requerido",
      "string.min": "El documento debe tener al menos 6 caracteres",
      "string.max": "El documento no puede tener más de 20 caracteres",
      "string.pattern.base":
        "El documento solo puede contener números y letras",
      "any.required": "El documento es requerido",
    }),

  celular: Joi.string()
    .trim()
    .min(10)
    .max(15)
    .pattern(/^[\+]?[0-9\-\s]+$/)
    .required()
    .messages({
      "string.empty": "El celular es requerido",
      "string.min": "El celular debe tener al menos 10 dígitos",
      "string.max": "El celular no puede tener más de 15 dígitos",
      "string.pattern.base":
        "El celular solo puede contener números, espacios, guiones y el símbolo +",
      "any.required": "El celular es requerido",
    }),
});
