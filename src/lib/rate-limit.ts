/**
 * Limite de envios por IP, guardado em memória.
 *
 * Serve bem para uma instância só (VPS, container, `next start`). Em serverless
 * com várias instâncias, cada uma tem o seu contador — nesse caso troque o Map
 * por Upstash Redis / Vercel KV mantendo a mesma assinatura.
 */
type Bucket = number[];

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  { limit = 3, windowMs = 60 * 60 * 1000 } = {},
): RateLimitResult {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  // limpeza preguiçosa para o Map não crescer sem fim
  if (buckets.size > 5000) {
    for (const [mapKey, value] of buckets) {
      if (value.every((timestamp) => now - timestamp >= windowMs)) {
        buckets.delete(mapKey);
      }
    }
  }

  if (hits.length >= limit) {
    buckets.set(key, hits);
    const oldest = hits[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((windowMs - (now - oldest)) / 1000),
    };
  }

  hits.push(now);
  buckets.set(key, hits);

  return {
    allowed: true,
    remaining: limit - hits.length,
    retryAfterSeconds: 0,
  };
}

/** Melhor palpite de IP atrás de proxy (Vercel, Cloudflare, Nginx). */
export function clientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "desconhecido"
  );
}
