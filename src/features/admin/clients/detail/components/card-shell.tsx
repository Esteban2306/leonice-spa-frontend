import type { ReactNode } from "react";

interface CardShellProps {
  title: string;
  icon?: ReactNode;
  aside?: ReactNode;
  tone?: "light" | "dark";
  children: ReactNode;
}

export function CardShell({ title, icon, aside, tone = "light", children }: CardShellProps) {
  const isDark = tone === "dark";
  return (
    <section
      className={`flex flex-col gap-4 rounded-[2rem] border p-5 ${
        isDark
          ? "border-secondary bg-secondary text-primary"
          : "border-tertiary/25 bg-[#FCF6EB] text-secondary"
      }`}
    >
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-heading text-xl">
          {icon}
          {title}
        </h2>
        {aside}
      </header>
      {children}
    </section>
  );
}
