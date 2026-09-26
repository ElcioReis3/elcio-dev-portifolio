/**
 * Helpers para manipular URLs do Cloudinary sem precisar reenviar a imagem.
 *
 * Um corte/rotação vira apenas uma transformação na própria URL de entrega:
 *   https://res.cloudinary.com/<cloud>/image/upload/a_90/c_crop,x_0,y_0,w_800,h_450/v123/pasta/id.png
 *
 * Vantagens:
 *  - não destrói o arquivo original (dá pra reeditar quantas vezes quiser)
 *  - não gasta upload nem banda
 *  - `images` continua sendo `string[]`, então nada no resto do projeto quebra
 *
 * Este arquivo NÃO importa o SDK do Cloudinary, então pode ser usado no client.
 */

export type CropRect = { x: number; y: number; width: number; height: number };
export type ImageEdits = { crop: CropRect | null; angle: number };

const UPLOAD_MARKER = "/upload/";

export function isCloudinaryUrl(url: string): boolean {
  return (
    typeof url === "string" &&
    url.includes("res.cloudinary.com") &&
    url.includes(UPLOAD_MARKER)
  );
}

type ParsedUrl = {
  /** tudo até `/upload/`, inclusive */
  prefix: string;
  /** segmentos de transformação já presentes na URL */
  transforms: string[];
  /** `v123/pasta/arquivo.png` */
  suffix: string;
};

/** Um segmento é transformação quando todos os tokens têm o formato `xx_valor`. */
function looksLikeTransform(segment: string): boolean {
  if (!segment) return false;
  return segment.split(",").every((token) => /^[a-z]{1,3}_[^/]+$/.test(token));
}

export function parseCloudinaryUrl(url: string): ParsedUrl | null {
  if (!isCloudinaryUrl(url)) return null;

  const idx = url.indexOf(UPLOAD_MARKER);
  const prefix = url.slice(0, idx + UPLOAD_MARKER.length);
  const rest = url.slice(idx + UPLOAD_MARKER.length);
  const parts = rest.split("/");

  const transforms: string[] = [];
  let i = 0;
  while (
    i < parts.length - 1 &&
    !/^v\d+$/.test(parts[i]) &&
    looksLikeTransform(parts[i])
  ) {
    transforms.push(parts[i]);
    i += 1;
  }

  return { prefix, transforms, suffix: parts.slice(i).join("/") };
}

/** Remove qualquer edição e devolve a imagem original. */
export function getOriginalUrl(url: string): string {
  const parsed = parseCloudinaryUrl(url);
  return parsed ? parsed.prefix + parsed.suffix : url;
}

/** Acrescenta transformações ao final das que já existem. */
export function withTransform(url: string, transforms: string[]): string {
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;
  const all = [...parsed.transforms, ...transforms].filter(Boolean);
  return parsed.prefix + [...all, parsed.suffix].join("/");
}

/**
 * Monta a URL final a partir da ORIGINAL.
 * A ordem importa: primeiro gira, depois corta — é assim que o editor mostra.
 */
export function buildEditedUrl(url: string, edits: ImageEdits): string {
  const parsed = parseCloudinaryUrl(getOriginalUrl(url));
  if (!parsed) return url;

  const transforms: string[] = [];

  const angle = ((Math.round(edits.angle) % 360) + 360) % 360;
  if (angle !== 0) transforms.push(`a_${angle}`);

  if (edits.crop && edits.crop.width > 0 && edits.crop.height > 0) {
    const { x, y, width, height } = edits.crop;
    transforms.push(
      `c_crop,x_${Math.max(0, Math.round(x))},y_${Math.max(
        0,
        Math.round(y),
      )},w_${Math.round(width)},h_${Math.round(height)}`,
    );
  }

  return parsed.prefix + [...transforms, parsed.suffix].join("/");
}

/** Lê as edições já gravadas numa URL (para reabrir o editor no estado certo). */
export function readEdits(url: string): ImageEdits {
  const edits: ImageEdits = { crop: null, angle: 0 };
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return edits;

  for (const segment of parsed.transforms) {
    const map = new Map<string, string>();
    for (const token of segment.split(",")) {
      const [key, ...value] = token.split("_");
      map.set(key, value.join("_"));
    }

    const angle = Number(map.get("a"));
    if (map.has("a") && !Number.isNaN(angle)) edits.angle = angle;

    if (map.get("c") === "crop") {
      const x = Number(map.get("x") ?? 0);
      const y = Number(map.get("y") ?? 0);
      const width = Number(map.get("w"));
      const height = Number(map.get("h"));
      if (!Number.isNaN(width) && !Number.isNaN(height)) {
        edits.crop = { x, y, width, height };
      }
    }
  }

  return edits;
}

export function hasEdits(url: string): boolean {
  const edits = readEdits(url);
  return edits.crop !== null || edits.angle !== 0;
}

/** Miniatura leve para o painel — preserva as edições já aplicadas. */
export function thumbUrl(url: string, width = 480): string {
  return withTransform(url, [`w_${width},c_limit,q_auto,f_auto`]);
}

/** `pasta/arquivo` — usado para apagar o arquivo no Cloudinary. */
export function publicIdFromUrl(url: string): string | null {
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return null;
  const withoutVersion = parsed.suffix.replace(/^v\d+\//, "");
  const publicId = withoutVersion.replace(/\.[^./]+$/, "");
  return publicId || null;
}
