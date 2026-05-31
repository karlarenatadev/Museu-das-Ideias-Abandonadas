/**
 * Controller de IA
 * Gerencia endpoints específicos de IA (análise, compartilhamento, epitáfio)
 */

import { getGeminiService } from '../services/GeminiService.js';

const geminiService = getGeminiService();

/**
 * POST /ai/analyze-idea
 * Análise completa de uma ideia
 * 
 * @body {string} nome - Nome da ideia
 * @body {string} categoria - Categoria
 * @body {number} empolgacao - Nível de empolgação (1-5)
 * @body {string} motivo - Motivo do abandono
 * 
 * @returns {Object} Análise com survival_percentage, cause_of_death_summary, ai_verdict
 */
export async function analyzeIdea(req, res, next) {
  try {
    const { nome, categoria, empolgacao, motivo } = req.body;

    // Validação
    if (!nome || !categoria || !empolgacao || !motivo) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: nome, categoria, empolgacao, motivo',
      });
    }

    if (empolgacao < 1 || empolgacao > 5) {
      return res.status(400).json({
        success: false,
        error: 'Empolgação deve estar entre 1 e 5',
      });
    }

    const analysis = await geminiService.analyzeIdea({
      nome,
      categoria,
      empolgacao,
      motivo,
    });

    res.status(200).json({
      success: true,
      data: {
        resumo: `Análise de "${nome}"`,
        categoria,
        impacto_emocional: analysis.survival_percentage,
        emocao_predominante: analysis.cause_of_death_summary,
        sugestao_criativa: analysis.ai_verdict,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao analisar ideia:', error.message);
    next(error);
  }
}

/**
 * POST /ai/share-text
 * Gera texto de compartilhamento para WhatsApp
 * 
 * @body {string} nome - Nome da ideia
 * @body {number} survival_percentage - Taxa de sobrevivência
 * @body {number} honor_count - Número de homenagens
 * 
 * @returns {Object} Mensagem formatada para compartilhamento
 */
export async function generateShareText(req, res, next) {
  try {
    const { nome, survival_percentage, honor_count } = req.body;

    if (!nome) {
      return res.status(400).json({
        success: false,
        error: 'Campo obrigatório: nome',
      });
    }

    const shareText = await geminiService.generateShareText({
      nome,
      survival_percentage: survival_percentage || 0,
      honor_count: honor_count || 0,
    });

    res.status(200).json({
      success: true,
      data: {
        mensagem: shareText,
        url_whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao gerar texto de compartilhamento:', error.message);
    next(error);
  }
}

/**
 * POST /ai/epitaph
 * Gera epitáfio para ideia "revivida"
 * 
 * @body {string} nome - Nome da ideia
 * @body {number} survival_percentage - Taxa de sobrevivência
 * @body {number} honor_count - Número de homenagens
 * 
 * @returns {Object} Epitáfio poético
 */
export async function generateEpitaph(req, res, next) {
  try {
    const { nome, survival_percentage, honor_count } = req.body;

    if (!nome) {
      return res.status(400).json({
        success: false,
        error: 'Campo obrigatório: nome',
      });
    }

    const epitaph = await geminiService.generateEpitaph({
      nome,
      survival_percentage: survival_percentage || 0,
      honor_count: honor_count || 0,
    });

    res.status(200).json({
      success: true,
      data: {
        epitafio: epitaph,
        tipo: 'revived_idea',
      },
    });
  } catch (error) {
    console.error('❌ Erro ao gerar epitáfio:', error.message);
    next(error);
  }
}

export default {
  analyzeIdea,
  generateShareText,
  generateEpitaph,
};
