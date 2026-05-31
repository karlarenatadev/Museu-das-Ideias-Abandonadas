import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

function handleNetworkError(error) {
  if (
    error instanceof TypeError &&
    error.message.includes('Failed to fetch')
  ) {
    throw new Error(
      'Nao foi possivel conectar ao backend (http://localhost:3001). Verifique se o servidor backend esta em execucao.',
    );
  }

  throw error;
}

export async function analyzeIdea(ideaData) {
  try {
    const response = await fetch(API_ENDPOINTS.analyzeIdea, {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(ideaData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error || `Erro ${response.status}: Falha ao analisar ideia`;
      throw new Error(errorMessage);
    }

    return data.data;
  } catch (error) {
    console.error('❌ Erro ao analisar ideia:', error);
    handleNetworkError(error);
    throw error;
  }
}

export async function listIdeas({ status = 'all', limit = 100, offset = 0 } = {}) {
  try {
    const params = new URLSearchParams({
      status,
      limit: String(limit),
      offset: String(offset),
    });

    const response = await fetch(`${API_ENDPOINTS.ideas}?${params.toString()}`, {
      headers: authService.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || 'Nao foi possivel carregar as ideias');
    }

    return data;
  } catch (error) {
    console.error('Erro ao listar ideias:', error);
    handleNetworkError(error);
  }
}

export async function reviveIdea(ideaId) {
  try {
    const response = await fetch(API_ENDPOINTS.ideaRevive(ideaId), {
      method: 'POST',
      headers: authService.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || 'Nao foi possivel registrar a tentativa');
    }

    return data.data;
  } catch (error) {
    console.error('Erro ao ressuscitar ideia:', error);
    handleNetworkError(error);
  }
}

export async function lightCandle(ideaId) {
  try {
    const response = await fetch(API_ENDPOINTS.ideaCandle(ideaId), {
      method: 'POST',
      headers: authService.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || 'Nao foi possivel acender a vela');
    }

    return data.data;
  } catch (error) {
    console.error('Erro ao acender vela:', error);
    handleNetworkError(error);
  }
}

export async function markIdeaDeadAgain(ideaId, reason = '') {
  try {
    const response = await fetch(API_ENDPOINTS.ideaDieAgain(ideaId), {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || 'Nao foi possivel registrar a nova morte');
    }

    return data.data;
  } catch (error) {
    console.error('Erro ao registrar nova morte:', error);
    handleNetworkError(error);
  }
}

export async function checkApiHealth() {
  try {
    const response = await fetch(API_ENDPOINTS.health);
    return response.ok;
  } catch (error) {
    console.error('❌ API offline:', error);
    return false;
  }
}

export async function subscribeToAlerts(email) {
  try {
    const response = await fetch(API_ENDPOINTS.subscribeAlerts, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || 'Nao foi possivel assinar os alertas');
    }

    return data;
  } catch (error) {
    console.error('Erro ao assinar alertas:', error);

    handleNetworkError(error);
  }
}
