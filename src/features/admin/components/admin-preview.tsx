"use client";

import { useRouter } from "next/navigation";

import {
  authKeys,
  useLogout,
  useSession,
} from "@/src/features/auth/hooks/use-auth";

export function AdminPreview() {
  const router = useRouter();

  const session = useSession();
  const logout = useLogout();

  const user = session.data;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.replace("/admin/login");
      },
    });
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-tertiary">
            Leonice Spa
          </p>

          <h1 className="font-heading text-5xl text-foreground">
            Panel administrativo
          </h1>

          <p className="font-sans text-sm text-foreground/60">
            Esta es una interfaz provisional para validar el flujo de
            autenticación.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-foreground/10 bg-secondary p-6 text-primary">
            <p className="font-sans text-sm opacity-70">Estado de sesión</p>

            <p className="mt-2 font-heading text-3xl">Autenticado</p>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-quaternary p-6 text-secondary">
            <p className="font-sans text-sm opacity-70">Usuario</p>

            <p className="mt-2 break-all font-sans font-medium">
              {user?.email ?? "Cargando..."}
            </p>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-tertiary p-6 text-secondary">
            <p className="font-sans text-sm opacity-70">Rol</p>

            <p className="mt-2 font-heading text-3xl">{user?.role ?? "—"}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm">
          <h2 className="font-heading text-3xl text-foreground">
            Sesión activa
          </h2>

          <p className="mt-2 font-sans text-sm text-foreground/60">
            El frontend logró validar la sesión mediante el endpoint protegido{" "}
            <code>/auth/me</code>.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLogout}
              disabled={logout.isPending}
              className="rounded-full bg-secondary px-5 py-2.5 font-sans text-sm text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {logout.isPending ? "Cerrando sesión..." : "Cerrar sesión"}
            </button>

            <button
              type="button"
              onClick={() => router.refresh()}
              className="rounded-full border border-foreground/15 px-5 py-2.5 font-sans text-sm text-foreground transition-colors hover:bg-foreground/5"
            >
              Actualizar sesión
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
