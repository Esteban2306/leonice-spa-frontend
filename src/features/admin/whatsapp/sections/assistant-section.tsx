"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  useConduitBot,
  useConduitModels,
  useConduitPromptSettings,
  useConduitTools,
  useEscalationContacts,
} from "@/src/features/admin/hooks/use-conduit";
import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";

import { EscalationTab } from "../assistant/escalation-tab";
import { GeneralTab } from "../assistant/general-tab";
import { ModelsTab } from "../assistant/models-tab";
import { PersonalityTab } from "../assistant/personality-tab";
import { PromptsTab } from "../assistant/prompts-tab";
import { ToolsTab } from "../assistant/tools-tab";
import { ErrorPanel } from "../components/error-panel";
import { SkeletonRows } from "../components/section-card";

const TABS = [
  { id: "general", label: "General" },
  { id: "personalidad", label: "Personalidad" },
  { id: "instrucciones", label: "Instrucciones avanzadas" },
  { id: "modelos", label: "Modelos de IA" },
  { id: "herramientas", label: "Herramientas" },
  { id: "avisos", label: "A quién avisar" },
] as const;
type TabId = (typeof TABS)[number]["id"];

function Loaded<T>({
  query,
  children,
}: {
  query: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    data: T | undefined;
    refetch: () => unknown;
  };
  children: (data: T) => ReactNode;
}) {
  if (query.isLoading) return <SkeletonRows rows={3} height="h-24" />;
  if (query.isError || query.data === undefined)
    return (
      <ErrorPanel error={query.error} onRetry={() => void query.refetch()} />
    );
  return <>{children(query.data)}</>;
}

export function AssistantSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("tab");
  const tab: TabId = TABS.some((t) => t.id === raw)
    ? (raw as TabId)
    : "general";
  const actions = useConduitActions();

  const bot = useConduitBot();
  const settings = useConduitPromptSettings();
  const models = useConduitModels();
  const tools = useConduitTools();
  const contacts = useEscalationContacts();

  const select = (id: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "general") params.delete("tab");
    else params.set("tab", id);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Configuración del asistente"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {TABS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={tab === option.id}
            onClick={() => select(option.id)}
            className={cn(
              "h-10 shrink-0 cursor-pointer rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
              tab === option.id
                ? "border-secondary bg-secondary text-primary"
                : "border-secondary/15 bg-white text-secondary/75 hover:bg-quaternary/20",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <Loaded query={bot}>
          {(data) => (
            <GeneralTab
              key={data.updatedAt ?? data.status}
              bot={data}
              actions={actions}
            />
          )}
        </Loaded>
      )}
      {tab === "personalidad" && (
        <Loaded query={settings}>
          {(data) => (
            <PersonalityTab
              key={JSON.stringify(data.settings)}
              settings={data.settings}
              configured={data.configured}
              actions={actions}
            />
          )}
        </Loaded>
      )}
      {tab === "instrucciones" && <PromptsTab actions={actions} />}
      {tab === "modelos" && (
        <Loaded query={models}>
          {(data) => <ModelsTab models={data} actions={actions} />}
        </Loaded>
      )}
      {tab === "herramientas" && (
        <Loaded query={tools}>
          {(data) => <ToolsTab tools={data} actions={actions} />}
        </Loaded>
      )}
      {tab === "avisos" && (
        <Loaded query={contacts}>
          {(data) => <EscalationTab contacts={data} actions={actions} />}
        </Loaded>
      )}
    </div>
  );
}
