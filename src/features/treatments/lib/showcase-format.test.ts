import { describe, expect, it } from "vitest";

import {
  bookingMessage,
  durationLabel,
  priceDisplay,
  priceFromLabel,
  treatmentBookingMessage,
} from "@/src/features/treatments/lib/showcase-format";

const normalize = (value: string | null) => value?.replace(/\s/g, " ") ?? null;

describe("priceDisplay", () => {
  it("muestra un precio único cuando el rango no varía", () => {
    expect(normalize(priceDisplay({ fromThousands: 200, toThousands: 200, promotion: null }).label)).toBe(
      "$ 200.000",
    );
  });

  it("muestra el rango y la promoción con el precio original", () => {
    const display = priceDisplay({
      fromThousands: 250,
      toThousands: 380,
      promotion: { name: "Octubre", discountPercentage: 10, fromThousands: 225, toThousands: 342 },
    });
    expect(normalize(display.label)).toBe("$ 225.000 – $ 342.000");
    expect(normalize(display.original)).toBe("$ 250.000 – $ 380.000");
    expect(display.discountPercentage).toBe(10);
  });

  it("no inventa precio cuando el servicio no tiene", () => {
    expect(priceDisplay({ fromThousands: null, toThousands: null, promotion: null }).label).toBeNull();
    expect(priceFromLabel(null)).toBeNull();
  });
});

describe("durationLabel", () => {
  it("formatea un rango de duración", () => {
    expect(durationLabel(180, 240)).toBe("3 h – 4 h");
    expect(durationLabel(120, 120)).toBe("2 h");
    expect(durationLabel(null, 90)).toBe("1 h 30 min");
    expect(durationLabel(null, null)).toBeNull();
  });
});

describe("bookingMessage", () => {
  it("nombra la categoría cuando la conoce", () => {
    expect(bookingMessage("Uñas")).toBe("Hola, quiero agendar un servicio de Uñas en Leonice.");
    expect(bookingMessage()).toBe("Hola, quiero agendar una cita en Leonice.");
  });
});

describe("treatmentBookingMessage", () => {
  it("deja el tratamiento y la categoría en líneas propias para el bot y el equipo", () => {
    expect(
      treatmentBookingMessage({ name: "Alisado", categoryName: "Spa capilar", requiresPriorAssessment: false }),
    ).toBe(
      [
        "Hola, quiero agendar una cita en Leonice.",
        "Tratamiento: Alisado",
        "Categoría: Spa capilar",
        "¿Qué horarios tienen disponibles?",
      ].join("\n"),
    );
  });

  it("pide la valoración cuando el tratamiento la exige", () => {
    expect(
      treatmentBookingMessage({ name: "Keratina", categoryName: "Spa capilar", requiresPriorAssessment: true }),
    ).toBe(
      [
        "Hola, quiero agendar una valoración en Leonice.",
        "Tratamiento: Keratina",
        "Categoría: Spa capilar",
        "Este tratamiento requiere valoración previa.",
        "¿Qué horarios tienen disponibles?",
      ].join("\n"),
    );
  });
});
