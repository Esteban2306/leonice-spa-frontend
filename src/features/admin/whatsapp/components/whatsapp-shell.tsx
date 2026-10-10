"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useConduitOverview } from "@/src/features/admin/hooks/use-conduit";

import { connectionCopy } from "../lib/whatsapp-format";
import { useInboxCounts } from "../lib/use-inbox-counts";
import { StatusPill } from "./status-pill";

const TABS = [
  { href: "/admin/whatsapp", label: "Resumen", exact: true },
  { href: "/admin/whatsapp/inbox", label: "Conversaciones", badge: true },
  { href: "/admin/whatsapp/connection", label: "Conexión" },
  { href: "/admin/whatsapp/assistant", label: "Asistente" },
  { href: "/admin/whatsapp/business", label: "Negocio" },
  { href: "/admin/whatsapp/templates", label: "Plantillas" },
  { href: "/admin/whatsapp/deliveries", label: "Envíos" },
] as const;

export function WhatsappShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const overview = useConduitOverview();
  const counts = useInboxCounts();
  const data = overview.data;
  const copy = connectionCopy(
    data?.connection?.status,
    overview.isError ? false : (data?.reachable ?? true),
    data?.connection?.phoneNumber,
  );
  const isLoading = overview.isLoading;

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-3 rounded-[2rem] bg-secondary p-5 text-primary sm:gap-4 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-3xl sm:text-5xl">
              WhatsApp y asistente
            </h1>
            <p className="mt-2 hidden max-w-xl font-sans text-sm text-primary/70 sm:block">
              Atiende a las clientas, revisa la conexión y ajusta lo que el
              asistente dice y envía.
            </p>
          </div>
          <Link
            href="/admin/whatsapp/connection"
            aria-label={`Estado de WhatsApp: ${copy.label}. ${copy.description}`}
            className="w-fit rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
          >
            {isLoading ? (
              <span className="inline-block h-8 w-36 animate-pulse rounded-full bg-primary/10" />
            ) : (
              <StatusPill
                tone={copy.tone}
                size="md"
                pulse={copy.tone === "green"}
              >
                WhatsApp · {copy.label}
              </StatusPill>
            )}
          </Link>
        </header>

        <nav
          aria-label="Secciones de WhatsApp"
          className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
        >
          <ul className="flex w-max gap-1 rounded-full border border-tertiary/30 bg-[#FCF6EB] p-1">
            {TABS.map((tab) => {
              const isActive =
                "exact" in tab
                  ? pathname === tab.href
                  : pathname.startsWith(tab.href);
              const pending = "badge" in tab ? counts.pending : 0;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-full px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-secondary/75 hover:bg-quaternary/25 hover:text-secondary",
                    )}
                  >
                    {tab.label}
                    {pending > 0 && (
                      <span
                        aria-label={`${pending} pendientes`}
                        className={cn(
                          "grid min-w-5 place-items-center rounded-full px-1.5 font-sans text-[11px] font-semibold tabular-nums",
                          isActive
                            ? "bg-quaternary text-secondary"
                            : "bg-red-700 text-white",
                        )}
                      >
                        {pending}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {children}
      </div>
    </main>
  );
}
