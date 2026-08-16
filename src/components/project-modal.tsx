"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types/project";

type Props = {
  project: Project | null;
  onClose: () => void;
};

const TECH_ICONS: Record<string, string> = {
  "React": "/images/icons/react-icon.png",
  "Next.js": "/images/icons/nextjs-icon.png",
  "TypeScript": "/images/icons/typescript-icons.png",
  "Tailwind": "/images/icons/tailwindcss.icons.png",
  "Shadcn": "/images/icons/shadcn-ui-icon.png",
  "Git": "/images/icons/git-icon.png",
  "HTML": "/images/icons/html-icons.png",
  "CSS": "/images/icons/css-icons.png",
  "JavaScript": "/images/icons/javascript-icons.png",
};

export function ProjectModal({ project, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!project) return;
    setImgIndex(0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setImgIndex((i) => (i + 1) % project.images.length);
      if (e.key === "ArrowLeft")
        setImgIndex((i) => (i - 1 + project.images.length) % project.images.length);
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

  // Parse tech stack from description
  const techKeywords = Object.keys(TECH_ICONS).filter((t) =>
    project.description.toLowerCase().includes(t.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image carousel */}
        <div className="relative h-56 sm:h-72 bg-secondary rounded-t-2xl overflow-hidden">
          {images[imgIndex] ? (
            <Image
              src={images[imgIndex]}
              alt={`${project.title} - imagem ${imgIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Sem imagem
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setImgIndex((i) => (i - 1 + images.length) % images.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === imgIndex ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold leading-snug">{project.title}</h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              {project.description}
            </p>
          </div>

          {project.details && (
            <div className="p-4 bg-secondary rounded-xl">
              <p className="text-sm leading-relaxed">{project.details}</p>
            </div>
          )}

          {/* Tech stack */}
          {techKeywords.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tecnologias
              </div>
              <div className="flex flex-wrap gap-2">
                {techKeywords.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-medium"
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

          {/* CTA */}
          {project.urlLink && (
            <a
              href={project.urlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Visitar projeto
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
