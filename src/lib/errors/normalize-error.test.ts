import { describe, expect, it } from "vitest";

import { HttpError } from "../api/http-error";
import { normalizeError } from "./normalize-error";

describe("normalizeError", () => {
  it("usa el mensaje amigable del código cuando existe", () => {
    const error = new HttpError(409, "texto técnico", {
      code: "RESERVATION_CHECK_IN_NOT_TODAY",
    });
    expect(normalizeError(error).message).toBe(
      "El check-in solo se puede hacer el día de la cita.",
    );
  });

  it("sin traducción usa el mensaje del servidor", () => {
    const error = new HttpError(409, "Hay 2 reserva(s) dentro del horario.", {
      code: "SCHEDULE_CHANGE_HAS_RESERVATIONS",
    });
    expect(normalizeError(error).message).toBe("Hay 2 reserva(s) dentro del horario.");
  });

  it("un mensaje genérico de HTTP cae al texto por estado", () => {
    expect(normalizeError(new HttpError(500, "HTTP Error 500")).message).toBe(
      "Ocurrió un error inesperado en el servidor.",
    );
  });

  it("un fallo de red se explica como conexión", () => {
    expect(normalizeError(new TypeError("Failed to fetch")).message).toMatch(
      /conexión/,
    );
  });
});
