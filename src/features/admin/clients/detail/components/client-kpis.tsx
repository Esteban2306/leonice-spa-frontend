import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CircleSlash,
  UserX,
  Wallet,
} from "lucide-react";

import { KpiButton as Kpi } from "@/src/features/admin/components/kpi-button";
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
