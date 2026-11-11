import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

import { toConduitAiModel, toConduitAiModels } from "./conduit-ai-model.mapper";

const ANTHROPIC_KEY =
  "sk-ant-api03-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdef-xyz9";

const ROW = {
  id: "8e617ca9-5fd6-41ee-8cc5-6412cbe86235",
  provider: "ANTHROPIC",
  model: "claude-haiku-5-5",
  role: "CONVERSATION",
  tier: "FREE",
  priority: 1,
  dailyTokenLimit: 400000,
  minuteRequestLimit: 20,
  tokensUsedToday: 12,
  requestsThisMinute: 0,
  isActive: true,
  createdAt: "2026-10-01T00:00:00.000Z",
  apiKeyLast4: "xyz9",
};

describe("toConduitAiModel", () => {
  it("descarta apiKey y cualquier campo que no sea público, aunque el servidor lo envíe", () => {
    const model = toConduitAiModel({
      ...ROW,
      apiKey: ANTHROPIC_KEY,
      authSecret: "x",
      botConfigId: "b",
    });
    expect(model).toEqual(ROW);
    expect(Object.keys(model ?? {})).not.toContain("apiKey");
    expect(JSON.stringify(model)).not.toContain(ANTHROPIC_KEY);
  });

  it("acepta lista directa o paginada y descarta entradas inválidas", () => {
    expect(
      toConduitAiModels([{ ...ROW, apiKey: ANTHROPIC_KEY }, null, "x", {}]),
    ).toEqual([ROW]);
    expect(
      toConduitAiModels({ data: [{ ...ROW, apiKey: ANTHROPIC_KEY }] }),
    ).toEqual([ROW]);
    expect(toConduitAiModels(undefined)).toEqual([]);
    expect(
      JSON.stringify(toConduitAiModels([{ ...ROW, apiKey: ANTHROPIC_KEY }])),
    ).not.toContain(ANTHROPIC_KEY);
  });

  it("normaliza valores desconocidos sin lanzar", () => {
    expect(
      toConduitAiModel({ id: "m1", role: "OTRO", tier: "OTRO", priority: "x" }),
    ).toMatchObject({ role: "CONVERSATION", tier: "FREE", priority: 0 });
  });
});

describe("el frontend nunca maneja una apiKey recibida", () => {
  const root = join(process.cwd(), "src");

  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) return walk(full);
      return /\.(ts|tsx)$/.test(name) && !/\.test\.ts$/.test(name)
        ? [full]
        : [];
    });
  }

  const files = walk(root).map((file) => ({
    path: relative(root, file),
    text: readFileSync(file, "utf8"),
  }));

  it("ConduitAiModel no declara apiKey y sí apiKeyLast4", () => {
    const types = files.find((f) =>
      f.path.endsWith("types/conduit.types.ts"),
    )!.text;
    const block = /export interface ConduitAiModel \{[\s\S]*?\n\}/.exec(
      types,
    )![0];
    expect(block).not.toMatch(/\bapiKey\??:/);
    expect(block).toMatch(/apiKeyLast4:/);
  });

  it("apiKey solo aparece en los formularios que la escriben y en lo que la envía", () => {
    const allowed = new Set([
      "features/admin/whatsapp/assistant/models-tab.tsx",
      "features/admin/types/conduit.types.ts",
      "features/admin/whatsapp/assistant/verification-tab.tsx",
      "features/admin/api/verification.api.ts",
      "features/admin/hooks/use-verification-actions.ts",
    ]);
    const users = files
      .filter((f) => /\bapiKey\b/.test(f.text.replace(/apiKeyLast4/g, "")))
      .map((f) => f.path.replaceAll("\\", "/"));
    expect(users.filter((p) => !allowed.has(p))).toEqual([]);
  });

  it("la clave escrita en el formulario no se guarda fuera del estado del diálogo ni en el almacenamiento del navegador", () => {
    const tab = files.find((f) =>
      f.path.endsWith("assistant/models-tab.tsx"),
    )!.text;
    expect(tab).not.toMatch(/localStorage|sessionStorage|console\./);
    expect(tab).toMatch(/type="password"/);
    expect(tab).toMatch(/autoComplete="off"/);
    expect(tab).toMatch(/if \(!open\) setDraft\(EMPTY\)/);
    expect(tab).not.toMatch(/model\.apiKey\b/);
  });

  it("la clave nueva de la pestaña de comprobantes tampoco se guarda ni se muestra", () => {
    const tab = files.find((f) =>
      f.path.endsWith("assistant/verification-tab.tsx"),
    )!.text;
    expect(tab).not.toMatch(/localStorage|sessionStorage|console\./);
    expect(tab).toMatch(/type="password"/);
    expect(tab).toMatch(/autoComplete="off"/);
    expect(tab).toMatch(/setApiKey\(""\)/);
    expect(tab).not.toMatch(/model\.apiKey\b/);
    expect(tab).not.toMatch(/value=\{(?!apiKey\})[^}]*apiKey/);
  });

  it("los modelos que llegan del servicio de comprobantes no traen ni piden una clave", () => {
    const types = files.find((f) =>
      f.path.endsWith("types/verification.types.ts"),
    )!.text;
    expect(types).not.toMatch(/\bapiKey\b/);
  });
});
