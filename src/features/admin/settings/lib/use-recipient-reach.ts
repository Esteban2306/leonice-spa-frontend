"use client";

import {
  useConduitContacts,
  useConduitOverview,
} from "@/src/features/admin/hooks/use-conduit";
import type { AdminNotificationRecipient } from "@/src/features/admin/types/settings.types";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";

export type RecipientReach = "OK" | "SPA_NUMBER" | "NEEDS_WRITE";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_WINDOW_DAYS = 180;

export function useRecipientReach(
  recipients: readonly AdminNotificationRecipient[],
): ReadonlyMap<string, RecipientReach> {
  const overview = useConduitOverview();
  const contacts = useConduitContacts({ limit: 100 });
  const nowMs = useMinuteClock();

  const windowDays =
    overview.data?.connection?.inboundLookbackDays ?? DEFAULT_WINDOW_DAYS;
  const spaDigits =
    overview.data?.connection?.phoneNumber?.replace(/\D/g, "") ?? "";
  const cutoff = nowMs - windowDays * DAY_MS;
  const lastInbound = new Map(
    (contacts.data?.data ?? []).map((contact) => [
      contact.address.replace(/\D/g, ""),
      contact.lastInboundAt,
    ]),
  );

  const reach = new Map<string, RecipientReach>();
  if (!contacts.data) return reach;
  for (const recipient of recipients) {
    const digits = recipient.phone.replace(/\D/g, "");
    const at = lastInbound.get(digits);
    reach.set(
      recipient.id,
      spaDigits !== "" && digits === spaDigits
        ? "SPA_NUMBER"
        : at && new Date(at).getTime() >= cutoff
          ? "OK"
          : "NEEDS_WRITE",
    );
  }
  return reach;
}
