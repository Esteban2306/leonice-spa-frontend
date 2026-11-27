import { describe, expect, it } from "vitest";

import {
  EMPTY_DRAFT,
  availabilityWindow,
  formatDayChoice,
  missingFor,
  resolveStep,
  splitSlots,
  windowPageOf,
  wizardReducer,
  type WizardAction,
  type WizardDraft,
} from "./booking-wizard";

const run = (...actions: WizardAction[]): WizardDraft =>
  actions.reduce(wizardReducer, EMPTY_DRAFT);

const ana = { id: "1", name: "Ana", phone: "3000000000" };

const service = (categoryId: string, treatmentId: string, keepOthers = false) =>
  ({
    type: "selectService",
    categoryId,
    treatmentId,
    keepOthers,
  }) as const;

const complete = run(
  { type: "pickClient", client: ana },
  service("capilar", "a"),
  { type: "selectDay", dayKey: "2026-11-28" },
  { type: "selectSlot", iso: "2026-11-28T15:00:00.000Z" },
);

describe("pasos del agendado", () => {
  it("no deja saltar a un paso sin completar los anteriores", () => {
    expect(resolveStep("revisar", EMPTY_DRAFT)).toBe("cliente");
    expect(resolveStep("hora", run({ type: "pickClient", client: ana }))).toBe(
      "servicio",
    );
    expect(resolveStep("revisar", complete)).toBe("revisar");
    expect(resolveStep("cliente", complete)).toBe("cliente");
  });

  it("al cambiar de servicio se borran día y hora, pero no la persona", () => {
    const changed = wizardReducer(complete, service("capilar", "b"));
    expect(changed.dayKey).toBeNull();
    expect(changed.slotIso).toBeNull();
    expect(changed.picked).toEqual(ana);
  });

  it("al quitar un servicio se borra su precio acordado", () => {
    const priced = wizardReducer(complete, {
      type: "setPrice",
      treatmentId: "a",
      value: "150.000",
    });
    expect(wizardReducer(priced, service("capilar", "b")).prices).toEqual({});
    expect(
      wizardReducer(priced, service("coreano", "c", true)).prices,
    ).toEqual({ a: "150.000" });
  });

  it("volver a tocar el mismo servicio o día conserva lo elegido", () => {
    expect(wizardReducer(complete, service("capilar", "a"))).toEqual(complete);
    expect(
      wizardReducer(complete, { type: "selectDay", dayKey: "2026-11-28" }),
    ).toEqual(complete);
  });

  it("al cambiar de día se borra la hora", () => {
    const changed = wizardReducer(complete, {
      type: "selectDay",
      dayKey: "2026-11-30",
    });
    expect(changed.slotIso).toBeNull();
  });

  it("un combo guarda un servicio por categoría", () => {
    const combo = run(
      service("capilar", "a"),
      service("coreano", "b", true),
      service("coreano", "c", true),
    );
    expect(combo.selection).toEqual({ capilar: "a", coreano: "c" });
    expect(
      wizardReducer(combo, { type: "removeService", categoryId: "capilar" })
        .selection,
    ).toEqual({ coreano: "c" });
  });
});

describe("qué falta en cada paso", () => {
  it("pide la fecha de nacimiento a quien se registró sin ella", () => {
    const draft = run({
      type: "pickClient",
      client: { ...ana, missingBirthDate: true },
    });
    expect(missingFor("cliente", draft)).toBe("Falta la fecha de nacimiento.");
    expect(
      missingFor(
        "cliente",
        wizardReducer(draft, {
          type: "setField",
          field: "birthDate",
          value: "1990-01-01",
        }),
      ),
    ).toBeNull();
  });

  it("para alguien nuevo pide celular, nombre y nacimiento, en ese orden", () => {
    const start = run({ type: "startNewClient", search: "Laura" });
    expect(start.name).toBe("Laura");
    expect(missingFor("cliente", start)).toContain("celular");

    const withPhone = wizardReducer(start, {
      type: "setField",
      field: "phone",
      value: "300 000 0000",
    });
    expect(missingFor("cliente", withPhone)).toContain("nacimiento");
  });

  it("lo buscado con números pasa al celular", () => {
    const draft = run({ type: "startNewClient", search: "300 111" });
    expect(draft.phone).toBe("300 111");
    expect(draft.name).toBe("");
  });

  it.each(["0", "999", "99.999.999"])(
    "avisa de un precio acordado fuera de rango: %s",
    (value) => {
      const draft = wizardReducer(complete, {
        type: "setPrice",
        treatmentId: "a",
        value,
      });
      expect(missingFor("revisar", draft)).not.toBeNull();
    },
  );
});

describe("días y horas", () => {
  const today = new Date(2026, 10, 27);

  it("la ventana de disponibilidad empieza hoy y avanza sin solaparse", () => {
    expect(availabilityWindow(today, 0)).toEqual({
      from: "2026-11-27",
      to: "2027-01-07",
    });
    expect(availabilityWindow(today, 1).from).toBe("2027-01-08");
    expect(windowPageOf(today, "2027-01-07")).toBe(0);
    expect(windowPageOf(today, "2027-01-08")).toBe(1);
  });

  it("nombra hoy y mañana", () => {
    expect(formatDayChoice("2026-11-27", today)).toMatch(/^Hoy · Viernes/);
    expect(formatDayChoice("2026-11-28", today)).toMatch(/^Mañana · Sábado/);
    expect(formatDayChoice("2026-11-30", today)).toMatch(/^Lunes/);
  });

  it("separa mañana y tarde con la hora de Bogotá", () => {
    const { morning, afternoon } = splitSlots([
      { iso: "2026-11-27T16:59:00.000Z", localTime: "11:59" },
      { iso: "2026-11-27T17:00:00.000Z", localTime: "12:00" },
    ]);
    expect(morning.map((slot) => slot.localTime)).toEqual(["11:59"]);
    expect(afternoon.map((slot) => slot.localTime)).toEqual(["12:00"]);
  });
});
