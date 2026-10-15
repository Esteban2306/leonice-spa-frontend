"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { Rating } from "@/src/components/ui/rating";
import { siteContact } from "@/src/features/landing/lib/site-config";

const LABELS = [
  "",
  "Cuéntanos qué mejorar",
  "Gracias, ayúdanos a mejorar",
  "Gracias por tu opinión",
  "¡Qué bueno!",
  "¡Nos alegra mucho!",
];

export function ReviewRating() {
  const [value, setValue] = useState(0);
  const url = siteContact.googleReviewUrl;

  const handleChange = (next: number) => {
    setValue(next);
    if (next > 0) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3">
      <Rating
        size={34}
        value={value}
        onValueChange={handleChange}
        aria-label="Califica tu experiencia de 1 a 5 estrellas"
      />
      <p
        role="status"
        aria-live="polite"
        className="min-h-5 font-sans text-sm text-[#062112]/80"
      >
        {value > 0
          ? `${LABELS[value]}. Se abrió Google para publicar tu reseña.`
          : "Toca las estrellas para calificarnos"}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-fit items-center gap-2 rounded-full bg-[#062112] px-4 font-sans text-sm font-bold text-[#F2EBDB] transition-colors hover:bg-[#0d3320]"
      >
        Dejar mi opinión en Google
        <ExternalLink className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
