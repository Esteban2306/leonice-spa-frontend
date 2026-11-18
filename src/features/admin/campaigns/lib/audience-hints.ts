import type { AudienceFilter } from "@/src/features/admin/types/campaigns.types";
import type { ClientTagKey } from "@/src/features/admin/types/clients.types";

import { CLIENT_TAG_META } from "../../clients/lib/client-tags";

const quoted = (keys: readonly ClientTagKey[]) =>
  keys.map((key) => `"${CLIENT_TAG_META[key].label}"`).join(", ");

export function audienceHints(
  filter: AudienceFilter,
  counts: ReadonlyMap<ClientTagKey, number>,
): string[] {
  const required = filter.tags ?? [];
  const excluded = new Set(filter.excludeTags ?? []);
  const hints: string[] = [];

  const conflicting = required.filter((key) => excluded.has(key));
  if (conflicting.length > 0) {
    hints.push(
      `${quoted(conflicting)} está a la vez en "Debe tener" y en "No debe tener", así que nadie puede cumplirlo.`,
    );
  }

  const empty = required.filter((key) => (counts.get(key) ?? 0) === 0);
  if (empty.length > 0) {
    hints.push(
      `Ninguna clienta tiene ${quoted(empty)}. Como deben cumplirse todas las etiquetas a la vez, quítala${empty.length > 1 ? "s" : ""} para ver a quién le llega.`,
    );
  }

  return hints;
}
