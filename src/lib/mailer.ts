import nodemailer from "nodemailer";

/**
 * SMTP do Gmail.
 *
 * SMTP_USER           conta que envia (ex: contato.elcio@gmail.com)
 * SMTP_APP_PASSWORD   senha de app de 16 letras (NÃO é a senha da conta)
 * CONTACT_TO          para onde a mensagem chega (padrão: o próprio SMTP_USER)
 *
 * Use uma conta DIFERENTE da que faz login no /administrador.
 */
let cached: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (cached) return cached;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Configure SMTP_USER e SMTP_APP_PASSWORD no .env para enviar e-mails.",
    );
  }

  cached = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  return cached;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  ip?: string;
};

export async function sendContactMail({
  name,
  email,
  message,
  ip,
}: ContactMessage): Promise<void> {
  const transporter = getTransporter();
  const from = process.env.SMTP_USER!;
  const to = process.env.CONTACT_TO || from;

  const text = [
    `Nome:  ${name}`,
    `E-mail: ${email}`,
    ip ? `IP:     ${ip}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    // o Gmail exige que o remetente seja a própria conta autenticada
    from: `"Contato do site" <${from}>`,
    to,
    // respondendo no Gmail, a resposta vai direto para o visitante
    replyTo: `"${name}" <${email}>`,
    subject: `[Portfólio] ${name}`,
    text,
    html: `
      <div style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.6">
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        ${ip ? `<p><strong>IP:</strong> ${escapeHtml(ip)}</p>` : ""}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `,
  });
}
