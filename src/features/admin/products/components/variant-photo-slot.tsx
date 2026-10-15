"use client";

import { useId, useState, type DragEvent } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { toastError } from "@/src/features/admin/feedback/admin-toast";

import {
  ACCEPTED_IMAGE_TYPES,
  validateImageFile,
  isOptimizableImage,
} from "../lib/product-catalog";

interface VariantPhotoSlotProps {
  imageUrl: string | null;
  label: string;
  size?: "sm" | "lg";
  isUploading: boolean;
  disabled?: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export function VariantPhotoSlot({
  imageUrl,
  label,
  size = "sm",
  isUploading,
  disabled,
  onUpload,
  onRemove,
}: VariantPhotoSlotProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = imageUrl !== null && imageUrl !== failedUrl;
  const isLarge = size === "lg";

  const accept = (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) {
      toastError("No se pudo usar esa foto", new Error(problem));
      return;
    }
    onUpload(file);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    accept(event.dataTransfer.files[0]);
  };

  return (
    <div
      className={cn(
        "group/photo relative shrink-0",
        isLarge ? "size-28" : "size-14",
      )}
    >
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        title={imageUrl ? `Cambiar foto de ${label}` : `Subir foto de ${label}`}
        className={cn(
          "relative grid size-full cursor-pointer place-items-center overflow-hidden border transition-[border-color,box-shadow,background-color] duration-200 ease-out focus-within:ring-2 focus-within:ring-tertiary",
          isLarge ? "rounded-[1.25rem]" : "rounded-2xl",
          imageUrl
            ? "border-tertiary/30 bg-white"
            : "border-dashed border-tertiary/60 bg-[repeating-linear-gradient(135deg,rgba(191,146,80,0.10)_0_1px,transparent_1px_10px)] hover:border-tertiary hover:bg-quaternary/20",
          isDragging && "border-solid border-secondary bg-quaternary/40",
          (disabled || isUploading) && "cursor-wait",
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          disabled={disabled || isUploading}
          className="sr-only"
          aria-label={
            imageUrl ? `Cambiar foto de ${label}` : `Subir foto de ${label}`
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
            alt={`Foto de ${label}`}
            fill
            sizes={isLarge ? "112px" : "56px"}
            className="object-cover"
          />
        ) : (
          <span className="flex flex-col items-center gap-0.5 text-[#7A5A2C]">
            <ImagePlus
              aria-hidden="true"
              className={isLarge ? "size-6" : "size-4.5"}
              strokeWidth={1.6}
            />
            {isLarge && (
              <span className="font-sans text-[11px] leading-tight">
                Subir foto
              </span>
            )}
          </span>
        )}
        {isUploading && (
          <span className="absolute inset-0 grid place-items-center bg-secondary/55 text-primary backdrop-blur-[1px]">
            <LoaderCircle
              aria-label="Subiendo foto"
              className="size-5 animate-spin"
            />
          </span>
        )}
      </label>
      {imageUrl && !isUploading && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar foto de ${label}`}
          title="Quitar foto"
          className={cn(
            "absolute -top-1.5 -right-1.5 grid cursor-pointer place-items-center rounded-full border border-tertiary/40 bg-primary text-secondary/70 opacity-0 shadow-[0_4px_10px_-4px_rgba(74,46,16,0.45)] transition-opacity group-focus-within/photo:opacity-100 group-hover/photo:opacity-100 hover:text-red-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary [@media(hover:none)]:opacity-100",
            isLarge ? "size-8" : "size-6",
          )}
        >
          <Trash2 className={isLarge ? "size-4" : "size-3.5"} />
        </button>
      )}
    </div>
  );
}
