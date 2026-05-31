/**
 * Configuração da API
 * Centraliza as URLs dos endpoints do backend
 * Usa `VITE_API_URL` se definido, caso contrário usa localhost em dev
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  baseUrl: API_BASE_URL,
  health: `${API_BASE_URL}/api/health`,
  analyzeIdea: `${API_BASE_URL}/api/analisar-ideia`,
  analyzeIdeaV2: `${API_BASE_URL}/api/ideas/analyze`,
  login: `${API_BASE_URL}/api/auth/login`,
  signup: `${API_BASE_URL}/api/auth/signup`,
  me: `${API_BASE_URL}/api/auth/me`,
  ideas: `${API_BASE_URL}/api/ideas`,
  ideaHonor: (ideaId) => `${API_BASE_URL}/api/ideas/${ideaId}/honor`,
  ideaCandle: (ideaId) => `${API_BASE_URL}/api/ideas/${ideaId}/candle`,
  ideaRevive: (ideaId) => `${API_BASE_URL}/api/ideas/${ideaId}/revive`,
  ideaDieAgain: (ideaId) => `${API_BASE_URL}/api/ideas/${ideaId}/die-again`,
  subscribeAlerts: `${API_BASE_URL}/api/assinar-alertas`,
};

export default API_BASE_URL;
