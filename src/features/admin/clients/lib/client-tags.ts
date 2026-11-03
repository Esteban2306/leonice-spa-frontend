import type {
  ClientTag,
  ClientTagKey,
} from "@/src/features/admin/types/clients.types";

export type ClientTagTone =
  "green" | "gold" | "amber" | "blue" | "rose" | "red" | "muted";

interface ClientTagMeta {
  label: string;
  description: string;
  tone: ClientTagTone;
}

export const CLIENT_TAG_META: Readonly<Record<ClientTagKey, ClientTagMeta>> = {
  APTA_PROMOCION: {
    label: "Apta para promociones",
    description:
      "Completó al menos una cita en el último año y no tiene inasistencias repetidas. Es la lista segura para enviar promociones.",
    tone: "green",
  },
  RECURRENTE: {
    label: "Recurrente",
    description: "Tiene 3 o más citas completadas en los últimos 6 meses.",
    tone: "gold",
  },
  NUEVA: {
    label: "Nueva",
    description: "Su primera cita completada fue hace menos de 60 días.",
    tone: "green",
  },
  CON_CITA_PROXIMA: {
    label: "Cita próxima",
    description: "Tiene una cita confirmada o en curso por delante.",
    tone: "blue",
  },
  RESERVA_PENDIENTE: {
    label: "Reserva pendiente",
    description:
      "Tiene una reserva futura sin confirmar: valoración o depósito por resolver.",
    tone: "blue",
  },
  FRECUENTA: {
    label: "Frecuenta",
    description: "Categoría en la que completó 2 o más citas en el último año.",
    tone: "gold",
  },
  REPITE_SERVICIO: {
    label: "Repite",
    description: "Servicio que completó 2 o más veces en el último año.",
    tone: "gold",
  },
  CUMPLE_PRONTO: {
    label: "Cumple pronto",
    description: "Su cumpleaños es en los próximos 30 días.",
    tone: "rose",
  },
  EN_PAUSA: {
    label: "En pausa",
    description:
      "Su última cita completada fue hace entre 3 y 12 meses. Buena candidata a reactivar.",
    tone: "amber",
  },
  INACTIVA: {
    label: "Inactiva",
    description: "Hace más de un año que no completa una cita.",
    tone: "muted",
  },
  SIN_VISITAS: {
    label: "Aún no asiste",
    description:
      "Escribió o reservó, pero todavía no tiene ninguna cita completada.",
    tone: "muted",
  },
  NO_SHOW_REITERADO: {
    label: "No asiste a sus citas",
    description: "Tiene 2 o más inasistencias en el último año.",
    tone: "red",
  },
};

export const CLIENT_TAG_ORDER: readonly ClientTagKey[] = [
  "APTA_PROMOCION",
  "RECURRENTE",
  "NUEVA",
  "CON_CITA_PROXIMA",
  "RESERVA_PENDIENTE",
  "FRECUENTA",
  "REPITE_SERVICIO",
  "CUMPLE_PRONTO",
  "EN_PAUSA",
  "INACTIVA",
  "SIN_VISITAS",
  "NO_SHOW_REITERADO",
];

export function clientTagLabel(tag: Pick<ClientTag, "key" | "detail">): string {
  const base = CLIENT_TAG_META[tag.key].label;
  return tag.detail ? `${base} ${tag.detail}` : base;
}

export function sortClientTags<T extends Pick<ClientTag, "key" | "detail">>(
  tags: readonly T[],
): T[] {
  return [...tags].sort(
    (a, b) =>
      CLIENT_TAG_ORDER.indexOf(a.key) - CLIENT_TAG_ORDER.indexOf(b.key) ||
      a.detail.localeCompare(b.detail, "es"),
  );
}

export function toggleTagKey(
  selected: readonly ClientTagKey[],
  key: ClientTagKey,
): ClientTagKey[] {
  return selected.includes(key)
    ? selected.filter((item) => item !== key)
    : [...selected, key];
}

export function parseTagParam(raw: string | null): ClientTagKey[] {
  if (!raw) return [];
  const valid = new Set<string>(CLIENT_TAG_ORDER);
  return raw
    .split(",")
    .filter((item): item is ClientTagKey => valid.has(item))
    .slice(0, 6);
}
