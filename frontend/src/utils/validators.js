/**
 * Funções de Validação Compartilhadas (Frontend)
 * Mesmas validações do backend para consistência
 */

/**
 * Valida se um email é válido
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida dados de uma ideia
 * @param {Object} ideaData - Dados da ideia
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export function validateIdeaData(ideaData) {
  const errors = [];

  if (!ideaData.nome || typeof ideaData.nome !== 'string' || ideaData.nome.trim().length === 0) {
    errors.push('Nome da ideia é obrigatório');
  }

  if (!ideaData.categoria || typeof ideaData.categoria !== 'string' || ideaData.categoria.trim().length === 0) {
    errors.push('Categoria é obrigatória');
  }

  if (typeof ideaData.empolgacao !== 'number' || ideaData.empolgacao < 1 || ideaData.empolgacao > 5) {
    errors.push('Empolgação deve ser um número entre 1 e 5');
  }

  if (!ideaData.motivo || typeof ideaData.motivo !== 'string' || ideaData.motivo.trim().length === 0) {
    errors.push('Motivo do abandono é obrigatório');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida dados de assinatura de newsletter
 * @param {string} email - Email a validar
 * @returns {Object} { isValid: boolean, error: string | null }
 */
export function validateNewsletterData(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email é obrigatório' };
  }

  const trimmedEmail = email.trim();
  if (!isValidEmail(trimmedEmail)) {
    return { isValid: false, error: 'Email inválido' };
  }

  return { isValid: true, error: null };
}
