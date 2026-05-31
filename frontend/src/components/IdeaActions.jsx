/**
 * Ações de Ideia
 * Componente para reviver, homenagear e compartilhar ideias
 */

import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { authService } from '../services/authService';

export default function IdeaActions({ ideaId, onActionComplete }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleRevive = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch(`${API_ENDPOINTS.baseUrl}/api/ideas/${ideaId}/revive`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao reviver ideia');
      }

      const data = await response.json();

      setFeedback({
        type: 'success',
        message: '💀 Ideia revivida com sucesso!',
      });
      if (onActionComplete) onActionComplete();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao reviver ideia',
      });
      console.error('Erro ao reviver:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHonor = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch(`${API_ENDPOINTS.baseUrl}/api/ideas/${ideaId}/honor`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao homenagear ideia');
      }

      const data = await response.json();

      setFeedback({
        type: 'success',
        message: `🏆 Homenagem adicionada! (Total: ${data.data?.honor_count || 1})`,
      });
      if (onActionComplete) onActionComplete();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao homenagear ideia',
      });
      console.error('Erro ao homenagear:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      // Compartilhamento simples - copia o link para clipboard
      const shareUrl = `${window.location.origin}?idea=${ideaId}`;
      await navigator.clipboard.writeText(shareUrl);
      
      setFeedback({
        type: 'success',
        message: '📋 Link copiado! Compartilhe com seus amigos.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Erro ao compartilhar ideia',
      });
      console.error('Erro ao compartilhar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="idea-actions">
      <div className="actions-buttons">
        <button
          className="btn btn-action honor-btn"
          onClick={handleHonor}
          disabled={loading}
          title="Homenagear esta ideia"
        >
          🏆 Homenagear
        </button>

        <button
          className="btn btn-action share-btn"
          onClick={handleShare}
          disabled={loading}
          title="Compartilhar no WhatsApp"
        >
          📤 Compartilhar
        </button>

        <button
          className="btn btn-action revive-btn"
          onClick={handleRevive}
          disabled={loading}
          title="Arquivar esta ideia"
        >
          💀 Reviver
        </button>
      </div>

      {feedback && (
        <div className={`feedback feedback-${feedback.type}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
}
