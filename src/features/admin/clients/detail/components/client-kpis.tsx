import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CircleSlash,
  UserX,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatCopFromThousands } from "@/src/lib/money/cop";
import type { ClientDetail } from "@/src/features/admin/types/clients.types";

import { attendanceRate, type HistoryStatusFilter } from "../../lib/client-crm";
import type { ClientTab } from "./client-tabs";

interface ClientKpisProps {
  stats: ClientDetail["stats"];
  creditThousands: number;
  onShowHistory: (filter: HistoryStatusFilter) => void;
  onShowTab: (tab: ClientTab) => void;
}

interface KpiProps {
  icon: LucideIcon;
  value: string;
  label: string;
  hint?: string;
  tone?: "dark" | "light" | "gold";
  onClick: () => void;
}

const TONES = {
  dark: "border-secondary bg-secondary text-primary",
  light: "border-tertiary/25 bg-[#FCF6EB] text-secondary",
  gold: "border-tertiary/40 bg-quaternary/30 text-secondary",
} as const;

function Kpi({ icon: Icon, value, label, hint, tone = "light", onClick }: KpiProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-2 rounded-[1.75rem] border p-4 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${TONES[tone]}`}
    >
      <Icon className="size-4.5 opacity-70" strokeWidth={1.8} />
      <span className="font-heading text-3xl leading-none">{value}</span>
      <span className="font-sans text-sm">{label}</span>
      {hint && <span className="font-sans text-xs opacity-60">{hint}</span>}
    </button>
  );
}

export function ClientKpis({ stats, creditThousands, onShowHistory, onShowTab }: ClientKpisProps) {
  const attendance = attendanceRate(stats);

  return (
    <section aria-label="Indicadores del cliente" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      <Kpi icon={CalendarDays} value={String(stats.total)} label="Reservas totales" hint="Ver historial" tone="dark" onClick={() => onShowHistory("ALL")} />
      <Kpi icon={CalendarCheck2} value={String(stats.completed)} label="Completadas" hint={attendance !== null ? `${attendance}% asistencia` : undefined} onClick={() => onShowHistory("COMPLETADA")} />
      <Kpi icon={CircleSlash} value={String(stats.cancelled)} label="Canceladas" onClick={() => onShowHistory("CANCELADA")} />
      <Kpi icon={UserX} value={String(stats.noShow)} label="No asistió" onClick={() => onShowHistory("NO_SHOW")} />
      <Kpi icon={CalendarClock} value={String(stats.upcoming)} label="Próximas" onClick={() => onShowTab("upcoming")} />
      <Kpi icon={Wallet} value={formatCopFromThousands(creditThousands)} label="Crédito a favor" tone="gold" onClick={() => onShowTab("payments")} />
    </section>
  );
}
