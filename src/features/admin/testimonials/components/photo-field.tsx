"use client";

import { useId, useState, type DragEvent } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { toastError } from "@/src/features/admin/feedback/admin-toast";

import {
  ACCEPTED_IMAGE_TYPES,
  isOptimizableImage,
  validateImageFile,
} from "../../products/lib/product-catalog";
import { TESTIMONIAL_PHOTO } from "../lib/testimonial-form";

interface PhotoFieldProps {
  label: string;
  imageUrl: string | null;
  isBusy?: boolean;
  disabled?: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}

export function PhotoField({
  label,
  imageUrl,
  isBusy = false,
  disabled = false,
  onPick,
  onRemove,
}: PhotoFieldProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = imageUrl !== null && imageUrl !== failedUrl;
  const locked = disabled || isBusy;

  const accept = (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) {
      toastError("No se pudo usar esa foto", new Error(problem));
      return;
    }
    onPick(file);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!locked) accept(event.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-sans text-xs uppercase tracking-[0.16em] text-secondary/80">
        {label}
      </p>
      <div className="group/photo relative">
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            if (!locked) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{ aspectRatio: TESTIMONIAL_PHOTO.ratio }}
          className={cn(
            "relative grid w-full cursor-pointer place-items-center overflow-hidden rounded-[1.25rem] border transition-[border-color,background-color] duration-200 focus-within:ring-2 focus-within:ring-tertiary",
            imageUrl
              ? "border-tertiary/30 bg-white"
              : "border-dashed border-tertiary/60 bg-[repeating-linear-gradient(135deg,rgba(191,146,80,0.10)_0_1px,transparent_1px_10px)] hover:border-tertiary hover:bg-quaternary/20",
            isDragging && "border-solid border-secondary bg-quaternary/40",
            locked && "cursor-wait",
          )}
        >
          <input
            id={inputId}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            disabled={locked}
            className="sr-only"
            aria-label={
              imageUrl
                ? `Cambiar la foto del ${label.toLowerCase()}`
                : `Subir la foto del ${label.toLowerCase()}`
            }
            onChange={(event) => {
              accept(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          {showImage ? (
            <Image
              src={imageUrl}
              onError={() => setFailedUrl(imageUrl)}
              unoptimized={!isOptimizableImage(imageUrl)}
              alt={`Foto del ${label.toLowerCase()}`}
              fill
              sizes="(min-width: 640px) 240px, 45vw"
              className="object-cover"
            />
          ) : (
            <span className="flex flex-col items-center gap-1.5 px-3 text-center text-[#7A5A2C]">
              <ImagePlus
                aria-hidden="true"
                className="size-7"
                strokeWidth={1.5}
              />
              <span className="font-sans text-sm font-medium">Subir foto</span>
              <span className="font-sans text-xs">o arrástrala aquí</span>
            </span>
          )}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-2 top-2 rounded-full bg-secondary/85 px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
          >
            {label}
          </span>
          {isBusy && (
            <span className="absolute inset-0 grid place-items-center bg-secondary/55 text-primary backdrop-blur-[1px]">
              <LoaderCircle
                aria-label="Subiendo foto"
                className="size-6 animate-spin"
              />
            </span>
          )}
        </label>
        {imageUrl && !locked && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Quitar la foto del ${label.toLowerCase()}`}
            title="Quitar foto"
            className="absolute -right-1.5 -top-1.5 grid size-8 cursor-pointer place-items-center rounded-full border border-tertiary/40 bg-primary text-secondary/75 shadow-[0_4px_10px_-4px_rgba(74,46,16,0.45)] transition-colors hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
