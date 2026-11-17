"use client";

import { LogOut } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/src/components/ui/sheet";
import {
  isActiveAdminRoute,
  type AdminNavigationItem,
} from "@/src/features/admin/navigation/admin-navigation";

interface AdminMobileMoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: readonly AdminNavigationItem[];
  pathname: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

const TILE =
  "flex min-h-[5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export function AdminMobileMoreSheet({
  open,
  onOpenChange,
  items,
  pathname,
  onNavigate,
  onLogout,
  isLoggingOut,
}: AdminMobileMoreSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-5 rounded-t-[2rem] border-tertiary/30 bg-primary px-5 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-secondary"
      >
        <span aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-full bg-secondary/20" />
        <div>
          <SheetTitle className="font-heading text-2xl text-secondary">Más secciones</SheetTitle>
          <SheetDescription className="sr-only">
            Accesos a las demás secciones del panel y cierre de sesión.
          </SheetDescription>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActiveAdminRoute(pathname, item.href);
            return (
              <button
                key={item.href}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onNavigate(item.href)}
                className={`${TILE} ${
                  active
                    ? "border-tertiary bg-tertiary text-secondary"
                    : "border-secondary/15 bg-white/60 text-secondary hover:bg-secondary/5"
                }`}
              >
                <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                {item.shortName}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={isLoggingOut}
          onClick={onLogout}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white font-sans text-sm text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:opacity-60"
        >
          <LogOut className="size-5" strokeWidth={1.8} aria-hidden="true" />
          {isLoggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
        </button>
      </SheetContent>
    </Sheet>
  );
}
