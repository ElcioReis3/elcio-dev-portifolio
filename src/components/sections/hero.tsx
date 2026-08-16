import Image from "next/image";
import { ArrowRight, Code2, Globe, Smartphone } from "lucide-react";

const services = [
  { icon: Globe, label: "Landing Pages" },
  { icon: Code2, label: "Sistemas Web" },
  { icon: Smartphone, label: "E-commerce" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5599996452760";
const WHATSAPP_MSG = encodeURIComponent("Olá, gostaria de saber mais informações sobre seus serviços.");

export function Hero() {
  return (
    <section
      id="sobre"
      className="min-h-screen flex items-center pt-16 section-padding"
    >
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
        {/* Text side */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Disponível para novos projetos
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Olá, eu sou
              <br />
              <span className="text-gradient">Élcio Reis</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Desenvolvedor web especializado em criar sites modernos e sistemas
              personalizados que transformam ideias em resultados reais para o seu
              negócio.
            </p>
          </div>

          {/* Service tags */}
          <div className="flex flex-wrap gap-2">
            {services.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
            >
              Falar no WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#projetos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
            >
              Ver projetos
            </a>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
            {[
              { value: "9+", label: "Projetos" },
              { value: "100%", label: "Responsivos" },
              { value: "Next.js", label: "Stack principal" },
            ].map(({ value, label }) => (
              <div key={label} className="space-y-1">
                <div className="text-xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image side */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Background blob */}
            <div className="absolute inset-0 -m-8 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-[40%_60%_60%_40%_/_40%_60%_40%_60%] blur-3xl" />

            {/* Photo */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <Image
                src="/images/elcio_reis.png"
                alt="Élcio Reis - Desenvolvedor Web"
                fill
                className="object-cover rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]"
                priority
                sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 384px"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl px-4 py-3 shadow-lg">
              <div className="text-xs text-muted-foreground">Stack</div>
              <div className="text-sm font-semibold">Next.js · Firebase</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
