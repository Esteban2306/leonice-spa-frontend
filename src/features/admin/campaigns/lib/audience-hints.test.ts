import { describe, expect, it } from "vitest";

import type { ClientTagKey } from "@/src/features/admin/types/clients.types";

import { audienceHints } from "./audience-hints";

const counts = new Map<ClientTagKey, number>([
  ["APTA_PROMOCION", 0],
  ["CON_CITA_PROXIMA", 0],
  ["RESERVA_PENDIENTE", 1],
  ["SIN_VISITAS", 1],
]);

describe("audienceHints", () => {
  it("nombra las etiquetas que nadie tiene y explica que se cumplen todas a la vez", () => {
    const hints = audienceHints(
      {
        tags: [
          "APTA_PROMOCION",
          "CON_CITA_PROXIMA",
          "RESERVA_PENDIENTE",
          "SIN_VISITAS",
        ],
      },
      counts,
    );
    expect(hints).toHaveLength(1);
    expect(hints[0]).toContain('"Apta para promociones"');
    expect(hints[0]).toContain('"Cita próxima"');
    expect(hints[0]).toContain("quítalas");
    expect(hints[0]).not.toContain("Reserva pendiente");
  });

  it("avisa cuando una etiqueta se pide y se excluye a la vez", () => {
    const hints = audienceHints(
      { tags: ["RESERVA_PENDIENTE"], excludeTags: ["RESERVA_PENDIENTE"] },
      counts,
    );
    expect(hints).toEqual([
      '"Reserva pendiente" está a la vez en "Debe tener" y en "No debe tener", así que nadie puede cumplirlo.',
    ]);
  });

  it("no dice nada si las etiquetas elegidas tienen clientas", () => {
    expect(
      audienceHints({ tags: ["RESERVA_PENDIENTE", "SIN_VISITAS"] }, counts),
    ).toEqual([]);
  });
});
