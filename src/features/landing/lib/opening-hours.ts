import type { BusinessHours, BusinessHoursWindow } from "../api/business-hours";

export interface OpeningHoursRow {
  days: string;
  hours: string;
}

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const SHORT_DAY = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const SCHEMA_DAY = [
  "https://schema.org/Sunday",
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
  "https://schema.org/Saturday",
];

const NBSP = "\u00a0";

export function formatClock(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const minutes = String(m).padStart(2, "0");
  if (h === 12 && m === 0) return `12:00${NBSP}m.`;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = h < 12 ? `a.${NBSP}m.` : `p.${NBSP}m.`;
  return `${h12}:${minutes}${NBSP}${suffix}`;
}

const signature = (windows: BusinessHoursWindow[]) =>
  windows.map((w) => `${w.opens}-${w.closes}`).join(",");

function windowsFor(hours: BusinessHours, dayOfWeek: number) {
  return hours.days.find((day) => day.dayOfWeek === dayOfWeek)?.windows ?? [];
}

export function groupOpeningHours(hours: BusinessHours): OpeningHoursRow[] {
  const groups: { days: number[]; windows: BusinessHoursWindow[] }[] = [];
  for (const dayOfWeek of WEEK_ORDER) {
    const windows = windowsFor(hours, dayOfWeek);
    const last = groups.at(-1);
    if (last && signature(last.windows) === signature(windows)) {
      last.days.push(dayOfWeek);
    } else {
      groups.push({ days: [dayOfWeek], windows });
    }
  }
  return groups.map(({ days, windows }) => ({
    days:
      days.length === 1
        ? SHORT_DAY[days[0]]
        : `${SHORT_DAY[days[0]]} – ${SHORT_DAY[days[days.length - 1]]}`,
    hours:
      windows.length === 0
        ? "Cerrado"
        : windows
            .map((w) => `${formatClock(w.opens)} – ${formatClock(w.closes)}`)
            .join(" y "),
  }));
}

export function toOpeningHoursSpecification(
  hours: BusinessHours,
): OpeningHoursSpecification[] {
  const bySlot = new Map<string, OpeningHoursSpecification>();
  for (const dayOfWeek of WEEK_ORDER) {
    for (const window of windowsFor(hours, dayOfWeek)) {
      const key = `${window.opens}-${window.closes}`;
      const spec = bySlot.get(key) ?? {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [],
        opens: window.opens,
        closes: window.closes,
      };
      spec.dayOfWeek.push(SCHEMA_DAY[dayOfWeek]);
      bySlot.set(key, spec);
    }
  }
  return [...bySlot.values()];
}
