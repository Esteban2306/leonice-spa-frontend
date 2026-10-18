"use client";

import { useRouter } from "next/navigation";

import { useLogout, useSession } from "@/src/features/auth/hooks/use-auth";

import { useNotificationRecipients } from "../../hooks/use-notification-recipients";
import { useSettingsActions } from "../../hooks/use-settings-actions";
import { SettingsView } from "./settings-view";

export function SettingsContainer() {
  const router = useRouter();
  const session = useSession();
  const logout = useLogout();
  const recipientsQuery = useNotificationRecipients();
  const actions = useSettingsActions();

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const ok = await actions.changePassword(currentPassword, newPassword);
    if (ok) {
      logout.mutate(undefined, {
        onSettled: () => router.replace("/admin/login"),
      });
    }
    return ok;
  };

  return (
    <SettingsView
      recipients={{
        recipients: recipientsQuery.data ?? [],
        isLoading: recipientsQuery.isLoading,
        isError: recipientsQuery.isError,
        isSaving: actions.isSavingRecipient,
        onRetry: () => void recipientsQuery.refetch(),
        onCreate: actions.createRecipient,
        onRename: actions.renameRecipient,
        onChangeEmail: actions.setRecipientEmail,
        onToggle: actions.setRecipientActive,
      }}
      password={{
        email: session.data?.email ?? null,
        isSaving: actions.isChangingPassword || logout.isPending,
        onChangePassword: changePassword,
      }}
    />
  );
}
