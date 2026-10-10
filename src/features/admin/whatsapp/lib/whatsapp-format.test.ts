import { describe, expect, it } from "vitest";

import type {
  BotTool,
  ConversationSummary,
} from "@/src/features/admin/types/conduit.types";

import {
  connectionCopy,
  deadLetterReason,
  formatWhatsappPhone,
  isHandoff,
  maskWhatsappPhone,
  minutesUntilTomorrowMorning,
  missingVariables,
  reviewTools,
  riskCopy,
  sortForInbox,
  templateVariables,
} from "./whatsapp-format";

describe("teléfonos", () => {
  it("formatea, enmascara y reconoce números ocultos", () => {
    expect(formatWhatsappPhone("573001234567")).toBe("+57 300 123 4567");
    expect(maskWhatsappPhone("573001234567")).toBe("+57 300 *** 4567");
    expect(formatWhatsappPhone("123456789012345@lid")).toBe(
      "Número oculto por WhatsApp",
    );
  });
});

describe("estado de conexión y riesgo", () => {
  it("traduce cada estado a texto humano y acción", () => {
    expect(
      connectionCopy("CONNECTED", true, "573001234567").description,
    ).toContain("+57 300 123 4567");
    expect(connectionCopy("ERROR", true).action).toBe("relink");
    expect(connectionCopy("BANNED", true).action).toBe("support");
    expect(connectionCopy("CONNECTED", false).label).toBe("Sin servicio");
  });

  it("clasifica el riesgo anti-bloqueo", () => {
    expect(riskCopy(1).label).toBe("Normal");
    expect(riskCopy(3).label).toBe("Precaución");
    expect(riskCopy(5).label).toBe("Modo seguro");
  });
});

describe("bandeja", () => {
  const conversation = (
    id: string,
    patch: Partial<ConversationSummary>,
  ): ConversationSummary => ({
    id,
    phoneNumber: "573001234567",
    status: "ACTIVE",
    summary: null,
    lastMessageAt: "2026-10-10T10:00:00Z",
    createdAt: "2026-10-10T09:00:00Z",
    botPaused: false,
    botPausedUntil: null,
    botPauseReason: null,
    awaitingReply: false,
    lastMessage: null,
    ...patch,
  });

  it("pone primero a quien pidió una persona y luego a quien espera", () => {
    const sorted = sortForInbox([
      conversation("quiet", {}),
      conversation("waiting", { awaitingReply: true }),
      conversation("handoff", {
        botPaused: true,
        botPauseReason: "Traspaso a una persona (pasar_a_persona)",
      }),
    ]);
    expect(sorted.map((c) => c.id)).toEqual(["handoff", "waiting", "quiet"]);
    expect(isHandoff("Atiende recepción")).toBe(false);
  });

  it("calcula la pausa hasta mañana a las 8:00 a. m. de Bogotá", () => {
    expect(
      minutesUntilTomorrowMorning(
        new Date("2026-10-10T20:00:00-05:00").getTime(),
      ),
    ).toBe(720);
    expect(
      minutesUntilTomorrowMorning(
        new Date("2026-10-10T06:00:00-05:00").getTime(),
      ),
    ).toBe(120);
  });
});

describe("envíos y plantillas", () => {
  it("traduce los códigos de error de envío", () => {
    expect(deadLetterReason("RECIPIENT_NOT_OPTED_IN", "x")).toMatch(
      /no le ha escrito/,
    );
    expect(deadLetterReason("OTRO", "Motivo del servidor")).toBe(
      "Motivo del servidor",
    );
  });

  it("detecta variables faltantes", () => {
    expect(
      templateVariables("Hola {{nombre}}, tu cita es {{ fecha }}"),
    ).toEqual(["nombre", "fecha"]);
    expect(missingVariables("Hola {{nombre}}", ["nombre", "fecha"])).toEqual([
      "fecha",
    ]);
  });

  it("revisa las herramientas contra la configuración recomendada", () => {
    const tools: BotTool[] = [
      {
        id: "t1",
        name: "pasar_a_persona",
        description: "",
        endpointUrl: "http://api/api/v1/conduit/handoff",
        httpMethod: "POST",
        isActive: true,
        requiresImageAttachment: false,
        injectPhoneParamName: "phone",
        pausesBotMinutes: null,
      },
    ];
    const review = reviewTools(tools);
    expect(
      review.find((r) => r.recommended.name === "pasar_a_persona")?.issues,
    ).toEqual(["Debería pausar el asistente"]);
    expect(
      review.find((r) => r.recommended.name === "info_negocio")?.issues,
    ).toEqual(["No está configurada"]);
  });
});
