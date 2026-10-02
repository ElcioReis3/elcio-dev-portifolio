import type {
  AppStatus,
  Project,
  ProjectKind,
  WebStatus,
} from "@/types/project";

export type Platform = "web" | "app";
export type BadgeIcon = "playstore" | "link" | "wrench";
export type BadgeTone = "amber" | "blue" | "green" | "neutral";

export type BadgeDef = {
  platform: Platform;
  label: string;
  icon: BadgeIcon;
  tone: BadgeTone;
};

/**
 * Fonte única dos badges. Para adicionar um novo (ex: "Na App Store"),
 * inclua o status em `types/project.ts` e uma entrada aqui.
 */
export const WEB_STATUS: Record<WebStatus, BadgeDef> = {
  available: {
    platform: "web",
    label: "Disponível no link",
    icon: "link",
    tone: "green",
  },
  in_development: {
    platform: "web",
    label: "Em desenvolvimento",
    icon: "wrench",
    tone: "amber",
  },
};

export const APP_STATUS: Record<AppStatus, BadgeDef> = {
  coming_soon: {
    platform: "app",
    label: "Em breve na Play Store",
    icon: "playstore",
    tone: "amber",
  },
  in_review: {
    platform: "app",
    label: "Em análise na Play Store",
    icon: "playstore",
    tone: "blue",
  },
  registered: {
    platform: "app",
    label: "Registrado na Play Store",
    icon: "playstore",
    tone: "blue",
  },
  published: {
    platform: "app",
    label: "Disponível na Play Store",
    icon: "playstore",
    tone: "green",
  },
};

export const PROJECT_KINDS: { value: ProjectKind; label: string }[] = [
  { value: "site", label: "Site" },
  { value: "app", label: "App" },
  { value: "both", label: "Site + App" },
];

export const DEFAULT_WEB_STATUS: WebStatus = "available";
export const DEFAULT_APP_STATUS: AppStatus = "coming_soon";

export const hasWeb = (kind: ProjectKind) => kind !== "app";
export const hasApp = (kind: ProjectKind) => kind !== "site";

export function normalizeKind(value: unknown): ProjectKind {
  return value === "app" || value === "both" ? value : "site";
}

export function parseWebStatus(value: unknown): WebStatus | "none" | null {
  if (value === "none") return "none";
  return typeof value === "string" && value in WEB_STATUS
    ? (value as WebStatus)
    : null;
}

export function parseAppStatus(value: unknown): AppStatus | "none" | null {
  if (value === "none") return "none";
  return typeof value === "string" && value in APP_STATUS
    ? (value as AppStatus)
    : null;
}

/** badges a exibir (0, 1 ou 2): primeiro o da web, depois o do app */
export function resolveBadges(
  project: Pick<
    Project,
    "kind" | "urlLink" | "appLink" | "webStatus" | "appStatus"
  >,
): BadgeDef[] {
  const kind = normalizeKind(project.kind);
  const badges: BadgeDef[] = [];

  if (hasWeb(kind)) {
    const status = parseWebStatus(project.webStatus);
    if (status && status !== "none") badges.push(WEB_STATUS[status]);
    // projetos antigos (sem status): site com link ganha "Disponível no link"
    else if (!status && project.urlLink) badges.push(WEB_STATUS.available);
  }

  if (hasApp(kind)) {
    const status = parseAppStatus(project.appStatus);
    if (status && status !== "none") badges.push(APP_STATUS[status]);
  }

  return badges;
}

/** converte o documento do Firestore no formato público de Project */
export function serializeProject(
  id: string,
  data: FirebaseFirestore.DocumentData,
): Project {
  const kind = normalizeKind(data.kind);

  // compatibilidade com a 1ª versão (um único `status`/`urlLink` por projeto)
  const legacyApp = data.kind === "app";
  const webStatus = parseWebStatus(
    data.webStatus ?? (legacyApp ? undefined : data.status),
  );
  const appStatus = parseAppStatus(
    data.appStatus ?? (legacyApp ? data.status : undefined),
  );
  const appLink = data.appLink ?? (legacyApp ? data.urlLink : null) ?? null;
  const urlLink = legacyApp && !data.appLink ? null : (data.urlLink ?? null);

  return {
    id,
    title: data.title ?? "",
    description: data.description ?? "",
    details: data.details ?? "",
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    urlLink,
    appLink,
    kind,
    ...(webStatus ? { webStatus } : {}),
    ...(appStatus ? { appStatus } : {}),
    featured: data.featured ?? false,
    order: data.order ?? 0,
  };
}
