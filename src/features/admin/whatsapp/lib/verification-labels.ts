import type { StatusTone } from "./whatsapp-format";
import type {
  ChecklistItem,
  ChecklistKey,
  VerificationMode,
} from "../../types/verification.types";

export const VERDICT_LABELS: Record<
  string,
  { label: string; tone: StatusTone }
> = {
  VALID: { label: "Válido", tone: "green" },
  INVALID: { label: "No válido", tone: "red" },
  NEEDS_REVIEW: { label: "Por revisar", tone: "amber" },
  UNREADABLE: { label: "Ilegible", tone: "amber" },
  NOT_APPLICABLE: { label: "No es un comprobante", tone: "gray" },
  ERROR: { label: "No se pudo analizar", tone: "red" },
};

const REASON_LABELS: Record<string, string> = {
  RULES_PASSED: "Cumple todo",
  AMOUNT_GTE_FAILED: "Monto menor al anticipo",
  DESTINATION_WITHIN_FAILED: "Cuenta distinta a la del spa",
  DATE_WITHIN_DAYS_FAILED: "Comprobante antiguo",
  AMOUNT_MISSING: "No se leyó el monto",
  DESTINATION_MISSING: "No se leyó la cuenta",
  DATE_MISSING: "No se leyó la fecha",
  ALREADY_USED: "Comprobante ya usado",
  REUSED_OTHER_CONTACT: "Usado en otro chat",
  RESENT_SAME_IMAGE: "Reenvío del mismo comprobante",
  RESENT_SAME_RECEIPT: "Reenvío del mismo comprobante",
  GROUNDING_UNAVAILABLE: "No se pudo consultar un dato del negocio",
  IMAGE_UNREADABLE: "Imagen ilegible",
  LEGIBILITY_PARTIAL: "Se lee solo en parte",
  NOT_EXPECTED_DOCUMENT: "No parece un comprobante",
  TIMEOUT: "El análisis tardó demasiado",
  PROVIDER_ERROR: "Falló el proveedor de IA",
  NO_MODEL: "Sin modelo de IA disponible",
};

const FALLBACK_REASON = "Otro motivo";

export function reasonLabel(code: string): string {
  return REASON_LABELS[code] ?? FALLBACK_REASON;
}

export function reasonsText(codes: readonly string[]): string {
  const meaningful = codes.filter((c) => c !== "RULES_PASSED");
  const list = meaningful.length > 0 ? meaningful : codes;
  if (list.length === 0) return "—";
  return [...new Set(list.map(reasonLabel))].join(" · ");
}

export const MODE_OPTIONS: ReadonlyArray<{
  mode: VerificationMode;
  label: string;
  description: string;
}> = [
  {
    mode: "OFF",
    label: "Apagada",
    description: "No se revisan los comprobantes.",
  },
  {
    mode: "SHADOW",
    label: "Solo observar",
    description:
      "Se revisan y se guardan los resultados, pero el asistente no los usa.",
  },
  {
    mode: "ACTIVE",
    label: "Activa",
    description:
      "El asistente usa el resultado: avisa a la clienta si el comprobante no es válido.",
  },
];

export interface ChecklistView {
  title: string;
  state: "ok" | "fail" | "unknown";
  hint: string | null;
}

const CHECK_TEXT: Record<
  ChecklistKey,
  { title: string; fail: string; unknown?: string }
> = {
  runtime: {
    title: "Verificación encendida en el servidor",
    fail: "Los especialistas están apagados en el servicio de WhatsApp. Hay que activar SPECIALISTS_ENABLED en Railway.",
    unknown:
      "No se pudo comprobar: el servicio de WhatsApp es de una versión anterior o no respondió.",
  },
  images: {
    title: "El asistente analiza las imágenes",
    fail: "El análisis de imágenes del asistente está apagado.",
  },
  specialist: {
    title: "Especialista de comprobantes",
    fail: "No existe o está inactivo.",
  },
  model: {
    title: "Modelo de IA para leer imágenes",
    fail: "No hay un modelo disponible. Agrega uno o cambia su clave.",
  },
  binding: {
    title: "Verificación activa en este asistente",
    fail: "Está apagada o solo observando.",
  },
};

export function checklistView(item: ChecklistItem): ChecklistView {
  const text = CHECK_TEXT[item.key];
  if (item.ok === true) return { title: text.title, state: "ok", hint: null };
  if (item.ok === null) {
    return {
      title: text.title,
      state: "unknown",
      hint: text.unknown ?? text.fail,
    };
  }
  return { title: text.title, state: "fail", hint: text.fail };
}
