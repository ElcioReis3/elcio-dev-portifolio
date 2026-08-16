import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border section-padding py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            E
          </div>
          <span>
            © {year} <strong className="text-foreground">Élcio Reis</strong> — Todos os direitos reservados
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/%C3%A9lcio-reis-6944352a7/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <span className="text-border">·</span>
          <span>7empresaelcio@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}
