/**
 * Serviço de comunicação com a API do backend
 * Gerencia todas as requisições relacionadas a ideias abandonadas
 */

import { API_ENDPOINTS } from '../config/api';

/**
 * Envia uma ideia para análise da IA
 * @param {Object} ideaData - Dados da ideia
 * @param {string} ideaData.nome - Nome da ideia
 * @param {string} ideaData.categoria - Categoria da ideia
 * @param {number} ideaData.empolgacao - Nível de empolgação (1-5)
 * @param {string} ideaData.motivo - Motivo do abandono
 * @returns {Promise<Object>} Análise da IA
 * @throws {Error} Se houver erro na requisição
 */
export async function analyzeIdea(ideaData) {
  try {
    // Usar URL relativa para funcionar em qualquer ambiente
    const endpoint = '/api/analisar-ideia';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ideaData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao analisar ideia');
    }

    return data.data; // Retorna apenas o objeto data
  } catch (error) {
    console.error('Erro ao analisar ideia:', error);
    throw error;
  }
}

/**
 * Verifica se a API está online
 * @returns {Promise<boolean>}
 */
export async function checkApiHealth() {
  try {
    // Usar URL relativa para funcionar em qualquer ambiente
    const response = await fetch('/api/health');
    return response.ok;
  } catch (error) {
    console.error('API offline:', error);
    return false;
  }
}
