import { useMemo, useState } from "react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

import { automationRulesApi } from "../api/automation-rules.api";
import { businessSettingsApi, conduitApi } from "../api/conduit.api";
import type { AdminActionKey } from "../feedback/action-messages";
import { runAdminAction } from "../feedback/run-admin-action";
import { adminQueryKeys } from "./query-keys";
import { useSingleFlight } from "./use-single-flight";

import type {
  CreateAutomationRuleRequest,
  UpdateAutomationRuleRequest,
} from "../types/automation.types";
import type {
  CampaignPolicy,
  ConversationSummary,
  CreateAiModelRequest,
  EscalationContact,
  Paginated,
  PromptSettings,
  PromptType,
  SaveTemplateRequest,
  UpdateBotRequest,
  UpdateBusinessSettingsRequest,
  WarmupLevel,
} from "../types/conduit.types";

type Invalidate = (queryClient: QueryClient) => Promise<unknown>;

const refresh =
  (...keys: ReadonlyArray<readonly unknown[]>): Invalidate =>
  (queryClient) =>
    Promise.all(
      keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    );

const K = adminQueryKeys.conduit;

function patchConversation(
  queryClient: QueryClient,
  conversationId: string,
  patch: Partial<ConversationSummary>,
) {
  const previous = queryClient.getQueriesData<Paginated<ConversationSummary>>({
    queryKey: [...K.conversations(), "list"],
  });
  queryClient.setQueriesData<Paginated<ConversationSummary>>(
    { queryKey: [...K.conversations(), "list"] },
    (current) =>
      current && {
        ...current,
        data: current.data.map((c) =>
          c.id === conversationId ? { ...c, ...patch } : c,
        ),
      },
  );
  return () =>
    previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
}

export function useConduitActions() {
  const queryClient = useQueryClient();
  const singleFlight = useSingleFlight();
  const [busy, setBusy] = useState<ReadonlySet<string>>(new Set());

  const actions = useMemo(() => {
    const run = <T>(
      key: string,
      message: AdminActionKey,
      execute: () => Promise<T>,
      invalidate?: Invalidate,
    ) =>
      singleFlight(key, async () => {
        setBusy((current) => new Set(current).add(key));
        const outcome = await runAdminAction(message, execute);
        setBusy((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
        if (outcome.ok && invalidate) await invalidate(queryClient);
        return outcome.ok;
      });

    const connection = refresh(K.overview(), K.connection(), K.qr());

    return {
      connect: () =>
        run(
          "connection",
          "conduitConnect",
          () => conduitApi.connectionAction("connect"),
          connection,
        ),
      reconnect: () =>
        run(
          "connection",
          "conduitReconnect",
          () => conduitApi.connectionAction("reconnect"),
          connection,
        ),
      disconnect: () =>
        run(
          "connection",
          "conduitDisconnect",
          () => conduitApi.connectionAction("disconnect"),
          connection,
        ),
      setWarmupLevel: (level: WarmupLevel) =>
        run(
          "warmup",
          "conduitWarmup",
          () => conduitApi.setWarmupLevel(level),
          connection,
        ),
      setCampaignPolicy: (policy: CampaignPolicy, days: number) =>
        run(
          "policy",
          "conduitCampaignPolicy",
          () => conduitApi.setCampaignPolicy(policy, days),
          connection,
        ),

      toggleBot: (turnOn: boolean) =>
        run(
          "bot",
          turnOn ? "conduitBotOn" : "conduitBotOff",
          () => conduitApi.toggleBot(),
          refresh(K.bot(), K.overview()),
        ),
      updateBot: (data: UpdateBotRequest) =>
        run(
          "bot",
          "conduitBotSettings",
          () => conduitApi.updateBot(data),
          refresh(K.bot(), K.overview()),
        ),
      updatePromptSettings: (data: PromptSettings) =>
        run(
          "personality",
          "conduitPersonality",
          () => conduitApi.updatePromptSettings(data),
          refresh(K.promptSettings()),
        ),
      updatePrompt: (type: PromptType, content: string) =>
        run(
          `prompt:${type}`,
          "conduitPrompt",
          () => conduitApi.updatePrompt(type, content),
          refresh(K.prompt(type)),
        ),
      addModel: (data: CreateAiModelRequest) =>
        run(
          "model:add",
          "conduitAddModel",
          () => conduitApi.addModel(data),
          refresh(K.models(), K.bot()),
        ),
      removeModel: (id: string) =>
        run(
          `model:${id}`,
          "conduitRemoveModel",
          () => conduitApi.removeModel(id),
          refresh(K.models(), K.bot()),
        ),
      resetModel: (id: string) =>
        run(
          `model:${id}`,
          "conduitResetModel",
          () => conduitApi.resetModel(id),
          refresh(K.models(), K.bot()),
        ),
      setToolActive: (id: string, isActive: boolean) =>
        run(
          `tool:${id}`,
          isActive ? "conduitToolOn" : "conduitToolOff",
          () => conduitApi.setToolActive(id, isActive),
          refresh(K.tools()),
        ),
      addEscalationContact: (data: Omit<EscalationContact, "id">) =>
        run(
          "escalation:add",
          "conduitAddEscalation",
          () => conduitApi.addEscalationContact(data),
          refresh(K.escalation()),
        ),
      removeEscalationContact: (id: string) =>
        run(
          `escalation:${id}`,
          "conduitRemoveEscalation",
          () => conduitApi.removeEscalationContact(id),
          refresh(K.escalation()),
        ),

      reply: (conversationId: string, text: string) =>
        run(
          `reply:${conversationId}`,
          "conduitReply",
          () => conduitApi.reply(conversationId, text),
          refresh(K.conversations()),
        ),
      pause: (conversationId: string, minutes: number, reason?: string) =>
        singleFlight(`pause:${conversationId}`, async () => {
          const revert = patchConversation(queryClient, conversationId, {
            botPaused: true,
            botPausedUntil: new Date(
              Date.now() + minutes * 60_000,
            ).toISOString(),
            botPauseReason: reason ?? null,
          });
          const outcome = await runAdminAction("conduitPause", () =>
            conduitApi.pause(conversationId, minutes, reason),
          );
          if (!outcome.ok) revert();
          await queryClient.invalidateQueries({ queryKey: K.conversations() });
          return outcome.ok;
        }),
      resume: (conversationId: string) =>
        singleFlight(`pause:${conversationId}`, async () => {
          const revert = patchConversation(queryClient, conversationId, {
            botPaused: false,
            botPausedUntil: null,
            botPauseReason: null,
          });
          const outcome = await runAdminAction("conduitResume", () =>
            conduitApi.resume(conversationId),
          );
          if (!outcome.ok) revert();
          await queryClient.invalidateQueries({ queryKey: K.conversations() });
          return outcome.ok;
        }),
      close: (conversationId: string) =>
        singleFlight(`close:${conversationId}`, async () => {
          const key = `close:${conversationId}`;
          setBusy((current) => new Set(current).add(key));
          const revert = patchConversation(queryClient, conversationId, {
            status: "COMPLETED",
            awaitingReply: false,
            botPaused: false,
            botPausedUntil: null,
            botPauseReason: null,
          });
          const outcome = await runAdminAction("conduitClose", () =>
            conduitApi.close(conversationId),
          );
          setBusy((current) => {
            const next = new Set(current);
            next.delete(key);
            return next;
          });
          if (!outcome.ok) revert();
          await queryClient.invalidateQueries({ queryKey: K.conversations() });
          return outcome.ok;
        }),

      saveTemplate: (id: string | null, data: SaveTemplateRequest) =>
        run(
          `template:${id ?? "new"}`,
          "conduitSaveTemplate",
          () =>
            id
              ? conduitApi.updateTemplate(id, data)
              : conduitApi.createTemplate(data),
          refresh(K.templates()),
        ),
      removeTemplate: (id: string) =>
        run(
          `template:${id}`,
          "conduitRemoveTemplate",
          () => conduitApi.removeTemplate(id),
          refresh(K.templates()),
        ),
      cancelMessage: (id: string) =>
        run(
          `message:${id}`,
          "conduitCancelMessage",
          () => conduitApi.cancelMessage(id),
          refresh([...K.all(), "messages"]),
        ),
      requeue: (messageId: string) =>
        run(
          `requeue:${messageId}`,
          "conduitRequeue",
          () => conduitApi.requeue(messageId),
          refresh([...K.all(), "dead-letters"], [...K.all(), "messages"]),
        ),
      retryOutbox: (id: string) =>
        run(
          `outbox:${id}`,
          "conduitRetryOutbox",
          () => conduitApi.retryOutbox(id),
          refresh([...K.all(), "outbox"]),
        ),

      saveBusinessSettings: (data: UpdateBusinessSettingsRequest) =>
        run(
          "business",
          "businessSettings",
          () => businessSettingsApi.update(data),
          refresh(K.businessSettings()),
        ),
      createAutomationRule: (data: CreateAutomationRuleRequest) =>
        run(
          "rule:new",
          "saveAutomationRule",
          () => automationRulesApi.create(data),
          refresh(adminQueryKeys.automationRules.lists()),
        ),
      updateAutomationRule: (id: string, data: UpdateAutomationRuleRequest) =>
        run(
          `rule:${id}`,
          "saveAutomationRule",
          () => automationRulesApi.update(id, data),
          refresh(adminQueryKeys.automationRules.lists()),
        ),
    };
  }, [queryClient, singleFlight]);

  return { ...actions, busy };
}

export type ConduitActions = ReturnType<typeof useConduitActions>;
