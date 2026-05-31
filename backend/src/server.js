/**
 * MUSEU DAS IDEIAS ABANDONADAS — Backend API
 *
 * Ponto de entrada do servidor. Responsável apenas por:
 *   1. Carregar variáveis de ambiente
 *   2. Inicializar dependências externas (Gemini, Mailer)
 *   3. Montar middlewares e rotas
 *   4. Subir o servidor HTTP
 *
 * Lógica de negócio vive em src/services.
 * Rotas vivem em src/routes.
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import logger from "./config/logger.js";
import { initGemini } from "./config/gemini.js";
import { initMailer } from "./config/mailer.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { requestLogger } from "./middleware/requestLogger.js";

import healthRouter from "./routes/health.js";
import ideasRouter from "./routes/ideas.js";
import alertsRouter from "./routes/alerts.js";
import aiRouter from "./routes/ai.js";
import authRouter from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

// ─── Inicializa dependências externas ────────────────────────────────────────

try {
  initGemini();
} catch (error) {
  logger.fatal({ err: error.message }, "Falha ao inicializar Gemini — encerrando");
  process.exit(1);
}

initMailer(); // não crítico — servidor sobe mesmo sem SMTP configurado

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//const frontendPath = path.join(__dirname, "../../frontend/dist");
const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean)
);

// ─── Middlewares globais ──────────────────────────────────────────────────────

app.use(helmet());                                           // headers de segurança HTTP
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
  })
);                                                          // CORS para as origens locais do frontend
app.use(express.json({ limit: "20kb" }));                    // body JSON com limite de tamanho
app.use(requestLogger);                                      // log estruturado de cada requisição
app.use("/api", apiLimiter);                                 // rate limit geral para toda a API

// ─── Arquivos estáticos do frontend ──────────────────────────────────────────

//if (fs.existsSync(frontendPath)) {
//  //app.use(express.static(frontendPath));
//  logger.info({ frontendPath }, "Servindo arquivos estáticos do frontend");
//} else {
//  logger.warn({ frontendPath }, "Build do frontend não encontrado — modo API only");
//}

// ─── Rotas da API ─────────────────────────────────────────────────────────────

app.use("/api", healthRouter);
app.use("/", healthRouter);
app.use("/api", ideasRouter);
app.use("/api", alertsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

// ─── 404 e SPA fallback ───────────────────────────────────────────────────────

app.use((req, res) => {
    return res.status(404).json({
      error: "Esta rota também foi abandonada... assim como suas ideias! 💀",
    });

  const indexPath = path.join(frontendPath, "index.html");

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return res.status(404).send("Frontend não encontrado.");
});

// ─── Boot ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      env: process.env.NODE_ENV || "development",
      frontend: process.env.FRONTEND_URL,
    },
    "Servidor iniciado"
  );
});

// ─── Tratamento de erros não capturados ───────────────────────────────────────

process.on("unhandledRejection", (error) => {
  logger.error({ err: error }, "Unhandled rejection");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught exception — encerrando");
  process.exit(1);
});
