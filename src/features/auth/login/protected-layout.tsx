import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSession } from "../hooks/use-auth";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();

  const session = useSession();

  const devAuthBypass =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

  useEffect(() => {
    if (devAuthBypass) return;

    if (session.isError) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [devAuthBypass, pathname, router, session.isError]);

  if (devAuthBypass) {
    return <>{children}</>;
  }

  if (session.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  if (session.isError || !session.data) {
    return null;
  }

  return <>{children}</>;
}
