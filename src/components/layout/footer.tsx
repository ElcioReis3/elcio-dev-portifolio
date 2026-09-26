import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-padding border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            E
          </div>
          <span>
            © {year}{" "}
            <strong className="text-foreground">Élcio Serviços On</strong> —
            Todos os direitos reservados
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/%C3%A9lcio-reis-6944352a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <span className="text-border">·</span>
          {/* sem e-mail em texto: o contato passa pelo formulário */}
          <Link
            href="/#contato"
            className="transition-colors hover:text-foreground"
          >
            Contato
          </Link>
          <span className="text-border">·</span>
          <a
            href="/whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
