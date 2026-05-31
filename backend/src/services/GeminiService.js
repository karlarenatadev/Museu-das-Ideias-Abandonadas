/**
 * AI service.
 *
 * Keeps the public API used by the existing code (`analisarIdeia` and
 * `getGeminiService`) while selecting the provider at runtime:
 * - AI_PROVIDER=openrouter uses OpenRouter
 * - otherwise Gemini is used
 */

import { getModel } from "../config/gemini.js";
import logger from "../config/logger.js";

const PERSONA_PROMPT = `
Voce e a Curadora do Caos, guardia do Museu das Ideias Abandonadas.
Sua missao e analisar projetos que nunca sairam do papel com um tom analitico,
observador, levemente sarcastico e respeitoso.
O humor deve apontar para padroes humanos universais, nunca para humilhar o criador.
`.trim();

const ANALYSIS_SCHEMA = `
Retorne APENAS um objeto JSON valido, sem markdown, com estas chaves:
{
  "survival_percentage": number,
  "cause_of_death_summary": "frase curta em no maximo 10 palavras",
  "ai_verdict": "paragrafo de 2-3 frases"
}
`.trim();

function buildAnalysisPrompt({ nome, categoria, empolgacao, motivo }) {
  return `
${PERSONA_PROMPT}

Analise esta ideia abandonada:

Nome da ideia: ${nome}
Categoria: ${categoria}
Empolgacao inicial: ${empolgacao}/5
Motivo do abandono: ${motivo}

${ANALYSIS_SCHEMA}

Seja criativa, especifica e levemente sarcastica.
Nao use o termo "fracasso", nao culpe o usuario e nao diga que a pessoa desistiu.
Termine com uma nota de identificacao ou esperanca discreta.
`.trim();
}

function stripJsonMarkdown(text) {
  return String(text || "")
    .replace(/```json\s?/gi, "")
    .replace(/```\s?/g, "")
    .trim();
}

function parseAnalysis(rawText) {
  const cleaned = stripJsonMarkdown(rawText);
  const jsonText = cleaned.startsWith("{")
    ? cleaned
    : cleaned.match(/\{[\s\S]*\}/)?.[0];
  let analysis;

  try {
    analysis = JSON.parse(jsonText);
  } catch (error) {
    logger.error({ rawText: cleaned, err: error.message }, "Resposta da IA nao e JSON valido");
    throw new Error("Resposta da IA em formato invalido.");
  }

  const survival = Number(analysis.survival_percentage);
  if (
    !Number.isFinite(survival) ||
    typeof analysis.cause_of_death_summary !== "string" ||
    typeof analysis.ai_verdict !== "string"
  ) {
    logger.error({ analysis }, "Resposta da IA sem os campos esperados");
    throw new Error("Resposta da IA com campos ausentes ou invalidos.");
  }

  return {
    survival_percentage: Math.max(0, Math.min(100, Math.round(survival))),
    cause_of_death_summary: analysis.cause_of_death_summary.trim(),
    ai_verdict: analysis.ai_verdict.trim(),
  };
}

class GeminiService {
  constructor() {
    this.provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY;
    this.openRouterModel =
      process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-001";
  }

  async analyzeIdea(ideia) {
    return this.analisarIdeia(ideia);
  }

  async analisarIdeia(ideia) {
    const provider = this.resolveProvider();

    logger.info(
      {
        provider,
        nome: ideia.nome,
        categoria: ideia.categoria,
        hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
        hasOpenRouterApiKey: Boolean(this.openRouterApiKey),
        openRouterModel: provider === "openrouter" ? this.openRouterModel : undefined,
      },
      "Enviando ideia para analise de IA"
    );

    const prompt = buildAnalysisPrompt(ideia);
    const rawText =
      provider === "openrouter"
        ? await this.callOpenRouter(prompt)
        : await this.callGemini(prompt);

    const analysis = parseAnalysis(rawText);
    logger.info(
      { provider, survival_percentage: analysis.survival_percentage },
      "Analise de IA concluida"
    );
    return analysis;
  }

  resolveProvider() {
    if (this.provider === "openrouter") {
      if (!this.openRouterApiKey) {
        logger.error(
          { provider: this.provider, hasOpenRouterApiKey: false },
          "AI_PROVIDER=openrouter sem OPENROUTER_API_KEY"
        );
        throw new Error("OPENROUTER_API_KEY nao configurada para AI_PROVIDER=openrouter.");
      }

      return "openrouter";
    }

    return "gemini";
  }

  async callGemini(prompt) {
    const result = await getModel().generateContent(prompt);
    return result.response.text();
  }

  async callOpenRouter(prompt) {
    if (!this.openRouterApiKey) {
      throw new Error("OPENROUTER_API_KEY nao configurada.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
        "X-Title": "Museu das Ideias Abandonadas",
      },
      body: JSON.stringify({
        model: this.openRouterModel,
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Voce responde sempre em JSON valido e nunca usa markdown.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      logger.error({ status: response.status, payload }, "Erro do OpenRouter");
      throw new Error(payload?.error?.message || "Falha ao chamar OpenRouter.");
    }

    return payload?.choices?.[0]?.message?.content;
  }

  async generateShareText({ nome, survival_percentage = 0, honor_count = 0 }) {
    return `O Museu tentou compartilhar "${nome}", mas a vergonha historica foi forte demais. Sobrevivencia: ${survival_percentage}%. Homenagens: ${honor_count}.`;
  }

  async generateEpitaph({ nome, survival_percentage = 0, honor_count = 0 }) {
    return `${nome}: viveu entre abas abertas, partiu com ${survival_percentage}% de chance e recebeu ${honor_count} homenagens.`;
  }
}

let geminiService;

export function getGeminiService() {
  if (!geminiService) {
    geminiService = new GeminiService();
  }
  return geminiService;
}

export async function analisarIdeia(ideia) {
  return getGeminiService().analisarIdeia(ideia);
}

export default GeminiService;
