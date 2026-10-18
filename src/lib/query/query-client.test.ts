import { describe, expect, it, vi } from "vitest";

import { HttpError } from "../api/http-error";
import { createQueryClient } from "./query-client";

async function failMutation(error: unknown) {
  const client = createQueryClient();
  const invalidate = vi.spyOn(client, "invalidateQueries");
  await client
    .getMutationCache()
    .build(client, { mutationFn: () => Promise.reject(error) })
    .execute(undefined)
    .catch(() => undefined);
  return invalidate;
}

describe("createQueryClient", () => {
  it("refresca los datos cuando otra persona ya cambió el registro (409)", async () => {
    const invalidate = await failMutation(
      new HttpError(409, "Este depósito ya fue revisado", { code: "DEPOSIT_NOT_PENDING" }),
    );
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it("refresca los datos cuando el registro ya no existe (404)", async () => {
    const invalidate = await failMutation(new HttpError(404, "No existe"));
    expect(invalidate).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["validación", new HttpError(400, "Datos inválidos")],
    ["servidor", new HttpError(500, "Error")],
    ["red", new TypeError("Failed to fetch")],
  ])("no refresca ante errores de %s", async (_label, error) => {
    const invalidate = await failMutation(error);
    expect(invalidate).not.toHaveBeenCalled();
  });
});
