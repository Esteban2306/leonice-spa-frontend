import Link from "@/src/features/admin/components/admin-link";

import { cn } from "@/lib/utils";

const TABS = [
  { id: "campaigns", label: "Campañas", href: "/admin/campaigns" },
  {
    id: "automatic",
    label: "Mensajes automáticos",
    href: "/admin/campaigns/automatic",
  },
] as const;

export function MessagingTabs({
  active,
}: {
  active: (typeof TABS)[number]["id"];
}) {
  return (
    <nav aria-label="Mensajes" className="flex flex-wrap gap-1.5">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={tab.id === active ? "page" : undefined}
          className={cn(
            "inline-flex h-10 items-center rounded-full border px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
            tab.id === active
              ? "border-secondary bg-secondary text-primary"
              : "border-secondary/15 bg-white text-secondary/75 hover:bg-quaternary/20",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
