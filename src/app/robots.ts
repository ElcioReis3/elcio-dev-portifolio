import type { MetadataRoute } from "next";

/**
 * Mantém o painel e as rotas de API fora dos buscadores.
 *
 * Robôs bem-comportados (Google, Bing) respeitam isto. Coletores de e-mail
 * ignoram — contra eles vale o que está no LEIA-ME: nada de endereço no HTML.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/administrador", "/login", "/api/", "/whatsapp"],
      },
    ],
  };
}
