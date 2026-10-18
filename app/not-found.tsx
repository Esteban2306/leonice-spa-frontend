import type { Metadata } from "next";
import Link from "next/link";

import {
  STATUS_PRIMARY_ACTION,
  STATUS_SECONDARY_ACTION,
  StatusScreen,
} from "@/src/components/status/status-screen";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <StatusScreen
      eyebrow="Error 404"
      title="No encontramos esta página"
      description="Puede que el enlace esté mal escrito o que la página ya no exista. Desde aquí puedes volver a lo que buscabas."
    >
      <Link href="/" className={STATUS_PRIMARY_ACTION}>
        Volver al inicio
      </Link>
      <Link href="/tratamientos" className={STATUS_SECONDARY_ACTION}>
        Ver tratamientos
      </Link>
      <Link href="/productos" className={STATUS_SECONDARY_ACTION}>
        Ver productos
      </Link>
    </StatusScreen>
  );
}
