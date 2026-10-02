"use client";

import { useRef, useState } from "react";
import { ImageIcon, Info, Loader2, X } from "lucide-react";
import type {
  AppStatus,
  Project,
  ProjectKind,
  WebStatus,
} from "@/types/project";
import {
  APP_STATUS,
  DEFAULT_APP_STATUS,
  DEFAULT_WEB_STATUS,
  PROJECT_KINDS,
  WEB_STATUS,
  hasApp,
  hasWeb,
  parseAppStatus,
  parseWebStatus,
} from "@/lib/project-badge";
import { ProjectBadge } from "@/components/project-badge";
import { ImageManager } from "@/components/admin/image-manager";
import { Field, ModalBackdrop, inputClass } from "@/components/admin/ui";

type Props = {
  project?: Project;
  onClose: () => void;
  /** chamado sempre que algo é salvo (texto ou imagens) */
  onSaved: (project: Project) => void;
};

export function ProjectFormModal({ project, onClose, onSaved }: Props) {
  const isEdit = !!project;
  const [tab, setTab] = useState<"info" | "images">("info");
  const [current, setCurrent] = useState<Project | undefined>(project);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [details, setDetails] = useState(project?.details ?? "");
  const [urlLink, setUrlLink] = useState(project?.urlLink ?? "");
  const [appLink, setAppLink] = useState(project?.appLink ?? "");
  const [kind, setKind] = useState<ProjectKind>(project?.kind ?? "site");
  const [webStatus, setWebStatus] = useState<WebStatus | "none">(
    // projetos antigos sem status: site com link já aparece como "Disponível no link"
    parseWebStatus(project?.webStatus) ?? DEFAULT_WEB_STATUS,
  );
  const [appStatus, setAppStatus] = useState<AppStatus | "none">(
    parseAppStatus(project?.appStatus) ?? DEFAULT_APP_STATUS,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !description || !details) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEdit && current) {
        const res = await fetch(`/api/projects/${current.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            details,
            // só mantém link/status das plataformas que o projeto tem
            urlLink: hasWeb(kind) ? urlLink || null : null,
            appLink: hasApp(kind) ? appLink || null : null,
            kind,
            webStatus: hasWeb(kind) ? webStatus : null,
            appStatus: hasApp(kind) ? appStatus : null,
          }),
        });
        if (!res.ok) throw new Error();
        const updated: Project = await res.json();
        setCurrent(updated);
        onSaved(updated);
        onClose();
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("details", details);
        formData.append("kind", kind);
        if (hasWeb(kind)) {
          if (urlLink) formData.append("urlLink", urlLink);
          formData.append("webStatus", webStatus);
        }
        if (hasApp(kind)) {
          if (appLink) formData.append("appLink", appLink);
          formData.append("appStatus", appStatus);
        }
        if (fileRef.current?.files) {
          Array.from(fileRef.current.files).forEach((file) =>
            formData.append("images", file),
          );
        }

        const res = await fetch("/api/projects", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error();
        const created: Project = await res.json();
        setCurrent(created);
        onSaved(created);
        // depois de criar, já abre a aba de imagens para ajustar a ordem/corte
        setTab("images");
      }
    } catch {
      setError("Erro ao salvar projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    if (!current) return;
    const updated = { ...current, images };
    setCurrent(updated);
    onSaved(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <ModalBackdrop onClick={onClose} />

      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6 pb-4">
          <h2 className="text-lg font-bold">
            {isEdit ? "Editar projeto" : "Novo projeto"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex gap-1 border-b border-border px-6">
          <TabButton
            active={tab === "info"}
            onClick={() => setTab("info")}
            icon={<Info className="h-4 w-4" />}
            label="Informações"
          />
          <TabButton
            active={tab === "images"}
            onClick={() => current && setTab("images")}
            disabled={!current}
            icon={<ImageIcon className="h-4 w-4" />}
            label={`Imagens${current ? ` (${current.images.length})` : ""}`}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "info" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Título *">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex: Landing Page | Empresa XYZ"
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Descrição *">
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ex: React com Next.js, TypeScript e Firebase"
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Detalhes *">
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Descreva o projeto em mais detalhes..."
                  className={`${inputClass} min-h-[80px] resize-y`}
                  required
                />
              </Field>

              <Field
                label="Tipo do projeto"
                hint="Use “Site + App” quando existir versão web e versão app."
              >
                <div className="grid grid-cols-3 gap-2">
                  {PROJECT_KINDS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setKind(option.value)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                        kind === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </Field>

              {hasWeb(kind) && (
                <div className="space-y-4 rounded-xl border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Versão web
                  </p>
                  <Field label="Badge da versão web">
                    <select
                      value={webStatus}
                      onChange={(event) =>
                        setWebStatus(event.target.value as WebStatus | "none")
                      }
                      className={inputClass}
                    >
                      {(Object.keys(WEB_STATUS) as WebStatus[]).map((option) => (
                        <option key={option} value={option}>
                          {WEB_STATUS[option].label}
                        </option>
                      ))}
                      <option value="none">Sem badge</option>
                    </select>
                  </Field>
                  <Field label="URL do site">
                    <input
                      value={urlLink ?? ""}
                      onChange={(event) => setUrlLink(event.target.value)}
                      placeholder="https://..."
                      type="url"
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

              {hasApp(kind) && (
                <div className="space-y-4 rounded-xl border border-border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Versão app
                  </p>
                  <Field label="Badge da versão app">
                    <select
                      value={appStatus}
                      onChange={(event) =>
                        setAppStatus(event.target.value as AppStatus | "none")
                      }
                      className={inputClass}
                    >
                      {(Object.keys(APP_STATUS) as AppStatus[]).map((option) => (
                        <option key={option} value={option}>
                          {APP_STATUS[option].label}
                        </option>
                      ))}
                      <option value="none">Sem badge</option>
                    </select>
                  </Field>
                  <Field
                    label="Link da Play Store"
                    hint="Opcional. Deixe vazio enquanto o app não estiver publicado."
                  >
                    <input
                      value={appLink ?? ""}
                      onChange={(event) => setAppLink(event.target.value)}
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      type="url"
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

              <ProjectBadge
                project={{
                  kind,
                  urlLink,
                  appLink,
                  webStatus,
                  appStatus,
                }}
              />

              {!isEdit && (
                <Field
                  label="Imagens"
                  hint="Depois de criar, você ajusta a ordem e o corte na aba Imagens."
                >
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className={`${inputClass} file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-sm file:font-medium file:text-secondary-foreground`}
                  />
                </Field>
              )}

              {error && <p className="px-1 text-sm text-destructive">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {isEdit ? "Cancelar" : "Fechar"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  ) : isEdit ? (
                    "Salvar"
                  ) : (
                    "Criar projeto"
                  )}
                </button>
              </div>
            </form>
          ) : current ? (
            <ImageManager
              projectId={current.id}
              images={current.images}
              onChange={handleImagesChange}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
