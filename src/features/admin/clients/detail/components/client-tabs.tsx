export type ClientTab = "upcoming" | "history" | "payments" | "notes";

interface ClientTabsProps {
  tab: ClientTab;
  upcomingCount: number;
  onChange: (tab: ClientTab) => void;
}

export function isClientTab(value: string | null): value is ClientTab {
  return value === "upcoming" || value === "history" || value === "payments" || value === "notes";
}

export function ClientTabs({ tab, upcomingCount, onChange }: ClientTabsProps) {
  const options: ReadonlyArray<{ id: ClientTab; label: string }> = [
    { id: "upcoming", label: `Próximas citas · ${upcomingCount}` },
    { id: "history", label: "Historial" },
    { id: "payments", label: "Pagos y crédito" },
    { id: "notes", label: "Notas" },
  ];

  return (
    <div role="tablist" aria-label="Secciones del cliente" className="grid grid-cols-2 gap-1 rounded-[1.5rem] border border-tertiary/25 bg-[#FCF6EB] p-1 sm:grid-cols-4 sm:rounded-full">
      {options.map((option) => {
        const isActive = option.id === tab;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.id)}
            className={`h-10 cursor-pointer rounded-full px-3 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
              isActive ? "bg-secondary text-primary" : "text-secondary/65 hover:bg-secondary/5"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
