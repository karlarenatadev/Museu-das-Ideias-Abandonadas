/**
 * Middleware de log de requisições HTTP.
 * Registra método, path, status e tempo de resposta em formato estruturado.
 */

import logger from "../config/logger.js";

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
      ip: req.ip,
    });
  });

  next();
}
