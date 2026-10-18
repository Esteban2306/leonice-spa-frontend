import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { storiesContent } from "@/src/features/landing/content/landing-content";

import { getLandingStories } from "./landing-testimonials";

const IMG =
  "https://res.cloudinary.com/exyhq5ry/image/upload/v1/leonice-spa/testimonials/a.jpg";

const real = (overrides: Record<string, unknown> = {}) => ({
  id: "t1",
  authorName: "L.P.",
  quote: "Mi cabello cambió por completo después de la terapia.",
  treatmentName: "Terapia de hidratación",
  beforeImageUrl: IMG,
  afterImageUrl: IMG,
  ...overrides,
});

const respond = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) });

describe("getLandingStories", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://api.test/api/v1");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("muestra los testimonios reales y descarta los de ejemplo", async () => {
    vi.stubGlobal(
      "fetch",
      respond([real(), real({ id: "t2", authorName: "C.G." })]),
    );

    const stories = await getLandingStories();

    expect(stories.map((story) => story.id)).toEqual(["t1", "t2"]);
    expect(stories.every((story) => !story.sample)).toBe(true);
    expect(stories).not.toEqual(expect.arrayContaining(storiesContent.items));
    expect(stories[0]).toMatchObject({
      author: "L.P.",
      treatment: "Terapia de hidratación",
      before: IMG,
      after: IMG,
    });
  });

  it("usa los de ejemplo mientras no haya testimonios publicados", async () => {
    vi.stubGlobal("fetch", respond([]));
    expect(await getLandingStories()).toBe(storiesContent.items);
  });

  it("usa los de ejemplo si el backend falla o responde algo inesperado", async () => {
    vi.stubGlobal("fetch", respond({}, false));
    expect(await getLandingStories()).toBe(storiesContent.items);

    vi.stubGlobal("fetch", respond({ data: [] }));
    expect(await getLandingStories()).toBe(storiesContent.items);

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("caído")));
    expect(await getLandingStories()).toBe(storiesContent.items);
  });

  it("ignora entradas mal formadas y fotos fuera del dominio permitido", async () => {
    vi.stubGlobal(
      "fetch",
      respond([
        { id: 5 },
        real({
          beforeImageUrl: "https://evil.example/x.jpg",
          afterImageUrl: null,
        }),
      ]),
    );

    const stories = await getLandingStories();

    expect(stories).toHaveLength(1);
    expect(stories[0].before).toBeNull();
    expect(stories[0].after).toBeNull();
  });

  it("si todas las entradas son inválidas vuelve a los de ejemplo", async () => {
    vi.stubGlobal("fetch", respond([{ id: 5 }]));
    expect(await getLandingStories()).toBe(storiesContent.items);
  });
});
