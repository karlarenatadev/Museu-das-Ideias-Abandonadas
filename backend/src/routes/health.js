/**
 * Rota de health check.
 */

import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "O Museu das Ideias Abandonadas está de portas abertas!",
    timestamp: new Date().toISOString(),
  });
});

export default router;
