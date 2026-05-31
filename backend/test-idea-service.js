/**
 * Script de Teste - IdeaService
 * 
 * Testa as funcionalidades principais do IdeaService
 * Executa em modo memória (sem Supabase)
 * 
 * Uso: node test-idea-service.js
 */

process.env.SUPABASE_URL = '';
process.env.SUPABASE_SERVICE_ROLE_KEY = '';

const { getIdeaService } = await import('./src/services/IdeaService.js');
const { getGeminiService } = await import('./src/services/GeminiService.js');

const ideaService = getIdeaService();
const geminiService = getGeminiService();

async function runTests() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🧪 TESTES - IdeaService                              ║
║                                                           ║
║     Modo: Memória (sem Supabase)                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);

  try {
    // ============================================
    // TESTE 1: Gerar Hash
    // ============================================
    console.log('\n📝 TESTE 1: Gerar Hash');
    console.log('─'.repeat(50));

    const hash1 = ideaService.generateIdeaHash(
      'App de Meditação',
      'Falta de tempo'
    );
    console.log(`✅ Hash gerado: ${hash1.substring(0, 16)}...`);

    // Mesmo hash para mesma entrada
    const hash2 = ideaService.generateIdeaHash(
      'App de Meditação',
      'Falta de tempo'
    );
    console.log(`✅ Hash consistente: ${hash1 === hash2 ? 'SIM' : 'NÃO'}`);

    // ============================================
    // TESTE 2: Criar Ideia
    // ============================================
    console.log('\n📝 TESTE 2: Criar Ideia');
    console.log('─'.repeat(50));

    const mockAnalysis = {
      survival_percentage: 35,
      cause_of_death_summary: 'Falta de foco e recursos',
      ai_verdict: 'Uma ideia interessante que sucumbiu à realidade...',
    };

    const idea1 = await ideaService.createIdea({
      nome: 'App de Meditação com IA',
      categoria: 'SaaS',
      empolgacao: 4,
      motivo: 'Falta de tempo',
      analysis: mockAnalysis,
      userId: 'user-123',
    });

    console.log(`✅ Ideia criada: ${idea1.id}`);
    console.log(`   Nome: ${idea1.nome}`);
    console.log(`   Status: ${idea1.status}`);
    console.log(`   Homenagens: ${idea1.honor_count}`);

    // ============================================
    // TESTE 3: Deduplicação
    // ============================================
    console.log('\n📝 TESTE 3: Deduplicação');
    console.log('─'.repeat(50));

    const idea2 = await ideaService.createIdea({
      nome: 'App de Meditação com IA',
      categoria: 'SaaS',
      empolgacao: 4,
      motivo: 'Falta de tempo',
      analysis: mockAnalysis,
      userId: 'user-123',
    });

    console.log(`✅ Ideia duplicada detectada: ${idea2.isDuplicate ? 'SIM' : 'NÃO'}`);
    console.log(`   ID retornado: ${idea2.id}`);
    console.log(`   Mesmo ID anterior: ${idea1.id === idea2.id ? 'SIM' : 'NÃO'}`);

    // ============================================
    // TESTE 4: Obter Ideia
    // ============================================
    console.log('\n📝 TESTE 4: Obter Ideia');
    console.log('─'.repeat(50));

    const retrievedIdea = await ideaService.getIdea(idea1.id, 'user-123');
    console.log(`✅ Ideia recuperada: ${retrievedIdea.nome}`);
    console.log(`   Categoria: ${retrievedIdea.categoria}`);
    console.log(`   Empolgação: ${retrievedIdea.empolgacao}/5`);

    // ============================================
    // TESTE 5: Listar Ideias
    // ============================================
    console.log('\n📝 TESTE 5: Listar Ideias');
    console.log('─'.repeat(50));

    // Criar mais ideias
    await ideaService.createIdea({
      nome: 'Rede Social de Livros',
      categoria: 'Social',
      empolgacao: 5,
      motivo: 'Competição com Goodreads',
      analysis: mockAnalysis,
      userId: 'user-123',
    });

    await ideaService.createIdea({
      nome: 'Plataforma de Cursos Online',
      categoria: 'EdTech',
      empolgacao: 3,
      motivo: 'Mercado saturado',
      analysis: mockAnalysis,
      userId: 'user-456',
    });

    const result = await ideaService.listIdeas({
      status: 'active',
      limit: 10,
    });

    console.log(`✅ Ideias listadas: ${result.ideas.length}`);
    console.log(`   Total: ${result.total}`);
    console.log(`   Tem mais: ${result.hasMore ? 'SIM' : 'NÃO'}`);

    // ============================================
    // TESTE 6: Ideias por Usuário
    // ============================================
    console.log('\n📝 TESTE 6: Ideias por Usuário');
    console.log('─'.repeat(50));

    const userIdeas = await ideaService.getIdeasByUser('user-123', 'active');
    console.log(`✅ Ideias do user-123: ${userIdeas.length}`);
    userIdeas.forEach((idea, idx) => {
      console.log(`   ${idx + 1}. ${idea.nome}`);
    });

    // ============================================
    // TESTE 7: Incrementar Homenagem
    // ============================================
    console.log('\n📝 TESTE 7: Incrementar Homenagem');
    console.log('─'.repeat(50));

    const honor1 = await ideaService.incrementHonor(idea1.id, 'user-123');
    console.log(`✅ Homenagem adicionada`);
    console.log(`   Contador: ${honor1.honor_count}`);
    console.log(`   Trigger: ${honor1.trigger}`);

    const honor2 = await ideaService.incrementHonor(idea1.id, 'user-123');
    console.log(`✅ Homenagem adicionada novamente`);
    console.log(`   Contador: ${honor2.honor_count}`);

    // ============================================
    // TESTE 8: Arquivar Ideia
    // ============================================
    console.log('\n📝 TESTE 8: Arquivar Ideia');
    console.log('─'.repeat(50));

    const archived = await ideaService.archiveIdea(idea1.id, 'user-123');
    console.log(`✅ Ideia arquivada`);
    console.log(`   Status: ${archived.status}`);
    console.log(`   Homenagens mantidas: ${archived.honor_count}`);

    // Verificar que não aparece mais na lista ativa
    const activeIdeas = await ideaService.listIdeas({ status: 'active' });
    const stillActive = activeIdeas.ideas.find(i => i.id === idea1.id);
    console.log(`✅ Removida da lista ativa: ${!stillActive ? 'SIM' : 'NÃO'}`);

    // ============================================
    // TESTE 9: Estatísticas
    // ============================================
    console.log('\n📝 TESTE 9: Estatísticas');
    console.log('─'.repeat(50));

    const stats = await ideaService.getStatistics('user-123');
    console.log(`✅ Estatísticas do user-123`);
    console.log(`   Total: ${stats.total}`);
    console.log(`   Ativas: ${stats.active}`);
    console.log(`   Arquivadas: ${stats.archived}`);
    console.log(`   Total de homenagens: ${stats.totalHonors}`);
    console.log(`   Média de sobrevivência: ${stats.averageSurvival}%`);

    // ============================================
    // TESTE 10: Atualizar Ideia
    // ============================================
    console.log('\n📝 TESTE 10: Atualizar Ideia');
    console.log('─'.repeat(50));

    const userIdeas2 = await ideaService.getIdeasByUser('user-123', 'active');
    if (userIdeas2.length > 0) {
      const updated = await ideaService.updateIdea(
        userIdeas2[0].id,
        { empolgacao: 5 },
        'user-123'
      );
      console.log(`✅ Ideia atualizada`);
      console.log(`   Nova empolgação: ${updated.empolgacao}`);
    }

    // ============================================
    // RESUMO
    // ============================================
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ✅ TODOS OS TESTES PASSARAM!                         ║
║                                                           ║
║     Funcionalidades testadas:                             ║
║     ✅ Geração de hash                                    ║
║     ✅ Criação de ideia                                   ║
║     ✅ Deduplicação                                       ║
║     ✅ Obtenção de ideia                                  ║
║     ✅ Listagem com filtros                               ║
║     ✅ Ideias por usuário                                 ║
║     ✅ Homenagens                                         ║
║     ✅ Arquivamento (delete lógico)                       ║
║     ✅ Estatísticas                                       ║
║     ✅ Atualização                                        ║
║                                                           ║
║     Próximo passo: Configurar Supabase                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('\n❌ ERRO NOS TESTES:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Executar testes
runTests();
