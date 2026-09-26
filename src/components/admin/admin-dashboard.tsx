"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  GripVertical,
  ImageIcon,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Star,
  StarOff,
  Trash2,
  Undo2,
} from "lucide-react";
import type { Project } from "@/types/project";
import { thumbUrl } from "@/lib/cloudinary-url";
import { ProjectModal } from "@/components/project-modal";
import { ProjectFormModal } from "@/components/admin/project-form-modal";
import { ModalBackdrop } from "@/components/admin/ui";

type Props = { projects: Project[] };

function move<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function AdminDashboard({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [baseline, setBaseline] = useState<string[]>(
    initialProjects.map((project) => project.id),
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const currentIds = projects.map((project) => project.id);
  const orderDirty = currentIds.join("|") !== baseline.join("|");

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const next = projects.filter((project) => project.id !== id);
      setProjects(next);
      setBaseline(next.map((project) => project.id));
      showToast("Projeto deletado com sucesso!");
    } catch {
      showToast("Erro ao deletar projeto.");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const next = !project.featured;
    setProjects((prev) =>
      prev.map((item) =>
        item.id === project.id ? { ...item, featured: next } : item,
      ),
    );
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setProjects((prev) =>
        prev.map((item) =>
          item.id === project.id ? { ...item, featured: !next } : item,
        ),
      );
      showToast("Erro ao atualizar projeto.");
    }
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const res = await fetch("/api/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: currentIds }),
      });
      if (!res.ok) throw new Error();
      setProjects((prev) =>
        prev.map((project, index) => ({ ...project, order: index })),
      );
      setBaseline(currentIds);
      showToast("Ordem salva! Já está valendo no site.");
    } catch {
      showToast("Erro ao salvar a ordem.");
    } finally {
      setSavingOrder(false);
    }
  };

  const handleUndoOrder = () => {
    setProjects((prev) =>
      [...prev].sort(
        (a, b) => baseline.indexOf(a.id) - baseline.indexOf(b.id),
      ),
    );
  };

  const handleSavedProject = (updated: Project) => {
    setProjects((prev) =>
      prev.some((project) => project.id === updated.id)
        ? prev.map((project) => (project.id === updated.id ? updated : project))
        : [...prev, updated],
    );
    setBaseline((ids) =>
      ids.includes(updated.id) ? ids : [...ids, updated.id],
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-sm font-semibold">Painel Admin</h1>
              <p className="text-xs text-muted-foreground">
                {projects.length} projetos cadastrados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Novo projeto
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Nenhum projeto ainda</p>
              <p className="text-sm text-muted-foreground">
                Crie seu primeiro projeto clicando em &quot;Novo projeto&quot;
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-muted-foreground">
              Arraste os cards (ou use as setas) para definir a ordem em que os
              projetos aparecem no site. Clique no olho para ver exatamente o que
              o visitante vê.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (dragIndex === null || dragIndex === index) return;
                    setProjects((prev) => move(prev, dragIndex, index));
                    setDragIndex(index);
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`group overflow-hidden rounded-2xl border bg-card transition-all ${
                    dragIndex === index
                      ? "scale-[0.98] border-primary opacity-60"
                      : "border-border"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 bg-secondary">
                    {project.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbUrl(project.images[0], 640)}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}

                    <div className="absolute left-2 top-2 flex items-center gap-1.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      {project.featured && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                          Destaque
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                      {project.images.length}{" "}
                      {project.images.length === 1 ? "foto" : "fotos"}
                    </span>

                    <GripVertical className="absolute right-2 top-2 h-4 w-4 cursor-grab text-white/70 drop-shadow" />
                  </div>

                  {/* Info */}
                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                        {project.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    </div>

                    {/* Ordem */}
                    <div className="flex items-center gap-1 rounded-lg bg-secondary/60 p-1">
                      <button
                        disabled={index === 0}
                        onClick={() =>
                          setProjects((prev) => move(prev, index, index - 1))
                        }
                        title="Subir"
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        disabled={index === projects.length - 1}
                        onClick={() =>
                          setProjects((prev) => move(prev, index, index + 1))
                        }
                        title="Descer"
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <span className="pl-1 text-xs text-muted-foreground">
                        posição {index + 1}
                      </span>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-1.5 border-t border-border pt-2">
                      <button
                        onClick={() => setPreviewProject(project)}
                        title="Ver como o visitante vê"
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        title={
                          project.featured ? "Remover destaque" : "Destacar"
                        }
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-yellow-500/10 hover:text-yellow-500"
                      >
                        {project.featured ? (
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>

                      {project.urlLink && (
                        <a
                          href={project.urlLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          title="Abrir projeto"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                      <div className="flex-1" />

                      <button
                        onClick={() => setEditProject(project)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Deletar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Barra de salvar ordem */}
      {orderDirty && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
          <p className="text-sm font-medium">Ordem alterada</p>
          <button
            onClick={handleUndoOrder}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Undo2 className="h-4 w-4" />
            Desfazer
          </button>
          <button
            onClick={handleSaveOrder}
            disabled={savingOrder}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {savingOrder ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar ordem
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background shadow-lg">
          {toast}
        </div>
      )}

      {/* Pré-visualização pública */}
      <ProjectModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />

      {createOpen && (
        <ProjectFormModal
          onClose={() => setCreateOpen(false)}
          onSaved={(created) => {
            handleSavedProject(created);
            showToast("Projeto criado com sucesso!");
          }}
        />
      )}

      {editProject && (
        <ProjectFormModal
          project={
            projects.find((project) => project.id === editProject.id) ??
            editProject
          }
          onClose={() => setEditProject(null)}
          onSaved={handleSavedProject}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <ModalBackdrop onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold">Deletar projeto?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                As imagens também serão apagadas. Esta ação não pode ser
                desfeita.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={loading}
                className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Deletar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
