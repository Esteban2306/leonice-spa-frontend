"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Ellipsis } from "lucide-react";

import Dock from "@/src/components/ui/Dock";
import { useLogout } from "@/src/features/auth/hooks/use-auth";
import { useInboxCounts } from "@/src/features/admin/whatsapp/lib/use-inbox-counts";
import {
  ADMIN_NAVIGATION,
  WHATSAPP_HREF,
  isActiveAdminRoute,
} from "@/src/features/admin/navigation/admin-navigation";

import { AdminMobileMoreSheet } from "./admin-mobile-more-sheet";

const PRIMARY_HREFS: readonly string[] = [
  "/admin",
  "/admin/calendar",
  "/admin/clients",
  WHATSAPP_HREF,
];

const PRIMARY_ITEMS = ADMIN_NAVIGATION.filter((item) => PRIMARY_HREFS.includes(item.href));
const MORE_ITEMS = ADMIN_NAVIGATION.filter((item) => !PRIMARY_HREFS.includes(item.href));

const BRAND_TOKENS = {
  "--dock-panel": "rgba(6, 33, 18, 0.86)",
  "--dock-panel-edge": "rgba(191, 146, 80, 0.32)",
  "--dock-panel-highlight": "rgba(242, 235, 219, 0.08)",
  "--dock-panel-shadow":
    "0 22px 44px -20px rgba(6, 33, 18, 0.75), 0 6px 16px -8px rgba(6, 33, 18, 0.45)",
  "--dock-tile": "linear-gradient(180deg, #0f3a22 0%, #062112 100%)",
  "--dock-tile-edge": "rgba(191, 146, 80, 0.26)",
  "--dock-tile-highlight": "rgba(242, 235, 219, 0.1)",
  "--dock-tile-shadow": "0 4px 10px -4px rgba(0, 0, 0, 0.6)",
  "--dock-ink": "#F2EBDB",
  "--dock-label": "#062112",
  "--dock-label-ink": "#F2EBDB",
  "--dock-dot": "#BF9250",
  "--dock-separator": "rgba(191, 146, 80, 0.35)",
  "--dock-menu": "rgba(6, 33, 18, 0.92)",
  "--dock-menu-edge": "rgba(191, 146, 80, 0.3)",
  "--dock-menu-ink": "#F2EBDB",
  "--dock-menu-muted": "rgba(242, 235, 219, 0.5)",
  "--dock-menu-separator": "rgba(242, 235, 219, 0.12)",
  bottom: "calc(12px + env(safe-area-inset-bottom))",
} as React.CSSProperties;

const ACTIVE_TILE =
  "[--dock-tile:linear-gradient(180deg,#d9b277_0%,#BF9250_100%)] [--dock-tile-edge:rgba(242,235,219,0.45)] [--dock-ink:#062112]";

export function AdminMobileDock() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const inbox = useInboxCounts();
  const [moreOpen, setMoreOpen] = useState(false);

  const navigationItems = PRIMARY_ITEMS.map((item) => {
    const Icon = item.icon;
    const active = isActiveAdminRoute(pathname, item.href);
    return {
      label: item.shortName,
      icon: <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />,
      active,
      className: active ? ACTIVE_TILE : "",
      badge:
        item.href === WHATSAPP_HREF && inbox.pending > 0
          ? inbox.pending > 99
            ? "99+"
            : String(inbox.pending)
          : undefined,
      onClick: () => {
        if (!active || pathname !== item.href) router.push(item.href);
      },
    };
  });

  const moreActive = MORE_ITEMS.some((item) => isActiveAdminRoute(pathname, item.href));

  const items = [
    ...navigationItems,
    {
      label: "Más",
      icon: <Ellipsis className="size-6" strokeWidth={1.8} aria-hidden="true" />,
      active: moreActive,
      className: moreActive ? ACTIVE_TILE : "",
      onClick: () => setMoreOpen(true),
    },
  ];

  const navigateFromSheet = (href: string) => {
    setMoreOpen(false);
    if (pathname !== href) router.push(href);
  };

  const logoutFromSheet = () => {
    if (logout.isPending) return;
    logout.mutate(undefined, {
      onSettled: () => router.replace("/admin/login"),
    });
  };

  // El agendado paso a paso ocupa toda la pantalla.
  if (pathname === "/admin/calendar/new") return null;

  return (
    <>
      <nav
        aria-label="Navegación del panel"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[var(--admin-dock-space)] desk:hidden"
      >
        <Dock
          items={items}
          position="bottom"
          theme="dark"
          baseItemSize={54}
          magnification={62}
          distance={140}
          panelHeight={70}
          gap={10}
          roundness={0.55}
          badgeColor="#b91c1c"
          accentColor="#BF9250"
          className="pointer-events-auto"
          style={BRAND_TOKENS}
        />
      </nav>
      <AdminMobileMoreSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        items={MORE_ITEMS}
        pathname={pathname}
        onNavigate={navigateFromSheet}
        onLogout={logoutFromSheet}
        isLoggingOut={logout.isPending}
      />
    </>
  );
}
