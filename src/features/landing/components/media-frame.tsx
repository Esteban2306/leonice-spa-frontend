import Image from "next/image";
import type { ReactNode } from "react";
import { ImageOff } from "lucide-react";

interface MediaFrameProps {
  src: string | null | undefined;
  alt: string;
  hint: string;
  tone?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  compact?: boolean;
  labelPosition?: "center" | "top";
  children?: ReactNode;
}

export function MediaFrame({
  src,
  alt,
  hint,
  tone = "light",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  className = "",
  imageClassName = "",
  compact = false,
  labelPosition = "center",
  children,
}: MediaFrameProps) {
  return (
    <div className={`overflow-hidden ${/(^|\s)(absolute|fixed)(\s|$)/.test(className) ? "" : "relative"} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <div
          role="img"
          aria-label={`Sin imagen: ${hint}`}
          data-tone={tone}
          className={`media-empty absolute inset-0 grid ${labelPosition === "top" ? "place-items-start justify-items-end p-5" : "place-items-center"} ${imageClassName}`}
        >
          <div
            className={`flex max-w-[85%] flex-col gap-2 ${labelPosition === "top" ? "items-end text-right" : "items-center text-center"} ${
              tone === "dark" ? "text-[#E0BC87]/80" : "text-[#7a5a2c]"
            }`}
          >
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] ${
                tone === "dark" ? "border-[#E0BC87]/50" : "border-[#BF9250]/60"
              }`}
            >
              <ImageOff className="size-3.5" aria-hidden="true" />
              Sin imagen
            </span>
            {!compact && (
              <span className="font-sans text-xs leading-snug opacity-80">{hint}</span>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
