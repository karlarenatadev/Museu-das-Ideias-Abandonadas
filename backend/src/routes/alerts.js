/**
 * Rota POST /api/assinar-alertas
 *
 * Recebe um e-mail e envia confirmacao de assinatura do museu.
 */

import { Router } from "express";
import { sendSubscriptionEmail } from "../services/MailService.js";
import logger from "../config/logger.js";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/assinar-alertas", async (req, res) => {
  const email = String(req.body?.email ?? "").trim();

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Forneca um e-mail valido para assinar os alertas.",
    });
  }

  try {
    await sendSubscriptionEmail(email);

    return res.status(200).json({
      success: true,
      message: "E-mail de confirmacao enviado com sucesso.",
    });
  } catch (error) {
    logger.error({ err: error.message }, "Erro ao enviar e-mail de assinatura");

    const isConfigError = error.message.includes("incompleta no servidor");
    const canSimulateInDev = isConfigError && process.env.NODE_ENV !== "production";

    if (canSimulateInDev) {
      logger.warn(
        { email },
        "SMTP ausente em ambiente local; assinatura registrada como simulada"
      );

      return res.status(200).json({
        success: true,
        devMode: true,
        message:
          "Inscricao registrada em modo desenvolvimento. E-mail nao enviado.",
      });
    }

    return res.status(isConfigError ? 500 : 502).json({
      success: false,
      ...(isConfigError && { code: "EMAIL_NOT_CONFIGURED" }),
      message: isConfigError
        ? "Envio de e-mail nao configurado neste ambiente."
        : "Nao foi possivel enviar o aviso agora.",
      error: isConfigError
        ? "Envio de e-mail nao configurado neste ambiente."
        : "Nao foi possivel enviar o aviso agora.",
      ...(process.env.NODE_ENV === "development" && { details: error.message }),
    });
  }
});

export default router;
