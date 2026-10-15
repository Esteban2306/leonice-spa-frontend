import type { ReactNode } from "react";

import { MarketingShell } from "@/src/features/landing/components/marketing-shell";

import "@/src/features/treatments/treatments.css";

export function TreatmentsShell({ children }: { children: ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
