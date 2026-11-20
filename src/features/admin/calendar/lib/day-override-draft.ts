export interface DayOverrideDraft {
  from: string;
  to: string;
  closed: boolean;
  windows: Array<{ startTime: string; endTime: string }>;
  fixedStarts: boolean;
  startTimes: string[];
  reason: string;
}

export const MAX_OVERRIDE_DAYS = 62;

function daysBetween(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000) + 1;
}

export function validateDayOverrideDraft(draft: DayOverrideDraft): string[] {
  const errors: string[] = [];
  if (!draft.from || !draft.to || draft.to < draft.from) {
    errors.push("La fecha final debe ser igual o posterior a la inicial.");
  } else if (daysBetween(draft.from, draft.to) > MAX_OVERRIDE_DAYS) {
    errors.push(`Elige como máximo ${MAX_OVERRIDE_DAYS} días a la vez.`);
  }
  if (draft.closed) return errors;

  if (draft.windows.length === 0) {
    errors.push("Agrega al menos una franja o marca el día como cerrado.");
  }
  if (
    draft.windows.some(
      (w) => !w.startTime || !w.endTime || w.startTime >= w.endTime,
    )
  ) {
    errors.push(
      "En cada franja, la hora de inicio debe ser antes de la de fin.",
    );
  }
  const sorted = [...draft.windows].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );
  if (sorted.some((w, i) => i > 0 && w.startTime < sorted[i - 1].endTime)) {
    errors.push("Las franjas no pueden cruzarse.");
  }
  if (draft.fixedStarts) {
    if (draft.startTimes.length === 0) {
      errors.push("Agrega al menos una hora de inicio.");
    }
    const outside = draft.startTimes.filter(
      (time) =>
        !draft.windows.some((w) => time >= w.startTime && time < w.endTime),
    );
    if (outside.length > 0) {
      errors.push(
        `Estas horas de inicio quedan fuera de las franjas: ${outside.join(", ")}.`,
      );
    }
  }
  return errors;
}

export function toDayOverrideRequest(draft: DayOverrideDraft) {
  return {
    from: draft.from,
    to: draft.to,
    windows: draft.closed ? [] : draft.windows,
    startTimes:
      !draft.closed && draft.fixedStarts
        ? [...new Set(draft.startTimes)].sort()
        : [],
    reason: draft.reason.trim() || undefined,
  };
}
