/**
 * Rate limiters para proteção das rotas de API.
 *
 * - apiLimiter:  limite geral para todas as rotas /api
 * - ideaLimiter: limite mais restrito para /api/analisar-ideia
 *                (cada chamada consome cota do Gemini)
 */

import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Muitas requisições. Respire fundo e tente novamente em 15 minutos.",
  },
});

export const ideaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      "Limite de análises atingido. O museu precisa de um intervalo — volte em 1 minuto.",
  },
});
