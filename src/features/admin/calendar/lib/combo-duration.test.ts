import { describe, expect, it } from "vitest";
import { totalDuration } from "./booking";

const service = (durationMinutes: number) => ({
  treatmentId: String(durationMinutes),
  name: "s",
  categoryName: "c",
  durationMinutes,
});

describe("duración de un combo", () => {
  it("los servicios se hacen al mismo tiempo: dura lo que el más largo", () => {
    expect(totalDuration([service(240), service(60)])).toBe(240);
  });

  it("un solo servicio dura lo suyo", () => {
    expect(totalDuration([service(90)])).toBe(90);
  });
});
