"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Loader2, Code2 } from "lucide-react";
import type { Project } from "@/types/project";
import { ProjectModal } from "@/components/project-modal";

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects", { cache: "no-store" });
  if (!res.ok) throw new Error("Erro ao carregar projetos");
  return res.json();
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projetos" className="section-padding py-20 lg:py-28">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
            <Code2 className="w-3.5 h-3.5" />
            Trabalhos recentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">Projetos</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Alguns dos projetos que desenvolvi para clientes e estudos.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Nenhum projeto cadastrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelected(project)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ProjectModal
        project={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-card border border-border rounded-2xl overflow-hidden card-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-secondary overflow-hidden">
        {project.images[0] ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Code2 className="w-10 h-10" />
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            Destaque
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-primary font-medium pt-1">
          Ver detalhes
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </button>
  );
}
