"use client";

import { useState, useSyncExternalStore } from "react";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import { useSession } from "@/src/features/auth/hooks/use-auth";

import { useDailyReport } from "../hooks/use-reports";
import { DailyReportDialog } from "./daily-report-dialog";
import {
  SERVER_SNAPSHOT,
  markDaySeen,
  readSeenDay,
  seenStorageKey,
  shouldShowDailyReport,
} from "./daily-report-seen";

const subscribeNoop = () => () => undefined;

export function DailyReportGate() {
  const session = useSession();
  const nowMs = useMinuteClock();
  const todayKey = getBogotaDayKey(new Date(nowMs));
  const storageKey = seenStorageKey(session.data?.id ?? null);
  const [dismissedDay, setDismissedDay] = useState<string | null>(null);

  const seenDay = useSyncExternalStore(
    subscribeNoop,
    () => readSeenDay(storageKey),
    () => SERVER_SNAPSHOT,
  );

  const isOpen =
    dismissedDay !== todayKey && shouldShowDailyReport(seenDay, todayKey);

  const reportQuery = useDailyReport(null, { enabled: isOpen });

  const close = () => {
    markDaySeen(storageKey, todayKey);
    setDismissedDay(todayKey);
  };

  return (
    <DailyReportDialog
      open={isOpen}
      report={reportQuery.data}
      isLoading={reportQuery.isLoading}
      isError={reportQuery.isError}
      onRetry={() => void reportQuery.refetch()}
      onClose={close}
    />
  );
}
