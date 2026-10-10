import type { Metadata } from "next";

import { CancelPage } from "@/src/features/cancellation/components/cancel-page";

export const metadata: Metadata = {
  title: "Cancelar cita · Leonice Spa",
  robots: { index: false, follow: false },
};

export default async function CancelReservationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <CancelPage token={token} />;
}
