import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  soapBaseUrl: process.env.SOAP_BASE_URL || "http://localhost:8000/soap",

  corsOrigin: process.env.CORS_ORIGIN || "*",
} as const;

export default config;
