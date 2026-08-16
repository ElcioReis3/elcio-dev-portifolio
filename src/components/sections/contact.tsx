import { Mail, MessageSquare, Linkedin, Github } from "lucide-react";

const WHATSAPP_NUMBER = "5599996452760";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá, gostaria de saber mais informações sobre seus serviços."
);

export function Contact() {
  return (
    <section
      id="contato"
      className="section-padding py-20 lg:py-28"
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            Vamos conversar
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Entre em contato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Tem um projeto em mente? Me chame no WhatsApp ou envie um e-mail.
            Respondo rapidamente e sem formalidades.
          </p>
        </div>

        {/* Primary CTA */}
        <a
          href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl text-lg font-semibold hover:bg-[#20bc5a] transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chamar no WhatsApp
        </a>

        {/* Social links */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="mailto:7empresaelcio@gmail.com"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-sm"
          >
            <Mail className="w-4 h-4" />
            7empresaelcio@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/%C3%A9lcio-reis-6944352a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
