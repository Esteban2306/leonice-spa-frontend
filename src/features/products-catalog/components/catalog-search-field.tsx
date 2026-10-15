"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const SEARCH_DELAY_MS = 280;

interface CatalogSearchFieldProps {
  value: string;
  onCommit: (value: string) => void;
  compact?: boolean;
}

export function CatalogSearchField({ value, onCommit, compact = false }: CatalogSearchFieldProps) {
  const [query, setQuery] = useState(value);
  const [synced, setSynced] = useState(value);

  if (synced !== value) {
    setSynced(value);
    setQuery(value);
  }

  useEffect(() => {
    if (query === value) return;
    const timer = window.setTimeout(() => onCommit(query), SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [query, value, onCommit]);

  return (
    <label className="relative flex min-w-0 flex-1 basis-56 items-center">
      <span className="sr-only">Buscar productos</span>
      <Search className="pointer-events-none absolute left-4 size-4 text-[#7a5a2c]" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Busca por nombre o necesidad"
        className={`w-full rounded-full border border-[#062112]/15 bg-white/70 pl-11 pr-4 font-sans text-[0.95rem] text-[#062112] placeholder:text-[#062112]/45 transition-[border-color,box-shadow] duration-300 focus:border-[#BF9250] focus:shadow-[0_0_0_4px_rgb(191_146_80/0.18)] focus:outline-none ${
          compact ? "h-10" : "h-11"
        }`}
      />
    </label>
  );
}
