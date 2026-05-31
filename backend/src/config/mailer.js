/**
 * Cria e exporta o transporter do Nodemailer como singleton.
 * Deve ser inicializado uma única vez no boot do servidor.
 */

import nodemailer from "nodemailer";
import logger from "./logger.js";

let transporter;

export function initMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } =
    process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    logger.warn(
      "Configuração SMTP incompleta — envio de e-mails desabilitado."
    );
    return;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  logger.info({ smtp: SMTP_HOST }, "Mailer inicializado");
}

export function getTransporter() {
  return transporter ?? null;
}
