/**
 * MUSEU DAS IDEIAS ABANDONADAS - Backend API
 * 
 * Servidor Express que atua como ponte entre o frontend React
 * e a API do Google Gemini para análise de ideias abandonadas.
 * 
 * @author Backend Sênior
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Carrega variáveis de ambiente do arquivo .env
dotenv.config();

// Inicializa o Express
const app = express();  
const PORT = process.env.PORT || 3002;

// Configuração de diretórios para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend/dist');

// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Parse de JSON no body das requisições

// Servir arquivos estáticos do frontend
app.use(express.static(frontendPath));

// Inicializa o cliente do Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Rota de health check para verificar se o servidor está rodando
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'O Museu das Ideias Abandonadas está de portas abertas!' 
  });
});

/**
 * POST /api/analisar-ideia
 * 
 * Endpoint principal que recebe dados de uma ideia abandonada
 * e retorna uma análise sarcástica e poética da IA.
 * 
 * @body {string} nome - Nome da ideia abandonada
 * @body {string} categoria - Categoria da ideia (ex: app, startup, projeto pessoal)
 * @body {number} empolgacao - Nível de empolgação inicial (1-5)
 * @body {string} motivo - Motivo do abandono
 * 
 * @returns {object} Análise da IA com survival_percentage, cause_of_death_summary e ai_verdict
 */
app.post('/api/analisar-ideia', async (req, res) => {
  try {
    // Extrai dados do corpo da requisição
    const { nome, categoria, empolgacao, motivo } = req.body;

    // Validação básica dos campos obrigatórios
    if (!nome || !categoria || !empolgacao || !motivo) {
      return res.status(400).json({
        error: 'Dados incompletos. Até ideias abandonadas merecem informações completas!'
      });
    }

    // Validação do range de empolgação
    if (empolgacao < 1 || empolgacao > 5) {
      return res.status(400).json({
        error: 'A empolgação deve estar entre 1 e 5. Nem tudo na vida é extremo!'
      });
    }

    // Constrói o prompt para a IA com a persona da "Curadora do Caos"
    const prompt = `
Você é a **Curadora do Caos**, guardiã do Museu das Ideias Abandonadas. 
Sua missão é analisar projetos que nunca saíram do papel com um tom analítico, 
poético sobre o fracasso e levemente sarcástico - mas sempre confortando o criador.

Analise esta ideia abandonada:

📋 **Nome da Ideia:** ${nome}
🏷️ **Categoria:** ${categoria}
🔥 **Empolgação Inicial:** ${empolgacao}/5
💀 **Motivo do Abandono:** ${motivo}

Retorne APENAS um objeto JSON válido (sem markdown, sem \`\`\`json, sem formatação extra) com estas três chaves:

{
  "survival_percentage": [número de 0 a 100 representando as chances de sobrevivência da ideia],
  "cause_of_death_summary": "[frase curta e poética resumindo o fracasso em no máximo 10 palavras]",
  "ai_verdict": "[parágrafo de 2-3 frases com veredito sarcástico mas reconfortante, celebrando o fracasso como parte do processo criativo]"
}

Seja criativa, poética e levemente cruel - mas sempre termine com uma nota de esperança.
`;

    // Envia o prompt para o modelo Gemini
    console.log('🤖 Enviando ideia para análise da Curadora do Caos...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiText = response.text();

    console.log('📥 Resposta bruta da IA:', aiText);

    // Remove possíveis marcações markdown que a IA possa ter adicionado
    aiText = aiText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Faz o parse do JSON retornado pela IA
    const aiAnalysis = JSON.parse(aiText);

    // Validação da estrutura da resposta
    if (
      typeof aiAnalysis.survival_percentage !== 'number' ||
      typeof aiAnalysis.cause_of_death_summary !== 'string' ||
      typeof aiAnalysis.ai_verdict !== 'string'
    ) {
      throw new Error('Resposta da IA em formato inválido');
    }

    // Retorna a análise limpa para o frontend
    console.log('✅ Análise concluída com sucesso!');
    res.status(200).json({
      success: true,
      data: {
        survival_percentage: aiAnalysis.survival_percentage,
        cause_of_death_summary: aiAnalysis.cause_of_death_summary,
        ai_verdict: aiAnalysis.ai_verdict
      }
    });

  } catch (error) {
    // Log do erro para debugging
    console.error('❌ Erro ao processar ideia:', error);

    // Retorna erro com mensagem temática
    res.status(500).json({
      success: false,
      error: 'A Curadora do Caos teve um colapso existencial tentando processar tanto fracasso de uma vez. Tente novamente em breve.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Rota 404 - Captura rotas não encontradas
 */
app.use((req, res) => {
  // Se for uma requisição de API, retorna erro 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      error: 'Esta rota também foi abandonada... assim como suas ideias! 💀'
    });
  }
  
  // Caso contrário, serve o index.html (SPA fallback)
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/**
 * Inicia o servidor
 */
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🏛️  MUSEU DAS IDEIAS ABANDONADAS - Backend API       ║
║                                                           ║
║     Servidor rodando em: http://localhost:${PORT}        ║
║     Ambiente: ${process.env.NODE_ENV || 'development'}                      ║
║                                                           ║
║     Endpoints disponíveis:                                ║
║     • GET  /health                                        ║
║     • POST /api/analisar-ideia                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Erro não tratado:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exceção não capturada:', error);
  process.exit(1);
});
