"use client";

import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Crop,
  GripVertical,
  ImageIcon,
  Loader2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { hasEdits, isCloudinaryUrl, thumbUrl } from "@/lib/cloudinary-url";
import { ImageCropModal } from "@/components/admin/image-crop-modal";

type Props = {
  projectId: string;
  images: string[];
  onChange: (images: string[]) => void;
};

function move<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function ImageManager({ projectId, images, onChange }: Props) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /** Salva a lista de imagens (ordem, corte e remoções) de forma otimista. */
  const persist = async (next: string[]) => {
    const previous = images;
    onChange(next);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      onChange(previous);
      setError("Não foi possível salvar as imagens. Tente de novo.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));

      const res = await fetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.images as string[]);
    } catch {
      setError("Erro ao enviar as imagens.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    persist(move(images, dragIndex, targetIndex));
    setDragIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">
            {images.length} {images.length === 1 ? "imagem" : "imagens"}
          </p>
          <p className="text-xs text-muted-foreground">
            A primeira é a capa. Arraste ou use as setas para mudar a ordem do
            carrossel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/70 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Adicionar
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(event) => handleUpload(event.target.files)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saving && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> salvando...
        </p>
      )}

      {images.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center text-muted-foreground">
          <ImageIcon className="h-7 w-7" />
          <p className="text-sm">Nenhuma imagem neste projeto ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => setDragIndex(null)}
              className={`overflow-hidden rounded-xl border bg-card transition-opacity ${
                dragIndex === index
                  ? "border-primary opacity-50"
                  : "border-border"
              }`}
            >
              {/* object-contain: mostra a foto inteira, sem cortar nada */}
              <div className="relative aspect-video bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl(image, 640)}
                  alt={`Imagem ${index + 1}`}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />

                <div className="absolute left-2 top-2 flex items-center gap-1.5">
                  <span className="rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  {index === 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      Capa
                    </span>
                  )}
                  {hasEdits(image) && (
                    <span className="rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                      editada
                    </span>
                  )}
                </div>

                <GripVertical className="absolute right-2 top-2 h-4 w-4 cursor-grab text-white/70 drop-shadow" />
              </div>

              <div className="flex items-center gap-1 border-t border-border p-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => persist(move(images, index, index - 1))}
                  title="Mover para trás"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === images.length - 1}
                  onClick={() => persist(move(images, index, index + 1))}
                  title="Mover para frente"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => persist(move(images, index, 0))}
                  title="Definir como capa"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-yellow-500/10 hover:text-yellow-500 disabled:opacity-30"
                >
                  <Star className="h-4 w-4" />
                </button>

                <div className="flex-1" />

                <button
                  type="button"
                  onClick={() => setCropIndex(index)}
                  disabled={!isCloudinaryUrl(image)}
                  title={
                    isCloudinaryUrl(image)
                      ? "Cortar / girar"
                      : "Só é possível editar imagens hospedadas no Cloudinary"
                  }
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                >
                  <Crop className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Remover esta imagem do projeto?")) {
                      persist(images.filter((_, i) => i !== index));
                    }
                  }}
                  title="Remover"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cropIndex !== null && images[cropIndex] && (
        <ImageCropModal
          url={images[cropIndex]}
          onCancel={() => setCropIndex(null)}
          onApply={(newUrl) => {
            const next = images.map((image, i) =>
              i === cropIndex ? newUrl : image,
            );
            setCropIndex(null);
            persist(next);
          }}
        />
      )}
    </div>
  );
}
