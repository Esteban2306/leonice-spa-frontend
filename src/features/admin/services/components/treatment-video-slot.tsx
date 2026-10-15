"use client";

import { useId, useState, type DragEvent } from "react";
import { Clapperboard, LoaderCircle, Trash2, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { toastError } from "@/src/features/admin/feedback/admin-toast";

import { ACCEPTED_VIDEO_TYPES, validateVideoFile } from "../lib/treatment-video";

interface TreatmentVideoSlotProps {
  treatmentName: string;
  videoUrl: string | null;
  posterUrl: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export function TreatmentVideoSlot({
  treatmentName,
  videoUrl,
  posterUrl,
  isUploading,
  onUpload,
  onRemove,
}: TreatmentVideoSlotProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const accept = (file: File | undefined) => {
    if (!file) return;
    const problem = validateVideoFile(file);
    if (problem) {
      toastError("No se pudo usar ese video", new Error(problem));
      return;
    }
    onUpload(file);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    accept(event.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-[1.25rem] border border-tertiary/30 bg-secondary">
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            poster={posterUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
            aria-label={`Video del procedimiento de ${treatmentName}`}
            className="size-full object-cover"
          />
        ) : (
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={cn(
              "grid size-full cursor-pointer place-items-center bg-[repeating-linear-gradient(135deg,rgba(224,188,135,0.12)_0_1px,transparent_1px_12px)] p-6 text-center transition-colors",
              isDragging && "bg-quaternary/20",
              isUploading && "cursor-wait",
            )}
          >
            <span className="flex flex-col items-center gap-2 text-quaternary">
              <Clapperboard aria-hidden="true" className="size-7" strokeWidth={1.5} />
              <span className="font-sans text-sm text-primary">Arrastra el video aquí</span>
              <span className="font-sans text-xs text-primary/60">MP4, WebM o MOV · hasta 100 MB</span>
            </span>
          </label>
        )}
        {isUploading && (
          <span className="absolute inset-0 grid place-items-center bg-secondary/70 text-primary backdrop-blur-[1px]">
            <span className="flex flex-col items-center gap-2 font-sans text-sm">
              <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
              Subiendo video…
            </span>
          </span>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_VIDEO_TYPES.join(",")}
        disabled={isUploading}
        className="sr-only"
        aria-label={videoUrl ? `Cambiar video de ${treatmentName}` : `Subir video de ${treatmentName}`}
        onChange={(event) => {
          accept(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-tertiary/50 px-4 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25 focus-within:ring-2 focus-within:ring-tertiary",
            isUploading && "pointer-events-none opacity-50",
          )}
        >
          <Upload className="size-4" strokeWidth={1.8} aria-hidden="true" />
          {videoUrl ? "Cambiar video" : "Subir video"}
        </label>
        {videoUrl && (
          <button
            type="button"
            disabled={isUploading}
            onClick={onRemove}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 font-sans text-sm text-secondary/70 transition-colors hover:bg-secondary/5 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" strokeWidth={1.8} aria-hidden="true" />
            Quitar video
          </button>
        )}
      </div>
      <p className="font-sans text-xs text-secondary/60">
        Se muestra en la página pública del servicio. Un video vertical corto del procedimiento se ve mejor.
      </p>
    </div>
  );
}
