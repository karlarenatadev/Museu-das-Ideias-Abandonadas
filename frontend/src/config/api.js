/**
 * Configuração da API
 * Centraliza as URLs dos endpoints do backend
 * 
 * Usa URLs relativas para funcionar em qualquer ambiente
 * (desenvolvimento local, staging, produção)
 */

<<<<<<< HEAD
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://museu-das-ideias-abandonadas.onrender.com';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  analyzeIdea: `${API_BASE_URL}/api/analisar-ideia`,
};
=======
export const API_ENDPOINTS = {
  health: '/api/health',
  analyzeIdea: '/api/analisar-ideia'
};

export default '/api';
>>>>>>> karlarenata
