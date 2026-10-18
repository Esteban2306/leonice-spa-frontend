"use client";

import { useEffect } from "react";

import "@/src/globals.css";
import { STATUS_PRIMARY_ACTION, StatusScreen } from "@/src/components/status/status-screen";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es-CO">
      <body>
        <title>Algo salió mal · Leonice Arenas Spa Capilar</title>
        <StatusScreen
          eyebrow="Algo salió mal"
          title="No pudimos cargar el sitio"
          description="Ocurrió un problema inesperado. Intenta de nuevo en unos segundos."
        >
          <button type="button" onClick={() => retry()} className={STATUS_PRIMARY_ACTION}>
            Intentar de nuevo
          </button>
        </StatusScreen>
      </body>
    </html>
  );
}
