import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { sendContactMail } from "@/lib/mailer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// nodemailer precisa do runtime Node (não roda em edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 3_000; // menos que isso = robô
const MAX_TOKEN_AGE_MS = 60 * 60 * 1000; // formulário aberto há mais de 1h

function secret(): string {
  return (
    process.env.CONTACT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "troque-esta-chave-no-env"
  );
}

function sign(timestamp: string): string {
  return createHmac("sha256", secret()).update(timestamp).digest("hex");
}

function isValidToken(token: string): { ok: boolean; reason?: string } {
  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return { ok: false, reason: "formato" };

  const expected = sign(timestamp);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "assinatura" };
  }

  const age = Date.now() - Number(timestamp);
  if (Number.isNaN(age)) return { ok: false, reason: "data" };
  if (age < MIN_FILL_MS) return { ok: false, reason: "rápido demais" };
  if (age > MAX_TOKEN_AGE_MS) return { ok: false, reason: "expirado" };

  return { ok: true };
}

async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  // sem chave configurada, o captcha simplesmente não é exigido
  if (!secretKey) return true;
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          remoteip: ip,
        }),
      },
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

/** GET — entrega o token assinado que marca o instante em que o form abriu. */
export async function GET() {
  const timestamp = Date.now().toString();
  return NextResponse.json(
    { token: `${timestamp}.${sign(timestamp)}` },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);

  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();
    const token = String(body.token ?? "");
    const honeypot = String(body.website ?? "").trim();
    const captcha = body.captcha ? String(body.captcha) : undefined;

    // 1. Honeypot: campo invisível. Humano nunca preenche.
    //    Devolve sucesso de propósito, para o robô não aprender o que falhou.
    if (honeypot) {
      console.warn("[contact] honeypot capturou um envio", { ip });
      return NextResponse.json({ success: true });
    }

    // 2. Validação básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Preencha nome, e-mail e mensagem." },
        { status: 400 },
      );
    }
    if (name.length > 120 || email.length > 160 || message.length > 5000) {
      return NextResponse.json({ error: "Conteúdo muito longo." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }
    // injeção de cabeçalho: quebra de linha em campo que vira header
    if (/[\r\n]/.test(name) || /[\r\n]/.test(email)) {
      return NextResponse.json({ error: "Conteúdo inválido." }, { status: 400 });
    }

    // 3. Time-trap assinado
    const tokenCheck = isValidToken(token);
    if (!tokenCheck.ok) {
      console.warn("[contact] token recusado:", tokenCheck.reason, { ip });
      return NextResponse.json(
        { error: "Sessão do formulário expirou. Recarregue a página." },
        { status: 400 },
      );
    }

    // 4. Limite por IP
    const limit = rateLimit(`contact:${ip}`, { limit: 3 });
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Muitos envios. Tente de novo em ${Math.ceil(
            limit.retryAfterSeconds / 60,
          )} minutos.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    // 5. Turnstile (se configurado)
    if (!(await verifyTurnstile(captcha, ip))) {
      return NextResponse.json(
        { error: "Não consegui confirmar que você não é um robô." },
        { status: 400 },
      );
    }

    await sendContactMail({ name, email, message, ip });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json(
      { error: "Erro ao enviar a mensagem. Tente novamente em instantes." },
      { status: 500 },
    );
  }
}
