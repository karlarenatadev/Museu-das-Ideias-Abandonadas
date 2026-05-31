/**
 * Inicializa e exporta o cliente do Google Gemini como singleton.
 * Falha no boot se a chave não estiver configurada.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "./logger.js";

let model;

export function initGemini() {
  if ((process.env.AI_PROVIDER || "gemini").toLowerCase() === "openrouter") {
    logger.info("Google Gemini nao inicializado: AI_PROVIDER=openrouter");
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada no arquivo .env");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  logger.info("Google Gemini inicializado (gemini-2.5-flash)");
}

export function getModel() {
  if (!model) {
    throw new Error("Gemini não foi inicializado. Chame initGemini() no boot.");
  }
  return model;
}
