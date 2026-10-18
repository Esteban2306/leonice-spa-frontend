"use client";

import { useEffect } from "react";
import Link from "next/link";

import {
  STATUS_PRIMARY_ACTION,
  STATUS_SECONDARY_ACTION,
  StatusScreen,
} from "@/src/components/status/status-screen";

export default function ErrorPage({
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
    <StatusScreen
      eyebrow="Algo salió mal"
      title="No pudimos cargar esta página"
      description="Ocurrió un problema inesperado. Intenta de nuevo; si persiste, vuelve en unos minutos."
    >
      <button type="button" onClick={() => retry()} className={STATUS_PRIMARY_ACTION}>
        Intentar de nuevo
      </button>
      <Link href="/" className={STATUS_SECONDARY_ACTION}>
        Volver al inicio
      </Link>
    </StatusScreen>
  );
}
