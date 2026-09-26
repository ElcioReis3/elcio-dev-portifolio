"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Linkedin,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // token assinado: marca no servidor a hora em que o formulário abriu
  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setToken(data.token ?? ""))
      .catch(() => setToken(""));
  }, []);

  // captcha invisível da Cloudflare (só carrega se a chave existir)
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (document.querySelector("script[data-turnstile]")) return;

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = "true";
    document.head.appendChild(script);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    const captcha = formRef.current
      ? String(
          new FormData(formRef.current).get("cf-turnstile-response") ?? "",
        )
      : "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website, token, captcha }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Erro ao enviar.");

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Erro ao enviar a mensagem.",
      );
      // libera o captcha para uma nova tentativa
      (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
    }
  };

  return (
    <section id="contato" className="section-padding py-20 lg:py-28">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            Vamos conversar
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">Entre em contato</h2>
          <p className="leading-relaxed text-muted-foreground">
            Tem um projeto em mente? Me chame no WhatsApp ou mande a mensagem
            pelo formulário. Respondo rapidamente e sem formalidades.
          </p>
        </div>

        {/* CTA principal — o número fica no servidor, em /whatsapp */}
        <a
          href="/whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-[#20bc5a] hover:shadow-lg hover:shadow-green-500/25"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chamar no WhatsApp
        </a>

        {/* Formulário */}
        {status === "sent" ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8">
            <CheckCircle2 className="h-10 w-10 text-[#25D366]" />
            <div>
              <p className="font-semibold">Mensagem enviada!</p>
              <p className="text-sm text-muted-foreground">
                Respondo no seu e-mail assim que possível.
              </p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-3 text-left"
          >
            {/* honeypot: invisível para gente, irresistível para robô */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Não preencha este campo</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
                maxLength={120}
                required
                className={inputClass}
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Seu e-mail"
                type="email"
                autoComplete="email"
                maxLength={160}
                required
                className={inputClass}
              />
            </div>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Conte um pouco sobre o projeto..."
              rows={5}
              maxLength={5000}
              required
              className={`${inputClass} resize-y`}
            />

            {TURNSTILE_SITE_KEY && (
              <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_SITE_KEY}
                data-theme="auto"
                data-size="flexible"
              />
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={status === "sending" || !token}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Enviar mensagem
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/%C3%A9lcio-reis-6944352a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-2.5 text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
