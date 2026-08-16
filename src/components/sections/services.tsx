import { Globe, ShoppingCart, Link2, LayoutDashboard } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Sites Institucionais",
    description:
      "Apresente sua marca com um site profissional, moderno e adaptado ao seu público-alvo.",
    price: "A partir de R$ 497",
    highlight: false,
  },
  {
    icon: ShoppingCart,
    title: "Lojas Virtuais",
    description:
      "Venda online com facilidade e segurança. Integração de pagamentos, carrinho e gestão de produtos.",
    price: "A partir de R$ 897",
    highlight: true,
  },
  {
    icon: Link2,
    title: "Página de Links",
    description:
      "Centralize todos seus links em uma página personalizada com sua identidade visual.",
    price: "A partir de R$ 69,99",
    highlight: false,
  },
  {
    icon: LayoutDashboard,
    title: "Sistemas Web",
    description:
      "Sistemas personalizados para sua empresa: painéis, CRMs, dashboards e automações.",
    price: "Sob consulta",
    highlight: false,
  },
];

const WHATSAPP_NUMBER = "5599996452760";
const getMsg = (service: string) =>
  encodeURIComponent(`Olá, tenho interesse no serviço: ${service}`);

export function Services() {
  return (
    <section id="servicos" className="section-padding py-20 lg:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background text-muted-foreground text-sm font-medium border border-border">
            Serviços
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">O que ofereço</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Soluções digitais completas para o seu negócio crescer online.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  service.highlight
                    ? "bg-primary text-primary-foreground border-primary shadow-primary/20 shadow-lg"
                    : "bg-card border-border hover:-translate-y-1"
                }`}
              >
                {service.highlight && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    Mais popular
                  </div>
                )}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    service.highlight
                      ? "bg-white/20"
                      : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      service.highlight ? "text-white" : "text-primary"
                    }`}
                  />
                </div>

                <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                <p
                  className={`text-sm leading-relaxed mb-4 ${
                    service.highlight
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {service.description}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-sm ${
                      service.highlight ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {service.price}
                  </span>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${getMsg(service.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      service.highlight
                        ? "bg-white text-primary hover:bg-white/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    Solicitar
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
