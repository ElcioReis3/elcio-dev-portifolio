import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Élcio Reis | Desenvolvedor Web",
    template: "%s | Élcio Reis",
  },
  description:
    "Desenvolvedor web especializado em Next.js, React e TypeScript. Crio sites modernos, lojas virtuais e sistemas personalizados para destacar seu negócio no digital.",
  keywords: [
    "desenvolvedor web",
    "Next.js",
    "React",
    "TypeScript",
    "landing page",
    "e-commerce",
    "Caxias",
    "Maranhão",
  ],
  authors: [{ name: "Élcio Reis", url: "https://linkedin.com/in/élcio-reis-6944352a7" }],
  creator: "Élcio Reis",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Élcio Reis | Desenvolvedor Web",
    description:
      "Sites modernos, lojas virtuais e sistemas personalizados para o seu negócio.",
    siteName: "Élcio Reis - Portfólio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Élcio Reis | Desenvolvedor Web",
    description:
      "Sites modernos, lojas virtuais e sistemas personalizados para o seu negócio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
