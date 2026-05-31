/**
 * MailService
 *
 * Encapsula o envio de e-mails transacionais do museu.
 * Usa o transporter singleton inicializado no boot.
 */

import { getTransporter } from "../config/mailer.js";
import logger from "../config/logger.js";

/**
 * Envia e-mail de confirmação de assinatura.
 *
 * @param {string} email
 * @returns {Promise<void>}
 * @throws {Error} se o mailer não estiver configurado ou o envio falhar
 */
export async function sendSubscriptionEmail(email) {
  const transporter = getTransporter();

  if (!transporter) {
    throw new Error(
      "Configuração de e-mail incompleta no servidor. Verifique as variáveis SMTP no .env."
    );
  }

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Confirmação de assinatura - Museu das Ideias Abandonadas",
    text: "Sua assinatura foi confirmada. A Curadoria do Caos vai te enviar os próximos alertas do museu.",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #221a35;">
        <h2 style="margin-bottom: 8px;">Assinatura confirmada</h2>
        <p>
          Sua assinatura no <strong>Museu das Ideias Abandonadas</strong>
          foi confirmada com sucesso.
        </p>
        <p>A Curadoria do Caos vai te avisar quando surgirem novos achados e relíquias.</p>
      </div>
    `,
  });

  logger.info({ email }, "E-mail de confirmação enviado");
}
