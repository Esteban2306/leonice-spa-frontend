import type {
  BaseScheduleWindow,
  UpdateBaseScheduleRequest,
} from "@/src/features/admin/types/schedule.types";

export const MAX_WINDOWS_PER_DAY = 4;

export const WEEK_ORDER: ReadonlyArray<{ dayOfWeek: number; label: string }> = [
  { dayOfWeek: 1, label: "Lunes" },
  { dayOfWeek: 2, label: "Martes" },
  { dayOfWeek: 3, label: "Miércoles" },
  { dayOfWeek: 4, label: "Jueves" },
  { dayOfWeek: 5, label: "Viernes" },
  { dayOfWeek: 6, label: "Sábado" },
  { dayOfWeek: 0, label: "Domingo" },
];

export interface DraftWindow {
  key: string;
  startTime: string;
  endTime: string;
}

export type WeeklyDraft = Record<number, DraftWindow[]>;

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

let keySeed = 0;
export function newWindowKey(): string {
  keySeed += 1;
  return `w${keySeed}`;
}

export function draftFromBase(
  base: readonly BaseScheduleWindow[],
): WeeklyDraft {
  const draft: WeeklyDraft = {};
  for (const { dayOfWeek } of WEEK_ORDER) draft[dayOfWeek] = [];
  for (const window of base) {
    draft[window.dayOfWeek]?.push({
      key: newWindowKey(),
      startTime: window.startTime,
      endTime: window.endTime,
    });
  }
  for (const { dayOfWeek } of WEEK_ORDER) {
    draft[dayOfWeek].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
  return draft;
}

export function suggestNextWindow(windows: readonly DraftWindow[]): {
  startTime: string;
  endTime: string;
} {
  const last = [...windows]
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .at(-1);
  if (!last || !TIME.test(last.endTime))
    return { startTime: "08:00", endTime: "12:00" };
  const [hours, minutes] = last.endTime.split(":").map(Number);
  const start = Math.min(hours + 1, 22);
  const end = Math.min(start + 3, 23);
  const pad = (value: number) => String(value).padStart(2, "0");
  return {
    startTime: `${pad(start)}:${pad(minutes)}`,
    endTime: `${pad(end)}:${pad(minutes)}`,
  };
}

export function validateWeeklyDraft(
  draft: WeeklyDraft,
): Record<number, string> {
  const errors: Record<number, string> = {};
  let openWindows = 0;

  for (const { dayOfWeek, label } of WEEK_ORDER) {
    const windows = [...(draft[dayOfWeek] ?? [])].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
    openWindows += windows.length;

    if (windows.some((w) => !TIME.test(w.startTime) || !TIME.test(w.endTime))) {
      errors[dayOfWeek] = `Completa las horas del ${label.toLowerCase()}.`;
    } else if (windows.some((w) => w.startTime >= w.endTime)) {
      errors[dayOfWeek] = "Cada franja debe terminar después de empezar.";
    } else if (
      windows.some((w, i) => i > 0 && w.startTime < windows[i - 1].endTime)
    ) {
      errors[dayOfWeek] = "Las franjas de este día se cruzan.";
    } else if (windows.length > MAX_WINDOWS_PER_DAY) {
      errors[dayOfWeek] = `Máximo ${MAX_WINDOWS_PER_DAY} franjas por día.`;
    }
  }

  if (openWindows === 0)
    errors[-1] = "El spa debe abrir al menos una franja en la semana.";
  return errors;
}

export function draftToRequest(draft: WeeklyDraft): UpdateBaseScheduleRequest {
  return {
    days: WEEK_ORDER.map(({ dayOfWeek }) => ({
      dayOfWeek,
      windows: [...(draft[dayOfWeek] ?? [])]
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map(({ startTime, endTime }) => ({ startTime, endTime })),
    })),
  };
}

export function isSameSchedule(
  draft: WeeklyDraft,
  base: readonly BaseScheduleWindow[],
): boolean {
  const flat = draftToRequest(draft).days.flatMap((day) =>
    day.windows.map((w) => `${day.dayOfWeek}|${w.startTime}|${w.endTime}`),
  );
  const original = base.map(
    (w) => `${w.dayOfWeek}|${w.startTime}|${w.endTime}`,
  );
  return flat.sort().join(",") === original.sort().join(",");
}

export function totalWeeklyHours(draft: WeeklyDraft): number {
  let minutes = 0;
  for (const windows of Object.values(draft)) {
    for (const w of windows) {
      if (!TIME.test(w.startTime) || !TIME.test(w.endTime)) continue;
      const [sh, sm] = w.startTime.split(":").map(Number);
      const [eh, em] = w.endTime.split(":").map(Number);
      minutes += Math.max(0, eh * 60 + em - (sh * 60 + sm));
    }
  }
  return Math.round((minutes / 60) * 10) / 10;
}
