"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ExternalLink,
  ArrowLeft,
  Loader2,
  X,
  ImageIcon,
  Star,
  StarOff,
} from "lucide-react";
import type { Project } from "@/types/project";

type Props = { projects: Project[] };

export function AdminDashboard({ projects: initialProjects }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Projeto deletado com sucesso!");
    } catch {
      showToast("Erro ao deletar projeto.");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, featured: !p.featured } : p
        )
      );
    } catch {
      showToast("Erro ao atualizar projeto.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-semibold text-sm">Painel Admin</h1>
              <p className="text-xs text-muted-foreground">
                {projects.length} projetos cadastrados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo projeto
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Nenhum projeto ainda</p>
              <p className="text-sm text-muted-foreground">
                Crie seu primeiro projeto clicando em "Novo projeto"
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border rounded-2xl overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-secondary">
                  {project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Destaque
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      title={project.featured ? "Remover destaque" : "Destacar"}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 transition-colors"
                    >
                      {project.featured ? (
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </button>

                    {project.urlLink && (
                      <a
                        href={project.urlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="Ver projeto"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <div className="flex-1" />

                    <button
                      onClick={() => setEditProject(project)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(project.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-foreground text-background rounded-xl shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      {/* Create modal */}
      {createOpen && (
        <ProjectFormModal
          onClose={() => setCreateOpen(false)}
          onSuccess={(newProject) => {
            setProjects((prev) => [...prev, newProject]);
            setCreateOpen(false);
            showToast("Projeto criado com sucesso!");
          }}
        />
      )}

      {/* Edit modal */}
      {editProject && (
        <ProjectFormModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onSuccess={(updated) => {
            setProjects((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setEditProject(null);
            showToast("Projeto atualizado com sucesso!");
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-lg">Deletar projeto?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Project Form Modal ───────────────────────────────────────────────────────

type FormModalProps = {
  project?: Project;
  onClose: () => void;
  onSuccess: (project: Project) => void;
};

function ProjectFormModal({ project, onClose, onSuccess }: FormModalProps) {
  const isEdit = !!project;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [details, setDetails] = useState(project?.details ?? "");
  const [urlLink, setUrlLink] = useState(project?.urlLink ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !details) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, details, urlLink: urlLink || null }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        onSuccess(updated);
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("details", details);
        if (urlLink) formData.append("urlLink", urlLink);
        if (fileRef.current?.files) {
          for (const file of Array.from(fileRef.current.files)) {
            formData.append("images", file);
          }
        }
        const res = await fetch("/api/projects", { method: "POST", body: formData });
        if (!res.ok) throw new Error();
        const created = await res.json();
        onSuccess(created);
      }
    } catch {
      setError("Erro ao salvar projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-bold text-lg">
            {isEdit ? "Editar projeto" : "Novo projeto"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Título *">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Landing Page | Empresa XYZ"
              className="input"
              required
            />
          </Field>

          <Field label="Descrição *">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: React com Next.js, TypeScript e Firebase"
              className="input"
              required
            />
          </Field>

          <Field label="Detalhes *">
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descreva o projeto em mais detalhes..."
              className="input min-h-[80px] resize-y"
              required
            />
          </Field>

          <Field label="URL do projeto">
            <input
              value={urlLink}
              onChange={(e) => setUrlLink(e.target.value)}
              placeholder="https://..."
              type="url"
              className="input"
            />
          </Field>

          {!isEdit && (
            <Field label="Imagens">
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="input file:mr-3 file:px-3 file:py-1 file:rounded-lg file:bg-secondary file:text-secondary-foreground file:text-sm file:font-medium file:border-0 file:cursor-pointer"
              />
            </Field>
          )}

          {error && (
            <p className="text-sm text-destructive px-1">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : isEdit ? (
                "Salvar"
              ) : (
                "Criar projeto"
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.625rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .input:focus {
          box-shadow: 0 0 0 2px hsl(var(--ring));
        }
        .input::placeholder {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
