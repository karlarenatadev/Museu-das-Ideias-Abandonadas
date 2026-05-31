/**
 * Middleware de validação do corpo da requisição para /api/analisar-ideia.
 *
 * Valida presença, tipos, ranges e tamanho máximo dos campos
 * antes de permitir que a requisição chegue ao handler.
 */

const MAX_NOME_LENGTH = 120;
const MAX_MOTIVO_LENGTH = 500;

export function validateIdeia(req, res, next) {
  const { nome, categoria, empolgacao, motivo } = req.body ?? {};

  // Presença
  if (!nome || !categoria || empolgacao == null || !motivo) {
    return res.status(400).json({
      success: false,
      error:
        "Dados incompletos. Até ideias abandonadas merecem informações completas!",
    });
  }

  // Tipos
  if (typeof nome !== "string" || typeof motivo !== "string") {
    return res.status(400).json({
      success: false,
      error: "Os campos nome e motivo devem ser texto.",
    });
  }

  // Tamanho máximo — prevenção de prompt injection por volume
  if (nome.trim().length > MAX_NOME_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `O nome da ideia deve ter no máximo ${MAX_NOME_LENGTH} caracteres.`,
    });
  }

  if (motivo.trim().length > MAX_MOTIVO_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `O motivo deve ter no máximo ${MAX_MOTIVO_LENGTH} caracteres.`,
    });
  }

  // Range de empolgação
  const emp = Number(empolgacao);
  if (!Number.isInteger(emp) || emp < 1 || emp > 5) {
    return res.status(400).json({
      success: false,
      error: "A empolgação deve ser um número inteiro entre 1 e 5.",
    });
  }

  // Sanitização leve: remove tags HTML para evitar prompt injection via markup
  req.body.nome = nome.trim().replace(/<[^>]*>/g, "");
  req.body.motivo = motivo.trim().replace(/<[^>]*>/g, "");
  req.body.categoria = String(categoria).trim().replace(/<[^>]*>/g, "");
  req.body.empolgacao = emp;

  next();
}
