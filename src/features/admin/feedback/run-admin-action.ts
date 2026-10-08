import {
  ADMIN_ACTION_MESSAGES,
  type AdminActionKey,
} from "./action-messages";
import { toastError, toastSuccess } from "./admin-toast";

export type ActionOutcome<T> = { ok: true; value: T } | { ok: false };

export async function runAdminAction<T>(
  action: AdminActionKey,
  execute: () => Promise<T>,
  successDetail?: (value: T) => string | undefined,
): Promise<ActionOutcome<T>> {
  const messages = ADMIN_ACTION_MESSAGES[action];

  try {
    const value = await execute();
    toastSuccess(messages.success, successDetail?.(value));
    return { ok: true, value };
  } catch (error) {
    toastError(messages.error, error);
    return { ok: false };
  }
}
