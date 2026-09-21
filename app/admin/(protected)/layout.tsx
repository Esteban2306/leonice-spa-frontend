"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSession } from "@/src/features/auth/hooks/use-auth";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const session = useSession();

  const devAuthBypass =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

  useEffect(() => {
    if (devAuthBypass) {
      return;
    }

    if (session.isError) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [devAuthBypass, pathname, router, session.isError]);

  if (devAuthBypass) {
    return <>{children}</>;
  }

  if (session.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-sans text-sm text-foreground/70">
          Verificando sesión...
        </p>
      </main>
    );
  }

  if (session.isError || !session.data) {
    return null;
  }

  return <>{children}</>;
}
