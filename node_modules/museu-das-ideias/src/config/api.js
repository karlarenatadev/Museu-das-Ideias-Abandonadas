/**
 * Configuração da API
 * Centraliza as URLs dos endpoints do backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  analyzeIdea: `${API_BASE_URL}/api/analisar-ideia`
};

export default API_BASE_URL;
