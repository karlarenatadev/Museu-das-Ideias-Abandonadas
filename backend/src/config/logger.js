/**
 * Logger estruturado com pino.
 * Em produção emite JSON puro; em dev usa pino-pretty para legibilidade.
 */

import pino from "pino";

const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info",
    base: { service: "museu-das-ideias-backend" },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  process.env.NODE_ENV !== "production"
    ? pino.transport({ target: "pino-pretty", options: { colorize: true } })
    : undefined
);

export default logger;
