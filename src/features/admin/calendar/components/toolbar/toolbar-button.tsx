import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToolbarButtonVariant = "outline" | "solid" | "ghost";

const BASE =
  "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ToolbarButtonVariant, string> = {
  outline:
    "border border-secondary/15 bg-white text-secondary hover:bg-quaternary/25",
  solid: "bg-secondary text-primary hover:bg-secondary/90",
  ghost: "text-secondary/65 hover:bg-secondary/5 hover:text-secondary",
};

export function toolbarButtonClass(
  variant: ToolbarButtonVariant,
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], className);
}

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: ToolbarButtonVariant;
}

export function ToolbarButton({
  icon: Icon,
  variant = "outline",
  className,
  children,
  type = "button",
  ...props
}: ToolbarButtonProps) {
  return (
    <button
      type={type}
      className={toolbarButtonClass(variant, className)}
      {...props}
    >
      {Icon && <Icon className="size-4" strokeWidth={1.8} />}
      {children}
    </button>
  );
}
