/**
 * Serviço de Ideias - Lógica de Negócio
 * 
 * Responsabilidades:
 * - Gerenciar ciclo de vida das ideias
 * - Deduplicação baseada em hash
 * - Persistência em banco de dados
 * - Sistema de homenagens
 * - Ressurreição de ideias (delete lógico)
 * - Segurança e validação
 * 
 * @author Backend Sênior
 * @version 1.0.0
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import config from '../config/environment.js';

class IdeaService {
  constructor() {
    this.ideasMemory = new Map();
    this.ideaEventsMemory = [];
    // Inicializar Supabase se credenciais disponíveis
    if (config.supabaseUrl && config.supabaseServiceRoleKey) {
      this.supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
      console.log('✅ Supabase inicializado com sucesso');
    } else {
      console.warn('⚠️  Supabase não configurado. Usando modo em memória.');
      this.supabase = null;
      // Fallback em memória para desenvolvimento
      this.ideasMemory = new Map();
    }
  }

  shouldFallbackToMemory(error) {
    if (config.isProduction) return false;
    const message = String(error?.message || '').toLowerCase();
    return (
      error?.code === 'PGRST205' ||
      error?.code === '42P01' ||
      message.includes('schema cache') ||
      message.includes('could not find the table') ||
      (message.includes('relation') && message.includes('does not exist'))
    );
  }

  isMissingLifecycleColumn(error) {
    const message = String(error?.message || '').toLowerCase();
    return (
      error?.code === 'PGRST204' ||
      message.includes('revival_attempts') ||
      message.includes('last_revived_at') ||
      message.includes('died_again_at') ||
      message.includes('death_count') ||
      message.includes('last_death_reason') ||
      (message.includes('schema cache') && message.includes('column'))
    );
  }

  isMissingSeedColumn(error) {
    const message = String(error?.message || '').toLowerCase();
    return (
      this.isMissingLifecycleColumn(error) ||
      message.includes('source') ||
      message.includes('is_seed')
    );
  }

  fallbackToMemory(error) {
    if (!this.shouldFallbackToMemory(error)) return false;
    console.warn(`Supabase indisponivel/incompleto em desenvolvimento (${error.message}). Usando memoria.`);
    this.supabase = null;
    return true;
  }

  orderMuseumIdeas(ideas, userId = null) {
    return [...ideas].sort((a, b) => {
      const aUserIdea = userId && a.user_id === userId && !a.is_seed && a.source !== 'curadoria';
      const bUserIdea = userId && b.user_id === userId && !b.is_seed && b.source !== 'curadoria';

      if (aUserIdea !== bUserIdea) return aUserIdea ? -1 : 1;

      const aDate = new Date(a.created_at || 0).getTime();
      const bDate = new Date(b.created_at || 0).getTime();
      return bDate - aDate;
    });
  }

  /**
   * Gera hash único para uma ideia baseado em nome + descrição
   * Usado para deduplicação
   * 
   * @param {string} nome - Nome da ideia
   * @param {string} descricao - Descrição/motivo da ideia
   * @returns {string} Hash SHA-256
   */
  generateIdeaHash(nome, descricao) {
    const combined = `${nome.toLowerCase().trim()}|${descricao.toLowerCase().trim()}`;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    console.log(`🔐 Hash gerado para "${nome}": ${hash.substring(0, 8)}...`);
    return hash;
  }

  /**
   * Verifica se uma ideia já existe no banco
   * 
   * @param {string} ideaHash - Hash da ideia
   * @param {string} userId - ID do usuário (opcional)
   * @returns {Promise<Object|null>} Ideia existente ou null
   */
  async findIdeaByHash(ideaHash, userId = null) {
    try {
      if (this.supabase) {
        let query = this.supabase
          .from('ideas')
          .select('*')
          .eq('idea_hash', ideaHash)
          .in('status', ['active', 'abandoned', 'reviving', 'dead_again']);

        // Se userId fornecido, filtrar por usuário
        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows found (esperado)
          throw error;
        }

        if (data) {
          console.log(`✅ Ideia duplicada encontrada: ${data.id}`);
          return data;
        }

        return null;
      } else {
        // Fallback em memória
        for (const idea of this.ideasMemory.values()) {
          if (
            idea.idea_hash === ideaHash &&
            ['active', 'abandoned', 'reviving', 'dead_again'].includes(idea.status)
          ) {
            if (!userId || idea.user_id === userId) {
              console.log(`✅ Ideia duplicada encontrada (memória): ${idea.id}`);
              return idea;
            }
          }
        }
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao buscar ideia por hash:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.findIdeaByHash(ideaHash, userId);
      }
      throw error;
    }
  }

  /**
   * Cria uma nova ideia no banco de dados
   * 
   * @param {Object} ideaData - Dados da ideia
   * @param {string} ideaData.nome - Nome da ideia
   * @param {string} ideaData.categoria - Categoria
   * @param {number} ideaData.empolgacao - Nível de empolgação (1-5)
   * @param {string} ideaData.motivo - Motivo do abandono
   * @param {Object} ideaData.analysis - Análise da IA
   * @param {string} ideaData.userId - ID do usuário (OBRIGATÓRIO em produção)
   * @returns {Promise<Object>} Ideia criada
   */
  async createIdea(ideaData) {
    try {
      const {
        nome,
        categoria,
        empolgacao,
        motivo,
        analysis,
        userId,
      } = ideaData;

      // Validação
      if (!nome || !categoria || !empolgacao || !motivo || !analysis) {
        throw new Error('Dados incompletos para criar ideia');
      }

      if (!userId) {
        throw new Error('userId é obrigatório para criar ideia');
      }

      if (empolgacao < 1 || empolgacao > 5) {
        throw new Error('Empolgação deve estar entre 1 e 5');
      }

      // Gerar hash
      const ideaHash = this.generateIdeaHash(nome, motivo);

      // Verificar duplicação (apenas para este usuário)
      const existingIdea = await this.findIdeaByHash(ideaHash, userId);
      if (existingIdea) {
        console.log(`⚠️  Ideia duplicada detectada para usuário ${userId}`);
        return {
          ...existingIdea,
          isDuplicate: true,
        };
      }

      // Preparar dados para inserção
      const newIdea = {
        idea_hash: ideaHash,
        nome,
        categoria,
        empolgacao,
        motivo,
        survival_percentage: analysis.survival_percentage,
        cause_of_death_summary: analysis.cause_of_death_summary,
        ai_verdict: analysis.ai_verdict,
        honor_count: 0,
        status: 'abandoned',
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (this.supabase) {
        // Inserir no Supabase
        const { data, error } = await this.supabase
          .from('ideas')
          .insert([newIdea])
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log(`✅ Ideia criada com sucesso: ${data.id} (usuário: ${userId})`);
        return data;
      } else {
        // Fallback em memória
        const id = crypto.randomUUID();
        const ideaWithId = { ...newIdea, id };
        this.ideasMemory.set(id, ideaWithId);
        console.log(`✅ Ideia criada em memória: ${id}`);
        return ideaWithId;
      }
    } catch (error) {
      console.error('❌ Erro ao criar ideia:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.createIdea(ideaData);
      }
      throw error;
    }
  }

  async seedCuratorIdeas(seedIdeas, { userId = 'curadoria' } = {}) {
    let inserted = 0;
    let skipped = 0;

    for (const seedIdea of seedIdeas) {
      const ideaHash = this.generateIdeaHash(seedIdea.nome, seedIdea.motivo);
      const existingIdea = await this.findIdeaByHash(ideaHash, userId);

      if (existingIdea) {
        skipped += 1;
        continue;
      }

      const newIdea = {
        idea_hash: ideaHash,
        nome: seedIdea.nome,
        categoria: seedIdea.categoria,
        empolgacao: seedIdea.empolgacao,
        motivo: seedIdea.motivo,
        survival_percentage: seedIdea.survival_percentage,
        cause_of_death_summary: seedIdea.cause_of_death_summary,
        ai_verdict: seedIdea.ai_verdict,
        honor_count: 0,
        status: 'abandoned',
        user_id: userId,
        revival_attempts: 0,
        last_revived_at: null,
        died_again_at: null,
        death_count: 1,
        last_death_reason: '',
        source: 'curadoria',
        is_seed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (this.supabase) {
        try {
          const { error } = await this.supabase
            .from('ideas')
            .insert([newIdea]);

          if (error) throw error;
        } catch (error) {
          if (!this.isMissingSeedColumn(error)) {
            throw error;
          }

          console.warn(
            'Colunas de seed/lifecycle ausentes. Inserindo seed com campos basicos; rode backend/sql/20260531_idea_lifecycle.sql para metadados completos.',
          );
          const {
            revival_attempts,
            last_revived_at,
            died_again_at,
            death_count,
            last_death_reason,
            source,
            is_seed,
            ...basicIdea
          } = newIdea;

          const { error: basicError } = await this.supabase
            .from('ideas')
            .insert([basicIdea]);

          if (basicError) throw basicError;
        }
      } else {
        const id = crypto.randomUUID();
        this.ideasMemory.set(id, { ...newIdea, id });
      }

      inserted += 1;
    }

    return { inserted, skipped };
  }

  /**
   * Obtém uma ideia pelo ID
   * 
   * @param {string} ideaId - ID da ideia
   * @param {string} userId - ID do usuário (para validação de segurança)
   * @returns {Promise<Object|null>} Ideia ou null
   */
  async getIdea(ideaId, userId = null) {
    try {
      if (this.supabase) {
        let query = this.supabase
          .from('ideas')
          .select('*')
          .eq('id', ideaId);

        // Validação de segurança: usuário só pode acessar suas próprias ideias
        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query.single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        return data || null;
      } else {
        // Fallback em memória
        const idea = this.ideasMemory.get(ideaId);
        if (idea && (!userId || idea.user_id === userId)) {
          return idea;
        }
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao obter ideia:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.getIdea(ideaId, userId);
      }
      throw error;
    }
  }

  /**
   * Lista ideias com filtros
   * 
   * @param {Object} options - Opções de filtro
   * @param {string} options.status - Status: 'active', 'archived', 'all'
   * @param {string} options.userId - ID do usuário (para segurança)
   * @param {number} options.limit - Limite de resultados
   * @param {number} options.offset - Offset para paginação
   * @returns {Promise<Array>} Lista de ideias
   */
  async listIdeas(options = {}) {
    try {
      const {
        status = 'active',
        userId = null,
        curatorUserId = null,
        limit = 50,
        offset = 0,
      } = options;

      if (this.supabase) {
        let query = this.supabase
          .from('ideas')
          .select('*', { count: 'exact' });

        // Filtrar por status
        if (status === 'active') {
          query = query.in('status', ['active', 'abandoned', 'reviving', 'dead_again']);
        } else if (status !== 'all') {
          query = query.eq('status', status);
        }

        // Filtrar por usuário (segurança)
        if (userId && curatorUserId) {
          query = query.or(
            `user_id.eq.${userId},and(user_id.eq.${curatorUserId},is_seed.eq.true),and(source.eq.curadoria,is_seed.eq.true)`
          );
        } else if (userId) {
          query = query.eq('user_id', userId);
        }

        // Ordenar por data de criação (mais recentes primeiro)
        query = query.order('created_at', { ascending: false });

        // Paginação
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        const orderedIdeas = this.orderMuseumIdeas(data, userId);

        console.log(`✅ ${orderedIdeas.length} ideias listadas (total: ${count})`);
        return {
          ideas: orderedIdeas,
          total: count,
          limit,
          offset,
        };
      } else {
        // Fallback em memória
        let ideas = Array.from(this.ideasMemory.values());

        // Filtrar por status
        if (status === 'active') {
          ideas = ideas.filter(idea => ['active', 'abandoned', 'reviving', 'dead_again'].includes(idea.status));
        } else if (status !== 'all') {
          ideas = ideas.filter(idea => idea.status === status);
        }

        // Filtrar por usuário
        if (userId && curatorUserId) {
          ideas = ideas.filter(idea => (
            idea.user_id === userId ||
            (idea.user_id === curatorUserId && idea.is_seed) ||
            (idea.source === 'curadoria' && idea.is_seed)
          ));
        } else if (userId) {
          ideas = ideas.filter(idea => idea.user_id === userId);
        }

        // Ordenar
        ideas = this.orderMuseumIdeas(ideas, userId);

        // Paginação
        const total = ideas.length;
        ideas = ideas.slice(offset, offset + limit);

        return {
          ideas,
          total,
          limit,
          offset,
        };
      }
    } catch (error) {
      console.error('❌ Erro ao listar ideias:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.listIdeas(options);
      }
      throw error;
    }
  }

  /**
   * Obtém ideias de um usuário específico
   * 
   * @param {string} userId - ID do usuário
   * @param {string} status - Status das ideias
   * @returns {Promise<Array>} Ideias do usuário
   */
  async getIdeasByUser(userId, status = 'active') {
    try {
      if (!userId) {
        throw new Error('userId é obrigatório');
      }

      const result = await this.listIdeas({
        status,
        userId,
        limit: 1000, // Sem limite prático
      });

      console.log(`✅ ${result.ideas.length} ideias encontradas para usuário ${userId}`);
      return result.ideas;
    } catch (error) {
      console.error('❌ Erro ao obter ideias do usuário:', error.message);
      throw error;
    }
  }

  /**
   * Incrementa contador de homenagens
   * 
   * @param {string} ideaId - ID da ideia
   * @param {string} userId - ID do usuário (para validação)
   * @returns {Promise<Object>} Dados de homenagem com trigger visual
   */
  async incrementHonor(ideaId, userId = null, eventType = 'honor') {
    try {
      // Validação de segurança: verificar se ideia pertence ao usuário
      const idea = await this.getIdea(ideaId, userId);
      if (!idea) {
        throw new Error('Ideia não encontrada ou acesso negado');
      }

      const newHonorCount = (idea.honor_count || 0) + 1;

      let updatedIdea;
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('ideas')
          .update({
            honor_count: newHonorCount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', ideaId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        updatedIdea = data;
      } else {
        // Fallback em memória
        const storedIdea = this.ideasMemory.get(ideaId);
        if (storedIdea) {
          storedIdea.honor_count = newHonorCount;
          storedIdea.updated_at = new Date().toISOString();
          updatedIdea = storedIdea;
        } else {
          throw new Error('Ideia não encontrada');
        }
      }

      try {
        await this.registerEvent(ideaId, userId, eventType, 1);
      } catch (eventError) {
        console.warn(`Evento da ideia nao registrado (${eventError.message}). Contador principal preservado.`);
      }

      console.log(`🎉 Homenagem adicionada: ${updatedIdea.honor_count} homenagens`);
      return {
        honor_count: updatedIdea.honor_count,
        trigger: 'celebration',
        message: `Ideia homenageada! Total: ${updatedIdea.honor_count}`,
      };
    } catch (error) {
      console.error('❌ Erro ao incrementar homenagem:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.incrementHonor(ideaId, userId, eventType);
      }
      throw error;
    }
  }

  async registerEvent(ideaId, userId = null, type = 'honor', points = 0, metadata = {}) {
    try {
      const newEvent = {
        id: crypto.randomUUID(),
        idea_id: ideaId,
        user_id: userId,
        type,
        points,
        metadata,
        created_at: new Date().toISOString(),
      };

      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('idea_events')
          .insert([newEvent])
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data;
      }

      this.ideaEventsMemory.push(newEvent);
      return newEvent;
    } catch (error) {
      console.error('❌ Erro ao registrar evento da ideia:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.registerEvent(ideaId, userId, type, points, metadata);
      }
      throw error;
    }
  }

  async lightCandle(ideaId, userId = null) {
    try {
      await this.incrementHonor(ideaId, userId, 'candle_light');
      return this.getIdea(ideaId, userId);
    } catch (error) {
      console.error('❌ Erro ao acender vela:', error.message);
      throw error;
    }
  }

  /**
   * Arquiva uma ideia (delete lógico)
   * Muda status para 'archived' e remove da lista ativa
   * 
   * @param {string} ideaId - ID da ideia
   * @param {string} userId - ID do usuário (para validação)
   * @returns {Promise<Object>} Ideia arquivada
   */
  async reviveIdea(ideaId, userId = null) {
    try {
      const idea = await this.getIdea(ideaId, userId);
      if (!idea) {
        throw new Error('Ideia nao encontrada ou acesso negado');
      }

      const updates = {
        status: 'reviving',
        revival_attempts: Number(idea.revival_attempts || 0) + 1,
        last_revived_at: new Date().toISOString(),
      };

      let updatedIdea;
      try {
        updatedIdea = await this.updateIdea(ideaId, updates, userId);
      } catch (error) {
        if (!this.isMissingLifecycleColumn(error)) {
          throw error;
        }

        console.warn('Colunas de historico de ressurreicao ausentes. Persistindo apenas status.');
        updatedIdea = await this.updateIdea(ideaId, { status: updates.status }, userId);
      }

      try {
        await this.registerEvent(ideaId, userId, 'revive', 3, {
          revival_attempts: updates.revival_attempts,
        });
      } catch (eventError) {
        console.warn(`Evento de ressurreicao nao registrado (${eventError.message}).`);
      }

      return updatedIdea;
    } catch (error) {
      console.error('Erro ao registrar tentativa de ressurreicao:', error.message);
      throw error;
    }
  }

  async markDeadAgain(ideaId, userId = null, { reason = '' } = {}) {
    try {
      const idea = await this.getIdea(ideaId, userId);
      if (!idea) {
        throw new Error('Ideia nao encontrada ou acesso negado');
      }

      const updates = {
        status: 'dead_again',
        death_count: Number(idea.death_count || 0) + 1,
        died_again_at: new Date().toISOString(),
        last_death_reason: String(reason || '').trim(),
      };

      let updatedIdea;
      try {
        updatedIdea = await this.updateIdea(ideaId, updates, userId);
      } catch (error) {
        if (!this.isMissingLifecycleColumn(error)) {
          throw error;
        }

        console.warn('Colunas de historico de nova morte ausentes. Persistindo apenas status.');
        updatedIdea = await this.updateIdea(ideaId, { status: updates.status }, userId);
      }

      try {
        await this.registerEvent(ideaId, userId, 'die_again', 2, {
          death_count: updates.death_count,
          reason: updates.last_death_reason,
        });
      } catch (eventError) {
        console.warn(`Evento de nova morte nao registrado (${eventError.message}).`);
      }

      return updatedIdea;
    } catch (error) {
      console.error('Erro ao registrar nova morte:', error.message);
      throw error;
    }
  }

  async archiveIdea(ideaId, userId = null) {
    try {
      // Validação de segurança
      const idea = await this.getIdea(ideaId, userId);
      if (!idea) {
        throw new Error('Ideia não encontrada ou acesso negado');
      }

      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('ideas')
          .update({
            status: 'archived',
            updated_at: new Date().toISOString(),
          })
          .eq('id', ideaId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log(`💀 Ideia arquivada: ${data.id}`);
        return {
          ...data,
          message: 'Ideia ressuscitada e arquivada com honra',
        };
      } else {
        // Fallback em memória
        const idea = this.ideasMemory.get(ideaId);
        if (idea) {
          idea.status = 'archived';
          idea.updated_at = new Date().toISOString();
          console.log(`💀 Ideia arquivada (memória): ${idea.id}`);
          return {
            ...idea,
            message: 'Ideia ressuscitada e arquivada com honra',
          };
        }
        throw new Error('Ideia não encontrada');
      }
    } catch (error) {
      console.error('❌ Erro ao arquivar ideia:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.archiveIdea(ideaId, userId);
      }
      throw error;
    }
  }

  /**
   * Atualiza uma ideia
   * 
   * @param {string} ideaId - ID da ideia
   * @param {Object} updates - Campos a atualizar
   * @param {string} userId - ID do usuário (para validação)
   * @returns {Promise<Object>} Ideia atualizada
   */
  async updateIdea(ideaId, updates, userId = null) {
    try {
      // Validação de segurança
      const idea = await this.getIdea(ideaId, userId);
      if (!idea) {
        throw new Error('Ideia não encontrada ou acesso negado');
      }

      // Não permitir atualizar campos críticos
      const forbiddenFields = ['id', 'idea_hash', 'user_id', 'created_at'];
      forbiddenFields.forEach(field => {
        delete updates[field];
      });

      // Adicionar timestamp de atualização
      updates.updated_at = new Date().toISOString();

      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('ideas')
          .update(updates)
          .eq('id', ideaId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log(`✏️  Ideia atualizada: ${data.id}`);
        return data;
      } else {
        // Fallback em memória
        const idea = this.ideasMemory.get(ideaId);
        if (idea) {
          Object.assign(idea, updates);
          console.log(`✏️  Ideia atualizada (memória): ${idea.id}`);
          return idea;
        }
        throw new Error('Ideia não encontrada');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar ideia:', error.message);
      throw error;
    }
  }

  /**
   * Deleta uma ideia fisicamente (operação irreversível)
   * Usar com cuidado - preferir archiveIdea para delete lógico
   * 
   * @param {string} ideaId - ID da ideia
   * @param {string} userId - ID do usuário (para validação)
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async deleteIdea(ideaId, userId = null) {
    try {
      // Validação de segurança
      const idea = await this.getIdea(ideaId, userId);
      if (!idea) {
        throw new Error('Ideia não encontrada ou acesso negado');
      }

      console.warn(`⚠️  DELETANDO FISICAMENTE ideia: ${ideaId}`);

      if (this.supabase) {
        const { error } = await this.supabase
          .from('ideas')
          .delete()
          .eq('id', ideaId);

        if (error) {
          throw error;
        }

        console.log(`🗑️  Ideia deletada fisicamente: ${ideaId}`);
        return true;
      } else {
        // Fallback em memória
        this.ideasMemory.delete(ideaId);
        console.log(`🗑️  Ideia deletada fisicamente (memória): ${ideaId}`);
        return true;
      }
    } catch (error) {
      console.error('❌ Erro ao deletar ideia:', error.message);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de ideias
   * 
   * @param {string} userId - ID do usuário (opcional)
   * @returns {Promise<Object>} Estatísticas
   */
  async getStatistics(userId = null) {
    try {
      if (this.supabase) {
        let query = this.supabase
          .from('ideas')
          .select('status, honor_count, survival_percentage', { count: 'exact' });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error, count } = await query;

        if (error) {
          throw error;
        }

        const stats = {
          total: count,
          active: data.filter(i => ['active', 'abandoned', 'reviving', 'dead_again'].includes(i.status)).length,
          archived: data.filter(i => i.status === 'archived').length,
          totalHonors: data.reduce((sum, i) => sum + (i.honor_count || 0), 0),
          averageSurvival: data.length > 0
            ? Math.round(data.reduce((sum, i) => sum + i.survival_percentage, 0) / data.length)
            : 0,
        };

        console.log(`📊 Estatísticas: ${stats.total} ideias, ${stats.totalHonors} homenagens`);
        return stats;
      } else {
        // Fallback em memória
        const ideas = Array.from(this.ideasMemory.values());
        const filtered = userId ? ideas.filter(i => i.user_id === userId) : ideas;

        const stats = {
          total: filtered.length,
          active: filtered.filter(i => ['active', 'abandoned', 'reviving', 'dead_again'].includes(i.status)).length,
          archived: filtered.filter(i => i.status === 'archived').length,
          totalHonors: filtered.reduce((sum, i) => sum + (i.honor_count || 0), 0),
          averageSurvival: filtered.length > 0
            ? Math.round(filtered.reduce((sum, i) => sum + i.survival_percentage, 0) / filtered.length)
            : 0,
        };

        return stats;
      }
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error.message);
      if (this.fallbackToMemory(error)) {
        return this.getStatistics(userId);
      }
      throw error;
    }
  }
}

// Singleton
let ideaService;

export function getIdeaService() {
  if (!ideaService) {
    ideaService = new IdeaService();
  }
  return ideaService;
}

export default IdeaService;
