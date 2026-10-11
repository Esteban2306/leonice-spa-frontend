"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { scrollToSection } from "@/src/features/landing/motion/scroll-to-section";
import {
  BOOKING_MESSAGE,
  SECTION_IDS,
  whatsappHref,
} from "@/src/features/landing/lib/site-config";

export type ActionVariant =
  | "sand"
  | "ink"
  | "cream"
  | "outline-ink"
  | "outline-cream"
  | "link"
  | "link-cream";

const BASE =
  "group/action relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-sans font-bold transition-[transform,background-color,color,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ActionVariant, string> = {
  sand: "rounded-full bg-[#E0BC87] text-[#062112] shadow-[calc(var(--sun-dx)*6px)_calc(var(--sun-dy)*6px)_18px_-6px_rgb(74_46_16/0.35)] hover:bg-[#d4aa6a]",
  ink: "rounded-full bg-[#062112] text-[#F2EBDB] shadow-[calc(var(--sun-dx)*6px)_calc(var(--sun-dy)*6px)_18px_-6px_rgb(6_33_18/0.45)] hover:bg-[#0d3320]",
  cream: "rounded-full bg-[#F2EBDB] text-[#062112] shadow-[calc(var(--sun-dx)*6px)_calc(var(--sun-dy)*6px)_18px_-6px_rgb(74_46_16/0.3)] hover:bg-white",
  "outline-ink":
    "rounded-full border border-[#062112]/70 text-[#062112] hover:border-[#062112] hover:bg-[#062112] hover:text-[#F2EBDB]",
  "outline-cream":
    "rounded-full border border-[#F2EBDB]/70 text-[#F2EBDB] hover:border-[#F2EBDB] hover:bg-[#F2EBDB] hover:text-[#062112]",
  link: "rounded-full text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px] hover:decoration-[#062112]",
  "link-cream":
    "rounded-full text-[#F2EBDB] underline decoration-[#E0BC87] decoration-2 underline-offset-[6px] hover:decoration-[#F2EBDB]",
};

const SIZES = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
} as const;

interface ActionLinkProps {
  children: ReactNode;
  variant?: ActionVariant;
  size?: keyof typeof SIZES;
  to?: string;
  href?: string | null;
  arrow?: boolean;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export function ActionLink({
  children,
  variant = "sand",
  size = "md",
  to,
  href,
  arrow = true,
  className = "",
  ariaLabel,
  onClick,
}: ActionLinkProps) {
  const isLink = variant === "link" || variant === "link-cream";
  const classes = `${BASE} ${VARIANTS[variant]} ${isLink ? "h-auto px-1 py-2 text-[0.95rem]" : SIZES[size]} ${className}`;
  const content = (
    <>
      {!isLink && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-out group-hover/action:left-full group-hover/action:opacity-100"
        />
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="relative size-4 transition-transform duration-300 ease-out group-hover/action:translate-x-1"
        />
      )}
    </>
  );

  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <a
      href={to ? `#${to}` : undefined}
      className={classes}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.();
        if (!to) return;
        event.preventDefault();
        scrollToSection(to);
      }}
    >
      {content}
    </a>
  );
}

export function BookingLink({
  message = BOOKING_MESSAGE,
  children,
  ...rest
}: Omit<ActionLinkProps, "href" | "to"> & { message?: string }) {
  const href = whatsappHref(message);
  return (
    <ActionLink {...rest} href={href} to={href ? undefined : SECTION_IDS.contact}>
      {children}
    </ActionLink>
  );
}
