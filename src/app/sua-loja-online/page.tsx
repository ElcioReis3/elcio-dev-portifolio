import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  CreditCard,
  Smartphone,
  BarChart2,
  Shield,
  Headphones,
  CheckCircle2,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Crie sua Loja Online | Élcio Reis",
  description:
    "Monte sua loja virtual com design profissional, pagamentos integrados e painel de gestão. Do zero ao online em poucos dias.",
};

const WHATSAPP_NUMBER = "5599996452760";
const getMsg = (plan: string) =>
  encodeURIComponent(`Olá, tenho interesse no plano: ${plan}`);

const features = [
  {
    icon: ShoppingCart,
    title: "Carrinho completo",
    description: "Adicionar, remover e gerenciar produtos com facilidade.",
  },
  {
    icon: CreditCard,
    title: "Pagamentos integrados",
    description: "Pix, cartão de crédito/débito e boleto prontos para usar.",
  },
  {
    icon: Smartphone,
    title: "100% responsivo",
    description: "Funciona perfeitamente no celular, tablet e desktop.",
  },
  {
    icon: BarChart2,
    title: "Painel de gestão",
    description: "Controle pedidos, estoque e clientes de um só lugar.",
  },
  {
    icon: Shield,
    title: "SSL e segurança",
    description: "Certificado SSL incluso e conformidade com LGPD.",
  },
  {
    icon: Headphones,
    title: "Suporte incluso",
    description: "Suporte técnico por 30 dias após a entrega.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R$ 897",
    period: "pagamento único",
    description: "Ideal para quem está começando a vender online.",
    highlight: false,
    features: [
      "Até 50 produtos",
      "Pagamento via Pix",
      "Design responsivo",
      "Painel administrativo",
      "Suporte 30 dias",
      "Domínio e hospedagem não inclusos",
    ],
  },
  {
    name: "Pro",
    price: "R$ 1.497",
    period: "pagamento único",
    description: "A escolha certa para lojas com volume de vendas maior.",
    highlight: true,
    features: [
      "Produtos ilimitados",
      "Pix + Cartão + Boleto",
      "Design personalizado",
      "Painel administrativo",
      "Integração WhatsApp",
      "SEO otimizado",
      "Suporte 60 dias",
      "1 ano de hospedagem incluso",
    ],
  },
  {
    name: "Personalizado",
    price: "Sob consulta",
    period: "multi-loja / marketplace",
    description: "Para projetos maiores com necessidades específicas.",
    highlight: false,
    features: [
      "Tudo do plano Pro",
      "Funcionalidades customizadas",
      "Integrações via API",
      "Multi-vendedores",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
];

const steps = [
  {
    n: "01",
    title: "Briefing",
    desc: "Me conta sobre seu negócio, produtos e público-alvo.",
  },
  {
    n: "02",
    title: "Design",
    desc: "Crio o layout da loja com a identidade visual da sua marca.",
  },
  {
    n: "03",
    title: "Desenvolvimento",
    desc: "Desenvolvo a loja com todas as funcionalidades do plano escolhido.",
  },
  {
    n: "04",
    title: "Entrega",
    desc: "Sua loja vai ao ar e fica pronta para vender!",
  },
];

export default function SuaLojaOnlinePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple topbar */}
      <header className="border-b border-border section-padding">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao portfólio
          </Link>
          <a
            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${getMsg("Loja Online")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="section-padding py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            Do zero ao online em poucos dias
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Sua loja online
            <br />
            <span className="text-gradient">pronta para vender</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Crio lojas virtuais profissionais com design personalizado,
            pagamentos integrados e painel de gestão completo.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${getMsg("Loja Online Pro")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Quero minha loja
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#planos"
              className="flex items-center gap-2 px-7 py-3.5 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
            >
              Ver planos
            </a>
          </div>
        </div>
      </section>

      {/* Mockup showcase */}
      <section className="section-padding pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-secondary border border-border overflow-hidden h-56 sm:h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Preview da loja</p>
            </div>
            {/* Floating badges */}
            <div className="absolute top-4 left-4 bg-card border border-border rounded-xl px-3 py-2 shadow text-xs font-semibold">
              🛒 3 pedidos novos
            </div>
            <div className="absolute bottom-4 right-4 bg-card border border-border rounded-xl px-3 py-2 shadow text-xs font-semibold">
              💳 Pagamento aprovado
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding py-16 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Tudo que sua loja precisa
            </h2>
            <p className="text-muted-foreground">
              Funcionalidades profissionais prontas desde o primeiro dia.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-5 bg-card border border-border rounded-2xl space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Como funciona</h2>
            <p className="text-muted-foreground">
              Processo simples e transparente do início ao fim.
            </p>
          </div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className="flex gap-5 p-5 bg-card border border-border rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="section-padding py-16 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Planos</h2>
            <p className="text-muted-foreground">
              Escolha o que melhor se encaixa no seu negócio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border flex flex-col gap-5 ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20"
                    : "bg-card border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full whitespace-nowrap">
                    Mais popular
                  </div>
                )}

                <div>
                  <div className="font-bold text-lg">{plan.name}</div>
                  <div
                    className={`text-3xl font-bold mt-1 ${plan.highlight ? "" : ""}`}
                  >
                    {plan.price}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${
                      plan.highlight
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {plan.period}
                  </div>
                  <p
                    className={`text-sm mt-3 ${
                      plan.highlight
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-2 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.highlight
                            ? "text-primary-foreground"
                            : "text-primary"
                        }`}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${getMsg(plan.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  Escolher {plan.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Pronto para vender online?
          </h2>
          <p className="text-muted-foreground">
            Me manda uma mensagem agora e a gente bate um papo sobre o seu
            projeto. Sem compromisso.
          </p>
          <a
            href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${getMsg("Loja Online")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl text-lg font-semibold hover:bg-[#20bc5a] transition-all hover:shadow-lg hover:shadow-green-500/25"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Quero minha loja online
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border section-padding py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Élcio Reis · Desenvolvedor Web
      </footer>
    </div>
  );
}
