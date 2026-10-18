import { useMemo } from "react";

import { useChangePassword } from "@/src/features/auth/hooks/use-auth";

import { runAdminAction } from "../feedback/run-admin-action";
import {
  useCreateNotificationRecipient,
  useUpdateNotificationRecipient,
} from "./use-notification-recipients";
import { useSingleFlight } from "./use-single-flight";

import type { CreateNotificationRecipientRequest } from "../types/settings.types";

export interface SettingsActions {
  createRecipient: (
    data: CreateNotificationRecipientRequest,
  ) => Promise<boolean>;
  renameRecipient: (recipientId: string, name: string) => Promise<boolean>;
  setRecipientEmail: (
    recipientId: string,
    email: string | null,
  ) => Promise<boolean>;
  setRecipientActive: (
    recipientId: string,
    isActive: boolean,
  ) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  isSavingRecipient: boolean;
  isChangingPassword: boolean;
}

export function useSettingsActions(): SettingsActions {
  const singleFlight = useSingleFlight();
  const create = useCreateNotificationRecipient();
  const update = useUpdateNotificationRecipient();
  const password = useChangePassword();

  const { mutateAsync: createAsync } = create;
  const { mutateAsync: updateAsync } = update;
  const { mutateAsync: passwordAsync } = password;

  const actions = useMemo(
    () => ({
      createRecipient: (data: CreateNotificationRecipientRequest) =>
        singleFlight(
          "recipient:create",
          async () =>
            (await runAdminAction("createRecipient", () => createAsync(data)))
              .ok,
        ),
      renameRecipient: (recipientId: string, name: string) =>
        singleFlight(
          `recipient:update:${recipientId}`,
          async () =>
            (
              await runAdminAction("updateRecipient", () =>
                updateAsync({ recipientId, data: { name } }),
              )
            ).ok,
        ),
      setRecipientEmail: (recipientId: string, email: string | null) =>
        singleFlight(
          `recipient:update:${recipientId}`,
          async () =>
            (
              await runAdminAction("updateRecipientEmail", () =>
                updateAsync({ recipientId, data: { email } }),
              )
            ).ok,
        ),
      setRecipientActive: (recipientId: string, isActive: boolean) =>
        singleFlight(
          `recipient:update:${recipientId}`,
          async () =>
            (
              await runAdminAction(
                isActive ? "activateRecipient" : "deactivateRecipient",
                () => updateAsync({ recipientId, data: { isActive } }),
              )
            ).ok,
        ),
      changePassword: (currentPassword: string, newPassword: string) =>
        singleFlight(
          "auth:change-password",
          async () =>
            (
              await runAdminAction("changePassword", () =>
                passwordAsync({ currentPassword, newPassword }),
              )
            ).ok,
        ),
    }),
    [singleFlight, createAsync, updateAsync, passwordAsync],
  );

  return {
    ...actions,
    isSavingRecipient: create.isPending || update.isPending,
    isChangingPassword: password.isPending,
  };
}
