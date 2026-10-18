import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginContainer } from "@/src/features/auth/login/login-container";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 bg-[#F2EBDB]">
      <Suspense>
        <LoginContainer />
      </Suspense>
    </main>
  );
}
