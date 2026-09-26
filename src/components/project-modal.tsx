"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  X,
} from "lucide-react";
import type { Project } from "@/types/project";

type Props = {
  project: Project | null;
  onClose: () => void;
};

const TECH_ICONS: Record<string, string> = {
  React: "/images/icons/react-icon.png",
  "Next.js": "/images/icons/nextjs-icon.png",
  TypeScript: "/images/icons/typescript-icons.png",
  Tailwind: "/images/icons/tailwindcss.icons.png",
  Shadcn: "/images/icons/shadcn-ui-icon.png",
  Git: "/images/icons/git-icon.png",
  HTML: "/images/icons/html-icons.png",
  CSS: "/images/icons/css-icons.png",
  JavaScript: "/images/icons/javascript-icons.png",
};

export function ProjectModal({ project, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!project) return;
    setImgIndex(0);

    const total = project.images.length;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!total) return;
      if (event.key === "ArrowRight") setImgIndex((i) => (i + 1) % total);
      if (event.key === "ArrowLeft")
        setImgIndex((i) => (i - 1 + total) % total);
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  const images = project.images;
  const total = images.length;
  const currentImage = images[imgIndex];

  const go = (delta: number) => {
    if (!total) return;
    setImgIndex((i) => (i + delta + total) % total);
  };

  const techKeywords = Object.keys(TECH_ICONS).filter((tech) =>
    project.description.toLowerCase().includes(tech.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Carrossel — a imagem aparece inteira, sem cortes */}
        <div
          className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-black"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const delta = event.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          {currentImage ? (
            <>
              {/* fundo desfocado só para preencher as laterais */}
              <Image
                src={currentImage}
                alt=""
                fill
                aria-hidden
                className="scale-110 object-cover opacity-40 blur-2xl"
                sizes="672px"
              />
              <Image
                src={currentImage}
                alt={`${project.title} - imagem ${imgIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 672px) 100vw, 672px"
                priority
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              Sem imagem
            </div>
          )}

          {total > 1 && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Imagem anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Próxima imagem"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                {imgIndex + 1} / {total}
              </span>
            </>
          )}

          {currentImage && (
            <a
              href={currentImage}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir em tamanho real"
              className="absolute bottom-3 right-3 rounded-lg bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
            >
              <Maximize2 className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Miniaturas */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-border bg-secondary/40 p-3">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setImgIndex(index)}
                aria-label={`Ver imagem ${index + 1}`}
                className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-black transition-all ${
                  index === imgIndex
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Conteúdo */}
        <div className="space-y-5 p-6">
          <div>
            <h2 className="text-xl font-bold leading-snug">{project.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>

          {project.details && (
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-sm leading-relaxed">{project.details}</p>
            </div>
          )}

          {techKeywords.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tecnologias
              </div>
              <div className="flex flex-wrap gap-2">
                {techKeywords.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                  >
                    {TECH_ICONS[tech] && (
                      <Image
                        src={TECH_ICONS[tech]}
                        width={14}
                        height={14}
                        alt={tech}
                      />
                    )}
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.urlLink && (
            <a
              href={project.urlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Visitar projeto
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
