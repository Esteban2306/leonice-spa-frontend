import { Suspense } from "react";

import { ClientsDirectoryContainer } from "@/src/features/admin/clients/directory/clients-directory-container";

export default function ClientsPage() {
  return (
    <Suspense>
      <ClientsDirectoryContainer />
    </Suspense>
  );
}
