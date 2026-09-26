import { NextRequest, NextResponse } from "next/server";

/**
 * GET /whatsapp            → mensagem padrão
 * GET /whatsapp?assunto=x  → "Olá, tenho interesse em x."
 *
 * O número fica só no .env (WHATSAPP_NUMBER, sem NEXT_PUBLIC), então ele
 * nunca aparece no HTML nem no JavaScript entregue ao navegador. Para quem
 * visita, o clique funciona igual ao link direto de antes.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const number = process.env.WHATSAPP_NUMBER;

  if (!number) {
    console.error("[/whatsapp] WHATSAPP_NUMBER não configurado no .env");
    return NextResponse.redirect(new URL("/#contato", req.url));
  }

  // limpa o assunto: sem quebras de linha e com tamanho limitado
  const assunto = (req.nextUrl.searchParams.get("assunto") ?? "")
    .replace(/[\r\n\t]/g, " ")
    .trim()
    .slice(0, 120);

  const message = assunto
    ? `Olá, tenho interesse em ${assunto}.`
    : "Olá, gostaria de saber mais informações sobre seus serviços.";

  return NextResponse.redirect(
    `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`,
    { status: 307 },
  );
}
