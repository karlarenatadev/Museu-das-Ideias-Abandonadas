/**
 * Middleware de Tratamento de Erros Centralizado
 * Captura e formata todos os erros da aplicação
 */

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: err.message,
    });
  }

  // Erro de autenticação
  if (err.name === 'AuthenticationError' || err.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Não autenticado',
      details: err.message,
    });
  }

  // Erro de autorização
  if (err.name === 'AuthorizationError' || err.status === 403) {
    return res.status(403).json({
      success: false,
      error: 'Não autorizado',
      details: err.message,
    });
  }

  // Erro não encontrado
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'Recurso não encontrado',
      details: err.message,
    });
  }

  // Erro genérico
  const statusCode = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
