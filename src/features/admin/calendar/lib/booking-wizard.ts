import { BUSINESS_TIME_ZONE } from "@/src/lib/date/bogota";
import type { AvailabilitySlot } from "@/src/features/admin/types/reservations.types";

import type { BookingClient } from "../types/calendar.types";
import { MAX_AGREED_PRICE } from "./booking";
import { addDays, toDateKey } from "./calendar-dates";

export const WIZARD_STEPS = [
  "cliente",
  "servicio",
  "dia",
  "hora",
  "revisar",
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number];

export const AVAILABILITY_WINDOW_DAYS = 42;

const MIN_PHONE_DIGITS = 10;
const MIN_NAME_LENGTH = 2;
const DAY_MS = 86_400_000;

export interface WizardDraft {
  picked: BookingClient | null;
  isNewClient: boolean;
  phone: string;
  name: string;
  birthDate: string;
  /** Un servicio por categoría: categoryId -> treatmentId. */
  selection: Readonly<Record<string, string>>;
  dayKey: string | null;
  slotIso: string | null;
  prices: Readonly<Record<string, string>>;
}

export const EMPTY_DRAFT: WizardDraft = {
  picked: null,
  isNewClient: false,
  phone: "",
  name: "",
  birthDate: "",
  selection: {},
  dayKey: null,
  slotIso: null,
  prices: {},
};

export type WizardAction =
  | { type: "pickClient"; client: BookingClient }
  | { type: "clearClient" }
  | { type: "startNewClient"; search: string }
  | { type: "setField"; field: "phone" | "name" | "birthDate"; value: string }
  | {
      type: "selectService";
      categoryId: string;
      treatmentId: string;
      keepOthers: boolean;
    }
  | { type: "removeService"; categoryId: string }
  | { type: "selectDay"; dayKey: string }
  | { type: "selectSlot"; iso: string }
  | { type: "setPrice"; treatmentId: string; value: string }
  | { type: "reset" };

// La disponibilidad depende de los servicios: al cambiarlos, día y hora ya no valen.
function withSelection(
  draft: WizardDraft,
  selection: Record<string, string>,
): WizardDraft {
  const before = Object.values(draft.selection).sort().join(",");
  const after = Object.values(selection).sort().join(",");
  if (before === after) return draft;
  // El servidor rechaza precios de servicios que ya no van en la reserva.
  const chosen = new Set(Object.values(selection));
  const prices = Object.fromEntries(
    Object.entries(draft.prices).filter(([id]) => chosen.has(id)),
  );
  return { ...draft, selection, prices, dayKey: null, slotIso: null };
}

export function wizardReducer(
  draft: WizardDraft,
  action: WizardAction,
): WizardDraft {
  switch (action.type) {
    case "pickClient":
      return {
        ...draft,
        picked: action.client,
        isNewClient: false,
        birthDate: draft.picked?.id === action.client.id ? draft.birthDate : "",
      };
    case "clearClient":
      return { ...draft, picked: null, isNewClient: false, birthDate: "" };
    case "startNewClient": {
      const search = action.search.trim();
      const looksLikePhone = /^[\d\s+()-]+$/.test(search);
      return {
        ...draft,
        picked: null,
        isNewClient: true,
        phone: draft.phone || (looksLikePhone ? search : ""),
        name: draft.name || (looksLikePhone ? "" : search),
      };
    }
    case "setField":
      return { ...draft, [action.field]: action.value };
    case "selectService": {
      const others = action.keepOthers ? draft.selection : {};
      return withSelection(draft, {
        ...others,
        [action.categoryId]: action.treatmentId,
      });
    }
    case "removeService":
      return withSelection(
        draft,
        Object.fromEntries(
          Object.entries(draft.selection).filter(
            ([categoryId]) => categoryId !== action.categoryId,
          ),
        ),
      );
    case "selectDay":
      return draft.dayKey === action.dayKey
        ? draft
        : { ...draft, dayKey: action.dayKey, slotIso: null };
    case "selectSlot":
      return { ...draft, slotIso: action.iso };
    case "setPrice":
      return {
        ...draft,
        prices: { ...draft.prices, [action.treatmentId]: action.value },
      };
    case "reset":
      return EMPTY_DRAFT;
  }
}

function missingForClient(draft: WizardDraft): string | null {
  if (draft.picked) {
    return draft.picked.missingBirthDate && draft.birthDate === ""
      ? "Falta la fecha de nacimiento."
      : null;
  }
  if (!draft.isNewClient) return "Busca y toca el nombre de la persona.";
  if (draft.phone.replace(/\D/g, "").length < MIN_PHONE_DIGITS) {
    return "Falta el celular completo (10 números).";
  }
  if (draft.name.trim().length < MIN_NAME_LENGTH) return "Falta el nombre.";
  if (draft.birthDate === "") return "Falta la fecha de nacimiento.";
  return null;
}

function hasPriceOverLimit(draft: WizardDraft): boolean {
  return Object.values(draft.prices).some(
    (raw) => Number(raw.replace(/\D/g, "")) > MAX_AGREED_PRICE,
  );
}

/** Qué falta para dar por completo un paso; null cuando ya está listo. */
export function missingFor(step: WizardStep, draft: WizardDraft): string | null {
  switch (step) {
    case "cliente":
      return missingForClient(draft);
    case "servicio":
      return Object.keys(draft.selection).length === 0
        ? "Toca un servicio."
        : null;
    case "dia":
      return draft.dayKey ? null : "Toca un día.";
    case "hora":
      return draft.slotIso ? null : "Toca una hora.";
    case "revisar":
      return hasPriceOverLimit(draft)
        ? "El precio acordado es demasiado alto: revísalo."
        : null;
  }
}

export function parseStep(raw: string | null): WizardStep | null {
  return WIZARD_STEPS.find((step) => step === raw) ?? null;
}

/** No deja saltar pasos: devuelve el primero incompleto antes del pedido. */
export function resolveStep(
  requested: WizardStep,
  draft: WizardDraft,
): WizardStep {
  const earlier = WIZARD_STEPS.slice(0, WIZARD_STEPS.indexOf(requested));
  return earlier.find((step) => missingFor(step, draft) !== null) ?? requested;
}

export function nextStep(step: WizardStep): WizardStep {
  const index = WIZARD_STEPS.indexOf(step);
  return WIZARD_STEPS[Math.min(index + 1, WIZARD_STEPS.length - 1)];
}

export function previousStep(step: WizardStep): WizardStep | null {
  const index = WIZARD_STEPS.indexOf(step);
  return index > 0 ? WIZARD_STEPS[index - 1] : null;
}

export function availabilityWindow(
  today: Date,
  page: number,
): { from: string; to: string } {
  const from = addDays(today, page * AVAILABILITY_WINDOW_DAYS);
  return {
    from: toDateKey(from),
    to: toDateKey(addDays(from, AVAILABILITY_WINDOW_DAYS - 1)),
  };
}

export function windowPageOf(today: Date, dayKey: string): number {
  const [year, month, day] = dayKey.split("-").map(Number);
  const diff = Math.round(
    (new Date(year, month - 1, day).getTime() - today.getTime()) / DAY_MS,
  );
  return Math.max(0, Math.floor(diff / AVAILABILITY_WINDOW_DAYS));
}

const longDayFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function formatDayChoice(dayKey: string, today: Date): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const label = longDayFormatter.format(new Date(year, month - 1, day));
  const sentence = label.charAt(0).toUpperCase() + label.slice(1);

  if (dayKey === toDateKey(today)) return `Hoy · ${sentence}`;
  if (dayKey === toDateKey(addDays(today, 1))) return `Mañana · ${sentence}`;
  return sentence;
}

const hourFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIME_ZONE,
  hour: "2-digit",
  hourCycle: "h23",
});

export function splitSlots(slots: readonly AvailabilitySlot[]): {
  morning: AvailabilitySlot[];
  afternoon: AvailabilitySlot[];
} {
  const isMorning = (slot: AvailabilitySlot) =>
    Number(hourFormatter.format(new Date(slot.iso))) < 12;

  return {
    morning: slots.filter(isMorning),
    afternoon: slots.filter((slot) => !isMorning(slot)),
  };
}
