import type { ReactNode } from "react";

interface SectionHeadingProps {
  id?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  align?: "start" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  id,
  title,
  lead,
  action,
  align = "start",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-6 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      } ${className}`}
    >
      <div className={`flex max-w-3xl flex-col gap-4 ${centered ? "items-center" : ""}`}>
        <h2
          id={id}
          data-heading
          className={`sunlit-text font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance ${
            tone === "dark" ? "text-[#F2EBDB]" : "text-[#062112]"
          }`}
        >
          {title}
        </h2>
        {lead && (
          <p
            data-lead
            className={`max-w-[58ch] font-sans text-lg leading-relaxed text-pretty ${
              tone === "dark" ? "text-[#F2EBDB]/75" : "text-[#062112]/70"
            }`}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
