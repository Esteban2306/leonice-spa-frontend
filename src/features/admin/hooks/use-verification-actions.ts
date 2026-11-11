import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { conduitApi } from "../api/conduit.api";
import { verificationApi } from "../api/verification.api";
import type { AdminActionKey } from "../feedback/action-messages";
import { runAdminAction } from "../feedback/run-admin-action";
import { adminQueryKeys } from "./query-keys";
import { useSingleFlight } from "./use-single-flight";

import type {
  VerificationDecision,
  VerificationMode,
} from "../types/verification.types";

const K = adminQueryKeys.conduit;

export function useVerificationActions() {
  const queryClient = useQueryClient();
  const singleFlight = useSingleFlight();
  const [busy, setBusy] = useState<ReadonlySet<string>>(new Set());

  const actions = useMemo(() => {
    const run = <T>(
      key: string,
      message: AdminActionKey,
      execute: () => Promise<T>,
    ) =>
      singleFlight(key, async () => {
        setBusy((current) => new Set(current).add(key));
        const outcome = await runAdminAction(message, execute);
        setBusy((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
        if (outcome.ok) {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: K.verification() }),
            queryClient.invalidateQueries({ queryKey: K.bot() }),
          ]);
        }
        return outcome.ok;
      });

    return {
      setMode: (mode: VerificationMode) =>
        run("verification:mode", "verificationMode", () =>
          verificationApi.setMode(mode),
        ),
      setImageAnalysis: (enabled: boolean) =>
        run("verification:images", "conduitBotSettings", () =>
          conduitApi.updateBot({ imageAnalysisEnabled: enabled }),
        ),
      rotateKey: (modelId: string, apiKey: string) =>
        run(`verification:key:${modelId}`, "verificationRotateKey", () =>
          verificationApi.rotateKey(modelId, apiKey),
        ),
      reactivateModel: (modelId: string) =>
        run(
          `verification:model:${modelId}`,
          "verificationReactivateModel",
          () => verificationApi.reactivateModel(modelId),
        ),
      review: (id: string, decision: VerificationDecision) =>
        run(`verification:review:${id}`, "verificationReview", () =>
          verificationApi.review(id, decision),
        ),
    };
  }, [queryClient, singleFlight]);

  return { ...actions, busy };
}

export type VerificationActions = ReturnType<typeof useVerificationActions>;
