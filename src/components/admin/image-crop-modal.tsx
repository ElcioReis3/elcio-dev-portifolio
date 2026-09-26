"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, RotateCcw, RotateCw, Undo2, X } from "lucide-react";
import {
  buildEditedUrl,
  getOriginalUrl,
  readEdits,
  withTransform,
} from "@/lib/cloudinary-url";

/** Retângulo em fração (0..1) da imagem exibida. */
type Rect = { x: number; y: number; w: number; h: number };

type DragMode = "move" | "nw" | "ne" | "sw" | "se";
type DragState = {
  mode: DragMode;
  startX: number;
  startY: number;
  start: Rect;
  box: DOMRect;
} | null;

const MIN = 0.06;
const FULL: Rect = { x: 0, y: 0, w: 1, h: 1 };

const RATIOS: { label: string; value: number | null }[] = [
  { label: "Livre", value: null },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "3:4", value: 3 / 4 },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

function computeRect(
  drag: NonNullable<DragState>,
  dx: number,
  dy: number,
  ratio: number | null,
): Rect {
  const s = drag.start;

  if (drag.mode === "move") {
    return {
      ...s,
      x: clamp(s.x + dx, 0, 1 - s.w),
      y: clamp(s.y + dy, 0, 1 - s.h),
    };
  }

  const right = s.x + s.w;
  const bottom = s.y + s.h;
  let { x, y, w, h } = s;

  if (drag.mode === "se") {
    w = clamp(s.w + dx, MIN, 1 - s.x);
    h = clamp(s.h + dy, MIN, 1 - s.y);
  } else if (drag.mode === "sw") {
    x = clamp(s.x + dx, 0, right - MIN);
    w = right - x;
    h = clamp(s.h + dy, MIN, 1 - s.y);
  } else if (drag.mode === "ne") {
    y = clamp(s.y + dy, 0, bottom - MIN);
    h = bottom - y;
    w = clamp(s.w + dx, MIN, 1 - s.x);
  } else {
    x = clamp(s.x + dx, 0, right - MIN);
    w = right - x;
    y = clamp(s.y + dy, 0, bottom - MIN);
    h = bottom - y;
  }

  if (ratio) {
    // h em fração = (w * larguraPx) / (ratio * alturaPx)
    const k = drag.box.width / (ratio * drag.box.height);
    let nh = w * k;

    if (drag.mode === "se" || drag.mode === "sw") {
      if (y + nh > 1) {
        nh = 1 - y;
        w = nh / k;
      }
      if (drag.mode === "sw") x = right - w;
    } else {
      if (bottom - nh < 0) {
        nh = bottom;
        w = nh / k;
      }
      y = bottom - nh;
      if (drag.mode === "nw") x = right - w;
    }

    h = nh;
    x = clamp(x, 0, 1 - w);
    y = clamp(y, 0, 1 - h);
  }

  return { x, y, w, h };
}

type Props = {
  url: string;
  onCancel: () => void;
  onApply: (url: string) => void;
};

export function ImageCropModal({ url, onCancel, onApply }: Props) {
  const original = getOriginalUrl(url);
  const initialRef = useRef(readEdits(url));
  const appliedInitial = useRef(false);

  const [angle, setAngle] = useState(initialRef.current.angle);
  const [rect, setRect] = useState<Rect>(FULL);
  const [ratio, setRatio] = useState<number | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<DragState>(null);
  const ratioRef = useRef<number | null>(null);
  ratioRef.current = ratio;

  const preview = angle ? withTransform(original, [`a_${angle}`]) : original;

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      event.preventDefault();
      const dx = (event.clientX - drag.startX) / drag.box.width;
      const dy = (event.clientY - drag.startY) / drag.box.height;
      setRect(computeRect(drag, dx, dy, ratioRef.current));
    };
    const stop = () => {
      dragRef.current = null;
    };

    window.addEventListener("pointermove", handleMove, { passive: false });
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  const startDrag = (mode: DragMode) => (event: React.PointerEvent) => {
    if (!imgRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      start: rect,
      box: imgRef.current.getBoundingClientRect(),
    };
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setLoaded(true);

    if (!appliedInitial.current) {
      appliedInitial.current = true;
      const crop = initialRef.current.crop;
      if (crop && img.naturalWidth && img.naturalHeight) {
        setRect({
          x: clamp(crop.x / img.naturalWidth, 0, 1),
          y: clamp(crop.y / img.naturalHeight, 0, 1),
          w: clamp(crop.width / img.naturalWidth, MIN, 1),
          h: clamp(crop.height / img.naturalHeight, MIN, 1),
        });
      }
    }
  };

  const rotate = (delta: number) => {
    setAngle((current) => ((current + delta) % 360 + 360) % 360);
    setRect(FULL);
    setRatio(null);
    setLoaded(false);
  };

  const chooseRatio = (value: number | null) => {
    setRatio(value);
    if (!value || !imgRef.current) return;
    const box = imgRef.current.getBoundingClientRect();
    const k = box.width / (value * box.height);
    let w = 1;
    let h = w * k;
    if (h > 1) {
      h = 1;
      w = h / k;
    }
    setRect({ x: (1 - w) / 2, y: (1 - h) / 2, w, h });
  };

  const reset = () => {
    setAngle(0);
    setRatio(null);
    setRect(FULL);
    setLoaded(false);
  };

  const handleApply = () => {
    if (!natural) return;
    const isFull =
      rect.x < 0.005 && rect.y < 0.005 && rect.w > 0.995 && rect.h > 0.995;

    onApply(
      buildEditedUrl(original, {
        angle,
        crop: isFull
          ? null
          : {
              x: rect.x * natural.w,
              y: rect.y * natural.h,
              width: rect.w * natural.w,
              height: rect.h * natural.h,
            },
      }),
    );
  };

  const cropPx = natural
    ? {
        w: Math.round(rect.w * natural.w),
        h: Math.round(rect.h * natural.h),
      }
    : null;

  const handleClass =
    "absolute w-4 h-4 rounded-full bg-white border-2 border-primary shadow touch-none";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="font-bold">Editar imagem</h3>
            <p className="text-xs text-muted-foreground">
              Arraste as bordas para cortar. O original nunca é alterado.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Área de corte */}
        <div className="flex min-h-[240px] flex-1 items-center justify-center overflow-auto bg-[hsl(var(--secondary))] p-4">
          <div className="relative inline-block select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              key={preview}
              src={preview}
              alt="Imagem em edição"
              onLoad={handleLoad}
              draggable={false}
              className="block max-h-[52vh] max-w-full select-none rounded-lg"
            />

            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-secondary/80">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {loaded && (
              <div
                onPointerDown={startDrag("move")}
                className="absolute cursor-move touch-none border-2 border-primary"
                style={{
                  left: `${rect.x * 100}%`,
                  top: `${rect.y * 100}%`,
                  width: `${rect.w * 100}%`,
                  height: `${rect.h * 100}%`,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                }}
              >
                {/* guias tipo regra dos terços */}
                <div className="pointer-events-none absolute inset-0 opacity-40">
                  <div className="absolute left-1/3 top-0 h-full w-px bg-white" />
                  <div className="absolute left-2/3 top-0 h-full w-px bg-white" />
                  <div className="absolute left-0 top-1/3 h-px w-full bg-white" />
                  <div className="absolute left-0 top-2/3 h-px w-full bg-white" />
                </div>

                <div
                  onPointerDown={startDrag("nw")}
                  className={`${handleClass} -left-2 -top-2 cursor-nwse-resize`}
                />
                <div
                  onPointerDown={startDrag("ne")}
                  className={`${handleClass} -right-2 -top-2 cursor-nesw-resize`}
                />
                <div
                  onPointerDown={startDrag("sw")}
                  className={`${handleClass} -bottom-2 -left-2 cursor-nesw-resize`}
                />
                <div
                  onPointerDown={startDrag("se")}
                  className={`${handleClass} -bottom-2 -right-2 cursor-nwse-resize`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="space-y-3 border-t border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Proporção
            </span>
            {RATIOS.map((option) => (
              <button
                key={option.label}
                onClick={() => chooseRatio(option.value)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  ratio === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {option.label}
              </button>
            ))}

            <div className="flex-1" />

            <button
              onClick={() => rotate(-90)}
              title="Girar para a esquerda"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => rotate(90)}
              title="Girar para a direita"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              onClick={reset}
              title="Voltar ao original"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Undo2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="flex-1 text-xs text-muted-foreground">
              {cropPx
                ? `Recorte: ${cropPx.w} × ${cropPx.h} px`
                : "Carregando imagem..."}
            </p>
            <button
              onClick={onCancel}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              disabled={!loaded}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              <Check className="h-4 w-4" />
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
