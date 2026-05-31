/**
 * Controller de Ideias - FASE 3 (Autenticação Supabase)
 * 
 * Responsabilidades:
 * - Validação de entrada
 * - Orquestração entre serviços
 * - Formatação de respostas
 * - Tratamento de erros
 * - Usar req.user.id (NUNCA userId do body)
 * 
 * @author Backend Sênior
 * @version 3.0.0
 */

import { getGeminiService } from '../services/GeminiService.js';
import { getIdeaService } from '../services/IdeaService.js';

const geminiService = getGeminiService();
const ideaService = getIdeaService();

/**
 * POST /api/ideas/analyze
 * Fluxo completo: Validação → Extração de user → Hash → Deduplicação → IA → Persistência
 * 
 * ORDEM OBRIGATÓRIA:
 * 1. Validar entrada
 * 2. Extrair user_id do req.user (autenticado)
 * 3. Gerar hash da ideia
 * 4. Verificar duplicação
 * 5. Chamar IA (Gemini)
 * 6. Salvar no Supabase
 * 7. Retornar resposta
 * 
 * Body:
 * - nome: string (obrigatório)
 * - categoria: string (obrigatório)
 * - empolgacao: number 1-5 (obrigatório)
 * - motivo: string (obrigatório)
 */
export async function analyzeIdea(req, res, next) {
  try {
    const { nome, categoria, empolgacao, motivo } = req.body;

    // 1️⃣ VALIDAÇÃO
    if (!nome || !categoria || !empolgacao || !motivo) {
      return res.status(400).json({
        success: false,
        error: 'Dados incompletos. Até ideias abandonadas merecem informações completas!',
      });
    }

    if (empolgacao < 1 || empolgacao > 5) {
      return res.status(400).json({
        success: false,
        error: 'A empolgação deve estar entre 1 e 5. Nem tudo na vida é extremo!',
      });
    }

    // 2️⃣ EXTRAIR USER_ID DO REQ.USER (AUTENTICADO)
    const userId = req.user.id;
    const userEmail = req.user.email;

    console.log(`📨 Requisição recebida de ${userEmail}:`, { nome, categoria, empolgacao, motivo });

    // 3️⃣ GERAR HASH
    const ideaHash = ideaService.generateIdeaHash(nome, motivo);

    // 4️⃣ VERIFICAR DUPLICAÇÃO
    const existingIdea = await ideaService.findIdeaByHash(ideaHash, userId);
    if (existingIdea) {
      console.log(`⚠️  Ideia duplicada para usuário ${userId}`);
      return res.status(200).json({
        success: true,
        data: {
          id: existingIdea.id,
          nome: existingIdea.nome,
          categoria: existingIdea.categoria,
          empolgacao: existingIdea.empolgacao,
          survival_percentage: existingIdea.survival_percentage,
          cause_of_death_summary: existingIdea.cause_of_death_summary,
          ai_verdict: existingIdea.ai_verdict,
          honor_count: existingIdea.honor_count,
          status: existingIdea.status,
          isDuplicate: true,
          created_at: existingIdea.created_at,
        },
        message: '⚠️  Esta ideia já foi analisada antes! Retornando análise anterior.',
      });
    }

    // 5️⃣ CHAMAR IA (GEMINI)
    console.log('🤖 Iniciando análise com IA...');
    const analysis = await geminiService.analyzeIdea({
      nome,
      categoria,
      empolgacao,
      motivo,
    });

    // 6️⃣ SALVAR NO SUPABASE VIA IDEASERVICE
    console.log('💾 Salvando ideia no Supabase...');
    const idea = await ideaService.createIdea({
      nome,
      categoria,
      empolgacao,
      motivo,
      analysis,
      userId, // ✅ USER_ID REAL DO REQ.USER
    });

    // 7️⃣ RETORNAR RESPOSTA
    res.status(200).json({
      success: true,
      data: {
        id: idea.id,
        nome: idea.nome,
        categoria: idea.categoria,
        empolgacao: idea.empolgacao,
        survival_percentage: idea.survival_percentage,
        cause_of_death_summary: idea.cause_of_death_summary,
        ai_verdict: idea.ai_verdict,
        honor_count: idea.honor_count,
        status: idea.status,
        isDuplicate: idea.isDuplicate || false,
        created_at: idea.created_at,
      },
      message: '✅ Ideia analisada e salva com sucesso!',
    });
  } catch (error) {
    console.error('❌ Erro ao analisar ideia:', error.message);
    next(error);
  }
}

/**
 * GET /api/ideas
 * Lista ideias do usuário autenticado com filtros
 * 
 * Query params:
 * - status: 'active' | 'archived' | 'all' (default: 'active')
 * - limit: number (default: 50)
 * - offset: number (default: 0)
 */
export async function listIdeas(req, res, next) {
  try {
    const { status = 'active', limit = 50, offset = 0 } = req.query;
    const userId = req.user.id; // ✅ USER_ID DO REQ.USER

    console.log(`📋 Listando ideias do usuário ${userId}: status=${status}`);

    const result = await ideaService.listIdeas({
      status,
      userId, // ✅ FILTRAR POR USUÁRIO
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: result.ideas,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.offset + result.limit < result.total,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao listar ideias:', error.message);
    next(error);
  }
}

/**
 * GET /api/ideas/:id
 * Obtém uma ideia específica (apenas se pertencer ao usuário)
 */
export async function getIdea(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ✅ USER_ID DO REQ.USER

    console.log(`🔍 Buscando ideia: ${id} (usuário: ${userId})`);

    const idea = await ideaService.getIdea(id, userId); // ✅ VALIDAR PROPRIEDADE

    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Ideia não encontrada ou acesso negado',
      });
    }

    res.status(200).json({
      success: true,
      data: idea,
    });
  } catch (error) {
    console.error('❌ Erro ao obter ideia:', error.message);
    next(error);
  }
}

/**
 * POST /api/ideas/:id/honor
 * Adiciona uma homenagem a uma ideia
 */
export async function honorIdea(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ✅ USER_ID DO REQ.USER

    console.log(`🎉 Adicionando homenagem à ideia: ${id} (usuário: ${userId})`);

    const honorData = await ideaService.incrementHonor(id, userId); // ✅ VALIDAR PROPRIEDADE

    res.status(200).json({
      success: true,
      data: honorData,
      message: 'Homenagem adicionada com sucesso!',
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar homenagem:', error.message);
    next(error);
  }
}

/**
 * POST /api/ideas/:id/revive
 * "Ressuscita" uma ideia (arquiva com delete lógico)
 */
export async function reviveIdea(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id; // ✅ USER_ID DO REQ.USER

    console.log(`💀 Ressuscitando ideia: ${id} (usuário: ${userId})`);

    const archivedIdea = await ideaService.archiveIdea(id, userId); // ✅ VALIDAR PROPRIEDADE

    res.status(200).json({
      success: true,
      data: archivedIdea,
      message: 'Ideia ressuscitada e arquivada com honra!',
    });
  } catch (error) {
    console.error('❌ Erro ao ressuscitar ideia:', error.message);
    next(error);
  }
}

/**
 * GET /api/ideas/stats/user
 * Obtém estatísticas do usuário autenticado
 */
export async function getStatistics(req, res, next) {
  try {
    const userId = req.user.id; // ✅ USER_ID DO REQ.USER

    console.log(`📊 Obtendo estatísticas para usuário: ${userId}`);

    const stats = await ideaService.getStatistics(userId); // ✅ FILTRAR POR USUÁRIO

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error.message);
    next(error);
  }
}

export default {
  analyzeIdea,
  listIdeas,
  getIdea,
  honorIdea,
  reviveIdea,
  getStatistics,
};
