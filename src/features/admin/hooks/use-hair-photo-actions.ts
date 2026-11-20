import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { hairPhotoApi } from "../api/verification.api";
import type { AdminActionKey } from "../feedback/action-messages";
import { runAdminAction } from "../feedback/run-admin-action";
import { adminQueryKeys } from "./query-keys";
import { useSingleFlight } from "./use-single-flight";

import type { VerificationMode } from "../types/verification.types";

export function useHairPhotoActions() {
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
          await queryClient.invalidateQueries({
            queryKey: adminQueryKeys.conduit.hairPhoto(),
          });
        }
        return outcome.ok;
      });

    return {
      setup: (apiKey: string, mode: VerificationMode) =>
        run("hair:setup", "hairPhotoSetup", () =>
          hairPhotoApi.setup(apiKey, mode),
        ),
      setMode: (mode: VerificationMode) =>
        run("hair:mode", "hairPhotoMode", () => hairPhotoApi.setMode(mode)),
      rotateKey: (modelId: string, apiKey: string) =>
        run(`hair:key:${modelId}`, "verificationRotateKey", () =>
          hairPhotoApi.rotateKey(modelId, apiKey),
        ),
      reactivateModel: (modelId: string) =>
        run(`hair:model:${modelId}`, "verificationReactivateModel", () =>
          hairPhotoApi.reactivateModel(modelId),
        ),
    };
  }, [queryClient, singleFlight]);

  return { ...actions, busy };
}

export type HairPhotoActions = ReturnType<typeof useHairPhotoActions>;
