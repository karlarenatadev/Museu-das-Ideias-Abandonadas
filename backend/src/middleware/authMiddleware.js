/**
 * Middleware de Autenticação Supabase
 * 
 * Responsabilidades:
 * - Validar JWT do Supabase
 * - Extrair usuário autenticado
 * - Adicionar req.user com id e email
 * - Bloquear requisições inválidas com 401
 * 
 * @author Backend Sênior
 * @version 3.0.0
 */

import { createClient } from '@supabase/supabase-js';
import config from '../config/environment.js';

// Inicializar cliente Supabase (apenas se configurado)
let supabase = null;
if (config.supabaseUrl && config.supabaseAnonKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  console.log('✅ Supabase Auth inicializado');
} else {
  console.warn('⚠️  Supabase não configurado - autenticação desabilitada');
}

/**
 * Middleware de autenticação
 * Valida token JWT e extrai usuário
 */
export async function authMiddleware(req, res, next) {
  try {
    const devUser = parseDevAuth(req);
    if (devUser) {
      req.user = devUser;
      return next();
    }

    // Se Supabase não está configurado, pula autenticação
    if (!supabase) {
      console.warn('⚠️  Supabase não configurado - pulando autenticação');
      req.user = null;
      return next();
    }

    // 1. Ler header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('⚠️  Requisição sem token de autenticação');
      return res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido',
      });
    }

    // 2. Extrair token
    const token = authHeader.substring(7); // Remove "Bearer "

    // 3. Validar token no Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.warn('⚠️  Token inválido ou expirado:', error?.message);
      return res.status(401).json({
        success: false,
        error: 'Token inválido ou expirado',
      });
    }

    // 4. Adicionar usuário ao request
    req.user = {
      id: data.user.id,
      email: data.user.email,
      metadata: data.user.user_metadata || {},
    };

    console.log(`✅ Usuário autenticado: ${req.user.email} (${req.user.id})`);

    // 5. Continuar para próximo middleware
    next();
  } catch (error) {
    console.error('❌ Erro ao validar autenticação:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao validar autenticação',
    });
  }
}

/**
 * Middleware opcional de autenticação
 * Não bloqueia se token não fornecido, mas valida se fornecido
 */
export async function optionalAuthMiddleware(req, res, next) {
  try {
    const devUser = parseDevAuth(req);
    if (devUser) {
      req.user = devUser;
      return next();
    }

    // Se Supabase não está configurado, pula autenticação
    if (!supabase) {
      req.user = null;
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Sem token, continua sem usuário
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      // Token inválido, continua sem usuário
      req.user = null;
      return next();
    }

    // Token válido, adiciona usuário
    req.user = {
      id: data.user.id,
      email: data.user.email,
      metadata: data.user.user_metadata || {},
    };

    next();
  } catch (error) {
    console.error('⚠️  Erro ao validar autenticação opcional:', error.message);
    req.user = null;
    next();
  }
}

function parseDevAuth(req) {
  if (process.env.NODE_ENV === 'production') return null;

  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer dev:')) return null;

  const [id = 'dev-user', email = 'dev@localhost'] = authHeader
    .substring('Bearer dev:'.length)
    .split(':');

  return {
    id,
    email: decodeURIComponent(email),
    metadata: { provider: 'dev' },
  };
}

/**
 * Middleware para verificar se usuário está autenticado
 * Usa req.user criado pelo authMiddleware
 * Em desenvolvimento sem Supabase, cria usuário fake
 */
export function requireAuth(req, res, next) {
  // Se Supabase não está configurado (desenvolvimento), cria usuário fake
  if (!req.user) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Modo desenvolvimento - criando usuário fake');
      req.user = {
        id: process.env.DEV_USER_ID || 'dev-user',
        email: 'dev@localhost',
        metadata: {},
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      error: 'Autenticação necessária',
    });
  }
  next();
}

export default authMiddleware;
