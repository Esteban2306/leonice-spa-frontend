import type {
  BotTool,
  ConnectionStatus,
  ConversationSummary,
  MessageAuthor,
} from "@/src/features/admin/types/conduit.types";

const LID_SUFFIX = "@lid";

export function isHiddenNumber(raw: string | null | undefined): boolean {
  return Boolean(raw && raw.includes(LID_SUFFIX));
}

export function formatWhatsappPhone(raw: string | null | undefined): string {
  if (!raw) return "Sin número";
  if (isHiddenNumber(raw)) return "Número oculto por WhatsApp";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("57") && digits.length === 12) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return `+${digits}`;
}

export function maskWhatsappPhone(raw: string | null | undefined): string {
  if (!raw) return "Sin número";
  if (isHiddenNumber(raw)) return "Número oculto por WhatsApp";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("57") && digits.length === 12) {
    return `+57 ${digits.slice(2, 5)} *** ${digits.slice(8)}`;
  }
  return digits.length > 4
    ? `+${"*".repeat(digits.length - 4)}${digits.slice(-4)}`
    : `+${digits}`;
}

export type StatusTone = "green" | "amber" | "gray" | "red";

export interface ConnectionCopy {
  tone: StatusTone;
  label: string;
  description: string;
  action: "none" | "connect" | "qr" | "relink" | "support";
}

export function connectionCopy(
  status: ConnectionStatus | null | undefined,
  reachable: boolean,
  phoneNumber?: string | null,
): ConnectionCopy {
  if (!reachable) {
    return {
      tone: "red",
      label: "Sin servicio",
      description: "No hay comunicación con el servicio de WhatsApp.",
      action: "none",
    };
  }
  switch (status) {
    case "CONNECTED":
      return {
        tone: "green",
        label: "Conectado",
        description: phoneNumber
          ? `Conectado como ${formatWhatsappPhone(phoneNumber)}.`
          : "WhatsApp está conectado.",
        action: "none",
      };
    case "CONNECTING":
      return {
        tone: "amber",
        label: "Conectando…",
        description:
          "Esperando que se escanee el código QR desde el teléfono del spa.",
        action: "qr",
      };
    case "DISCONNECTED":
      return {
        tone: "gray",
        label: "Desconectado",
        description: "El asistente no responde y los recordatorios no salen.",
        action: "connect",
      };
    case "ERROR":
      return {
        tone: "red",
        label: "Requiere atención",
        description:
          "La sesión se cerró desde el teléfono o se abrió en otro lugar. Vuelve a vincular el número con el código QR.",
        action: "relink",
      };
    case "BANNED":
      return {
        tone: "red",
        label: "Número bloqueado",
        description: "WhatsApp bloqueó el número. Contacta al soporte técnico.",
        action: "support",
      };
    default:
      return {
        tone: "gray",
        label: "Sin datos",
        description: "No se pudo leer el estado de la conexión.",
        action: "none",
      };
  }
}

export function riskCopy(level: number): {
  label: string;
  tone: StatusTone;
  description: string;
} {
  if (level >= 4) {
    return {
      label: "Modo seguro",
      tone: "red",
      description:
        "Los envíos automáticos se pausan solos hasta que baje el riesgo.",
    };
  }
  if (level >= 3) {
    return {
      label: "Precaución",
      tone: "amber",
      description:
        "Los envíos automáticos van más despacio para proteger el número.",
    };
  }
  return {
    label: "Normal",
    tone: "green",
    description: "El número está enviando con normalidad.",
  };
}

export const AUTHOR_LABELS: Record<MessageAuthor, string> = {
  user: "Clienta",
  bot: "Asistente",
  human: "Equipo",
  system: "Mensaje automático",
};

export function isHandoff(reason: string | null | undefined): boolean {
  return Boolean(reason && /pasar_a_persona|traspaso|persona/i.test(reason));
}

export function isClosed(conversation: ConversationSummary): boolean {
  return (
    conversation.status === "COMPLETED" || conversation.status === "ABANDONED"
  );
}

export function needsAttention(conversation: ConversationSummary): boolean {
  return (
    !isClosed(conversation) &&
    (conversation.awaitingReply || conversation.botPaused)
  );
}

export function sortForInbox(
  conversations: readonly ConversationSummary[],
): ConversationSummary[] {
  const weight = (c: ConversationSummary) =>
    c.botPaused && isHandoff(c.botPauseReason)
      ? 0
      : c.awaitingReply
        ? 1
        : c.botPaused
          ? 2
          : 3;
  return [...conversations].sort(
    (a, b) =>
      weight(a) - weight(b) ||
      new Date(b.lastMessageAt ?? b.createdAt).getTime() -
        new Date(a.lastMessageAt ?? a.createdAt).getTime(),
  );
}

const RELATIVE = new Intl.RelativeTimeFormat("es-CO", { numeric: "auto" });

export function relativeTime(
  iso: string | null | undefined,
  nowMs: number,
): string {
  if (!iso) return "";
  const diffMinutes = Math.round((new Date(iso).getTime() - nowMs) / 60000);
  if (Math.abs(diffMinutes) < 1) return "ahora";
  if (Math.abs(diffMinutes) < 60) return RELATIVE.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return RELATIVE.format(diffHours, "hour");
  return RELATIVE.format(Math.round(diffHours / 24), "day");
}

const DATE_TIME = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

const TIME = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  hour: "numeric",
  minute: "2-digit",
});

export function formatDateTime(iso: string | null | undefined): string {
  return iso
    ? DATE_TIME.format(new Date(iso))
        .replace(/\./g, "")
        .replace(" a m", " a. m.")
        .replace(" p m", " p. m.")
    : "—";
}

const DAY = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  weekday: "short",
  day: "numeric",
  month: "short",
});

export function formatDay(iso: string): string {
  return DAY.format(new Date(iso)).replace(/\./g, "").replace(",", "");
}

export function formatTime(iso: string): string {
  return TIME.format(new Date(iso));
}

const DEAD_LETTER_COPY: Record<string, string> = {
  RECIPIENT_NOT_OPTED_IN:
    "La clienta no le ha escrito al spa (política anti-bloqueo).",
  NO_WHATSAPP_ACCOUNT: "El número no tiene WhatsApp.",
  INVALID_RECIPIENT: "Número inválido.",
  WHATSAPP_NOT_CONNECTED:
    "WhatsApp estuvo desconectado; se agotaron los reintentos.",
  MAX_ATTEMPTS_EXCEEDED:
    "WhatsApp estuvo desconectado; se agotaron los reintentos.",
  UNKNOWN_OUTCOME:
    "No se pudo confirmar si salió; revisa antes de reintentar para no duplicar.",
};

export function deadLetterReason(
  code: string | null | undefined,
  reason: string | null | undefined,
): string {
  return (code && DEAD_LETTER_COPY[code]) ?? reason ?? "Motivo desconocido.";
}

export const DEAD_LETTER_TIPS: Record<string, string> = {
  RECIPIENT_NOT_OPTED_IN:
    "Pídele que le escriba una vez al WhatsApp del spa y vuelve a intentarlo.",
  NO_WHATSAPP_ACCOUNT: "Confirma el número en la ficha de la clienta.",
  INVALID_RECIPIENT: "Corrige el número en la ficha de la clienta.",
};

export const REQUIRED_TEMPLATE_VARIABLES: Record<
  string,
  { audience: "Clienta" | "Equipo"; variables: string[] }
> = {
  RESERVATION_REMINDER: { audience: "Clienta", variables: ["nombre", "fecha"] },
  REACTIVATION: { audience: "Clienta", variables: ["nombre", "dias"] },
  REACTIVATION_PROMO: {
    audience: "Clienta",
    variables: ["nombre", "dias", "promocion", "descuento"],
  },
  CLIENT_DEPOSIT_REJECTED: {
    audience: "Clienta",
    variables: ["nombre", "plazo"],
  },
  CLIENT_DEPOSIT_REJECTED_NO_DEADLINE: {
    audience: "Clienta",
    variables: ["nombre"],
  },
  CLIENT_RESCHEDULED: {
    audience: "Clienta",
    variables: ["nombre", "tratamiento", "fecha"],
  },
  CLIENT_CANCELLATION_CONFIRMED: {
    audience: "Clienta",
    variables: ["nombre", "tratamientos", "fecha"],
  },
  CLIENT_CANCELLATION_LINK: {
    audience: "Clienta",
    variables: ["nombre", "tratamiento", "fecha", "enlace"],
  },
  ADMIN_DEPOSIT_TIMEOUT: {
    audience: "Equipo",
    variables: ["cliente", "telefono", "tratamientos", "fecha"],
  },
  ADMIN_RESCHEDULED: {
    audience: "Equipo",
    variables: [
      "cliente",
      "telefono",
      "tratamiento",
      "fecha_anterior",
      "fecha_nueva",
      "origen",
    ],
  },
  ADMIN_CLIENT_CANCELLED: {
    audience: "Equipo",
    variables: ["cliente", "telefono", "tratamientos", "fecha", "canal"],
  },
  ADMIN_HANDOFF: {
    audience: "Equipo",
    variables: ["cliente", "telefono", "motivo", "resumen"],
  },
};

export function templateVariables(body: string): string[] {
  return [
    ...new Set([...body.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((m) => m[1])),
  ];
}

export function missingVariables(
  body: string,
  required: readonly string[],
): string[] {
  const present = new Set(templateVariables(body));
  return required.filter((variable) => !present.has(variable));
}

export interface RecommendedTool {
  name: string;
  path: string;
  injectsPhone: boolean;
  pausesBot?: boolean;
}

export const RECOMMENDED_TOOLS: readonly RecommendedTool[] = [
  { name: "info_negocio", path: "/conduit/business-info", injectsPhone: false },
  {
    name: "listar_tratamientos",
    path: "/conduit/booking/treatments",
    injectsPhone: false,
  },
  {
    name: "consultar_disponibilidad",
    path: "/conduit/booking/availability",
    injectsPhone: false,
  },
  {
    name: "disponibilidad_combo",
    path: "/conduit/booking/availability/calendar",
    injectsPhone: false,
  },
  { name: "registrar_cliente", path: "/conduit/clients", injectsPhone: true },
  {
    name: "actualizar_perfil_cliente",
    path: "/conduit/clients",
    injectsPhone: true,
  },
  {
    name: "crear_reserva_whatsapp",
    path: "/conduit/booking/reservations",
    injectsPhone: true,
  },
  {
    name: "reservas_proximas",
    path: "/conduit/booking/reservations/upcoming",
    injectsPhone: true,
  },
  {
    name: "reagendar_reserva_whatsapp",
    path: "/conduit/booking/reservations/reschedule",
    injectsPhone: true,
  },
  {
    name: "cancelar_reserva_whatsapp",
    path: "/conduit/booking/reservations/cancel",
    injectsPhone: true,
  },
  {
    name: "depositos_pendientes",
    path: "/deposits/pending",
    injectsPhone: true,
  },
  {
    name: "registrar_comprobante_automatico",
    path: "/deposits/automatic",
    injectsPhone: true,
  },
  {
    name: "pasar_a_persona",
    path: "/conduit/handoff",
    injectsPhone: true,
    pausesBot: true,
  },
];

export function reviewTools(tools: readonly BotTool[]) {
  const byName = new Map(tools.map((tool) => [tool.name, tool]));
  return RECOMMENDED_TOOLS.map((recommended) => {
    const tool = byName.get(recommended.name);
    const issues: string[] = [];
    if (!tool) issues.push("No está configurada");
    else {
      if (!tool.isActive) issues.push("Está apagada");
      if (!tool.endpointUrl.includes(recommended.path))
        issues.push(`Debería llamar a ${recommended.path}`);
      if (recommended.injectsPhone && !tool.injectPhoneParamName)
        issues.push("Debería usar el número verificado del chat");
      if (recommended.pausesBot && !tool.pausesBotMinutes)
        issues.push("Debería pausar el asistente");
    }
    return { recommended, tool: tool ?? null, issues };
  });
}

export const PAUSE_OPTIONS: ReadonlyArray<{ label: string; minutes: number }> =
  [
    { label: "30 minutos", minutes: 30 },
    { label: "1 hora", minutes: 60 },
    { label: "4 horas", minutes: 240 },
    { label: "Hasta mañana", minutes: 0 },
    { label: "7 días", minutes: 10080 },
  ];

const MINUTES_PER_DAY = 24 * 60;
const MORNING_MINUTE = 8 * 60;

export function minutesUntilTomorrowMorning(nowMs: number): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(nowMs));
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const minutesNow = hour * 60 + minute;
  const untilMorning =
    (MINUTES_PER_DAY - minutesNow + MORNING_MINUTE) % MINUTES_PER_DAY;
  return untilMorning === 0 ? MINUTES_PER_DAY : untilMorning;
}
