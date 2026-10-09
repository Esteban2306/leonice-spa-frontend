import { describe, expect, it, vi } from "vitest";

import { createSingleFlight } from "./use-single-flight";

describe("createSingleFlight", () => {
  it("reutiliza la misma petición mientras sigue en curso", async () => {
    const run = createSingleFlight();
    let resolve: (value: string) => void = () => undefined;
    const execute = vi.fn(
      () => new Promise<string>((done) => (resolve = done)),
    );

    const first = run("treatment:create", execute);
    const second = run("treatment:create", execute);
    resolve("ok");

    await expect(first).resolves.toBe("ok");
    await expect(second).resolves.toBe("ok");
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("permite repetir la acción cuando la anterior terminó", async () => {
    const run = createSingleFlight();
    const execute = vi.fn(async () => "ok");

    await run("pool:update:1", execute);
    await run("pool:update:1", execute);

    expect(execute).toHaveBeenCalledTimes(2);
  });

  it("no bloquea acciones distintas", async () => {
    const run = createSingleFlight();
    const execute = vi.fn(async () => "ok");

    await Promise.all([run("a", execute), run("b", execute)]);

    expect(execute).toHaveBeenCalledTimes(2);
  });

  it("libera la clave cuando la petición falla", async () => {
    const run = createSingleFlight();
    const failing = vi.fn(async () => {
      throw new Error("boom");
    });

    await expect(run("x", failing)).rejects.toThrow("boom");
    await expect(run("x", async () => "retry")).resolves.toBe("retry");
  });
});
