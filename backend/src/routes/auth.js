import { Router } from "express";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import config from "../config/environment.js";
import { optionalAuthMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

function getSupabaseAuthClient() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;
  return createClient(config.supabaseUrl, config.supabaseAnonKey);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateCredentials(email, password) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Informe um e-mail valido.";
  }
  if (!password || String(password).length < 6) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  return null;
}

function createDevSession(email) {
  const id =
    "dev-" + crypto.createHash("sha256").update(email).digest("hex").slice(0, 16);
  return {
    token: `dev:${id}:${encodeURIComponent(email)}`,
    user: { id, email, provider: "dev" },
    mode: "dev",
  };
}

async function handleAuth(req, res, mode) {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const validationError = validateCredentials(email, password);

  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const supabase = getSupabaseAuthClient();

  if (!supabase) {
    if (config.isProduction) {
      return res.status(503).json({
        success: false,
        error: "Supabase Auth nao configurado no backend.",
      });
    }

    return res.status(200).json({ success: true, data: createDevSession(email) });
  }

  const authCall =
    mode === "signup"
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });

  const { data, error } = await authCall;
  if (error) {
    return res.status(401).json({ success: false, error: error.message });
  }

  return res.status(200).json({
    success: true,
    data: {
      token: data.session?.access_token || null,
      user: data.user
        ? { id: data.user.id, email: data.user.email, provider: "supabase" }
        : null,
      mode: "supabase",
      needsEmailConfirmation: !data.session,
    },
  });
}

router.post("/login", (req, res) => handleAuth(req, res, "login"));
router.post("/signup", (req, res) => handleAuth(req, res, "signup"));

router.get("/me", optionalAuthMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user ? { user: req.user } : { user: null },
  });
});

export default router;
