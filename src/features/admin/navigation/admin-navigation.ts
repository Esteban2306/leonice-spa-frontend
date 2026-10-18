import {
  CalendarDays,
  LayoutDashboard,
  MessageCircle,
  MessageSquareQuote,
  Package,
  Scissors,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavigationItem {
  name: string;
  shortName: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAVIGATION: readonly AdminNavigationItem[] = [
  {
    name: "Resumen",
    shortName: "Resumen",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Calendario",
    shortName: "Calendario",
    href: "/admin/calendar",
    icon: CalendarDays,
  },
  {
    name: "Clientes - CRM",
    shortName: "Clientes",
    href: "/admin/clients",
    icon: UsersRound,
  },
  {
    name: "Servicios",
    shortName: "Servicios",
    href: "/admin/services",
    icon: Scissors,
  },
  {
    name: "Productos",
    shortName: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Testimonios",
    shortName: "Testimonios",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "WhatsApp",
    shortName: "WhatsApp",
    href: "/admin/whatsapp",
    icon: MessageCircle,
  },
  {
    name: "Ajustes",
    shortName: "Ajustes",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const WHATSAPP_HREF = "/admin/whatsapp";

export function isActiveAdminRoute(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
