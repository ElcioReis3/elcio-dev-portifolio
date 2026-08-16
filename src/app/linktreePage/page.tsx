import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Instagram, Linkedin, Globe, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Links | Élcio Reis",
  description: "Todos os links do desenvolvedor Élcio Reis em um só lugar.",
};

const WHATSAPP_NUMBER = "5599996452760";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá, gostaria de saber mais sobre seus serviços."
);

const links = [
  {
    icon: MessageSquare,
    label: "WhatsApp — Fale comigo",
    sublabel: "Respondo rápido!",
    href: `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_MSG}`,
    accent: "#25D366",
    primary: true,
  },
  {
    icon: Globe,
    label: "Portfólio",
    sublabel: "Veja meus projetos",
    href: "/",
    accent: "#2563EB",
    primary: false,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    sublabel: "Conecte-se comigo",
    href: "https://www.linkedin.com/in/%C3%A9lcio-reis-6944352a7/",
    accent: "#0A66C2",
    primary: false,
  },
  {
    icon: Globe,
    label: "Loja Online — Crie a sua",
    sublabel: "E-commerce personalizado",
    href: "/sua-loja-online",
    accent: "#7C3AED",
    primary: false,
  },
];

export default function LinktreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] flex items-center justify-center section-padding py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Profile */}
        <div className="text-center space-y-3">
          <div className="relative w-24 h-24 mx-auto">
            <Image
              src="/images/elcio_reis.png"
              alt="Élcio Reis"
              fill
              className="object-cover rounded-full border-2 border-white/10"
              sizes="96px"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Élcio Reis</h1>
            <p className="text-sm text-slate-400">Desenvolvedor Web</p>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-400">Disponível para projetos</span>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 w-full px-5 py-4 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: link.primary
                    ? `${link.accent}15`
                    : "rgba(255,255,255,0.04)",
                  borderColor: link.primary
                    ? `${link.accent}40`
                    : "rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${link.accent}20` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: link.accent }}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-white">
                    {link.label}
                  </div>
                  <div className="text-xs text-slate-400">{link.sublabel}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center space-y-1 pt-2">
          <p className="text-xs text-slate-500">
            Quer uma página de links assim?
          </p>
          <a
            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Olá, quero uma página de links personalizada!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline"
          >
            A partir de R$ 69,99 — Solicitar agora
          </a>
        </div>
      </div>
    </div>
  );
}
