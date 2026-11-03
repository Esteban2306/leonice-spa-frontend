import type { ClientTag } from "@/src/features/admin/types/clients.types";

import {
  CLIENT_TAG_META,
  clientTagLabel,
  sortClientTags,
  type ClientTagTone,
} from "../lib/client-tags";

const LIGHT_TONE: Record<ClientTagTone, string> = {
  green: "border-green-300 bg-green-50 text-green-800",
  gold: "border-tertiary/60 bg-quaternary/30 text-secondary",
  amber: "border-amber-300 bg-amber-50 text-amber-900",
  blue: "border-sky-300 bg-sky-50 text-sky-900",
  rose: "border-rose-300 bg-rose-50 text-rose-800",
  red: "border-red-300 bg-red-50 text-red-800",
  muted: "border-secondary/15 bg-white text-secondary/65",
};

const DARK_TONE: Record<ClientTagTone, string> = {
  green: "border-green-400/50 bg-green-500/15 text-green-200",
  gold: "border-tertiary/60 bg-tertiary/20 text-tertiary",
  amber: "border-amber-300/50 bg-amber-400/15 text-amber-200",
  blue: "border-sky-300/50 bg-sky-400/15 text-sky-200",
  rose: "border-rose-300/50 bg-rose-400/15 text-rose-200",
  red: "border-red-300/50 bg-red-400/15 text-red-200",
  muted: "border-primary/20 bg-primary/10 text-primary/70",
};

interface ClientTagChipsProps {
  tags: readonly ClientTag[];
  limit?: number;
  onDark?: boolean;
}

export function ClientTagChips({
  tags,
  limit,
  onDark = false,
}: ClientTagChipsProps) {
  const sorted = sortClientTags(tags);
  const visible = limit ? sorted.slice(0, limit) : sorted;
  const hidden = sorted.length - visible.length;
  const palette = onDark ? DARK_TONE : LIGHT_TONE;

  if (sorted.length === 0) return null;

  return (
    <ul aria-label="Etiquetas de la clienta" className="flex flex-wrap gap-1.5">
      {visible.map((tag) => {
        const meta = CLIENT_TAG_META[tag.key];
        return (
          <li
            key={`${tag.key}:${tag.detail}`}
            title={meta.description}
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[11px] ${palette[meta.tone]}`}
          >
            {clientTagLabel(tag)}
          </li>
        );
      })}
      {hidden > 0 && (
        <li
          title={sorted
            .slice(visible.length)
            .map((tag) => clientTagLabel(tag))
            .join(", ")}
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[11px] ${palette.muted}`}
        >
          +{hidden}
        </li>
      )}
    </ul>
  );
}
