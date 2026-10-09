import { cn } from "@/lib/utils";

interface CatalogSwitchProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  tone?: "light" | "dark";
  onChange: (checked: boolean) => void;
}

export function CatalogSwitch({
  checked,
  label,
  disabled,
  tone = "light",
  onChange,
}: CatalogSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? tone === "dark"
            ? "border-tertiary bg-tertiary"
            : "border-secondary bg-secondary"
          : tone === "dark"
            ? "border-primary/30 bg-primary/15"
            : "border-secondary/20 bg-secondary/10",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-4.5 rounded-full shadow-[0_1px_3px_rgba(6,33,18,0.25)] transition-transform duration-200 ease-out",
          checked
            ? tone === "dark"
              ? "translate-x-5.5 bg-primary"
              : "translate-x-5.5 bg-quaternary"
            : "translate-x-0.5 bg-white",
        )}
      />
    </button>
  );
}
