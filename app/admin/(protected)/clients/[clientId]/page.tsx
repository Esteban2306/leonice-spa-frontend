import { Suspense } from "react";

import { ClientDetailContainer } from "@/src/features/admin/clients/detail/client-detail-container";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <Suspense>
      <ClientDetailContainer clientId={clientId} />
    </Suspense>
  );
}
