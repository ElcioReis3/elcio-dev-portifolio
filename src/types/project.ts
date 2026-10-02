/** onde o projeto existe: só web, só app (Play Store) ou os dois */
export type ProjectKind = "site" | "app" | "both";

export type WebStatus = "available" | "in_development";
export type AppStatus = "coming_soon" | "in_review" | "registered" | "published";

/** "none" esconde o badge daquela plataforma */
export type BadgeStatus = WebStatus | AppStatus | "none";

export type Project = {
  id: string;
  title: string;
  description: string;
  details: string;
  images: string[];
  /** link da versão web */
  urlLink?: string | null;
  /** link da Play Store */
  appLink?: string | null;
  kind: ProjectKind;
  /** badge da versão web; se ausente e houver urlLink, mostra "Disponível no link" */
  webStatus?: WebStatus | "none";
  /** badge da versão app */
  appStatus?: AppStatus | "none";
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ProjectCreateInput = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;
export type ProjectUpdateInput = Partial<ProjectCreateInput>;
