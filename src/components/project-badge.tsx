import Image from "next/image";
import { Link2, Wrench } from "lucide-react";
import {
  resolveBadges,
  type BadgeDef,
  type BadgeTone,
} from "@/lib/project-badge";
import type { Project } from "@/types/project";

const TONES: Record<BadgeTone, string> = {
  amber:
    "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300",
  blue: "border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-300",
  green:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  neutral: "border-border bg-secondary text-secondary-foreground",
};

type Props = {
  project: Pick<
    Project,
    "kind" | "urlLink" | "appLink" | "webStatus" | "appStatus"
  >;
  /** `overlay` = fundo sólido, para ficar legível por cima de imagens */
  variant?: "inline" | "overlay";
  /** classes do contêiner (posicionamento/margem) */
  className?: string;
};

/** Mostra de 0 a 2 badges (versão web e/ou versão app) do projeto. */
export function ProjectBadge({
  project,
  variant = "inline",
  className = "",
}: Props) {
  const badges = resolveBadges(project);
  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {badges.map((badge) => (
        <Pill key={badge.platform} badge={badge} variant={variant} />
      ))}
    </div>
  );
}

function Pill({
  badge,
  variant,
}: {
  badge: BadgeDef;
  variant: "inline" | "overlay";
}) {
  const colors =
    variant === "overlay"
      ? "border-border bg-card/95 text-card-foreground shadow-sm backdrop-blur"
      : TONES[badge.tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none ${colors}`}
    >
      {badge.icon === "playstore" ? (
        <Image
          src="/images/icons/playstore.png"
          width={14}
          height={14}
          alt=""
          aria-hidden
          className="h-3.5 w-3.5 shrink-0"
        />
      ) : badge.icon === "wrench" ? (
        <Wrench className="h-3.5 w-3.5 shrink-0" aria-hidden />
      ) : (
        <Link2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
      )}
      {badge.label}
    </span>
  );
}
