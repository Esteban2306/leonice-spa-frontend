import { useId } from "react";

import { cn } from "@/lib/utils";

import {
  LEONICE_FLAME,
  LEONICE_LEAVES,
  LEONICE_MARK_COLORS,
  LEONICE_MARK_VIEWBOX,
  LEONICE_PROFILE,
  LEONICE_STAR,
  LEONICE_STAR_VIEWBOX,
} from "./leonice-mark-paths";

export type BrandLoaderVariant = "screen" | "section" | "compact" | "inline";
export type BrandLoaderTone = "light" | "dark";

interface BrandLoaderProps {
  variant?: BrandLoaderVariant;
  tone?: BrandLoaderTone;
  label?: string;
  decorative?: boolean;
  className?: string;
}

const LAYOUTS = {
  screen: {
    wrapper:
      "flex min-h-dvh flex-col items-center justify-center gap-7 bg-background px-6 text-center",
    mark: "w-36",
    halo: "leonice-loader__halo",
    caption: "text-sm",
  },
  section: {
    wrapper: "flex flex-col items-center justify-center gap-4 py-10 text-center",
    mark: "w-20",
    halo: "leonice-loader__halo",
    caption: "text-xs",
  },
  compact: {
    wrapper: "flex items-center gap-3 py-2",
    mark: "w-9",
    halo: "leonice-loader__halo leonice-loader__halo--tight",
    caption: "text-xs",
  },
} as const;

const LEAF_DELAYS = ["0s", "0.22s", "0.22s", "0s"];

const TONES = {
  light: {
    leaf: LEONICE_MARK_COLORS.leaf,
    gold: LEONICE_MARK_COLORS.gold,
    star: "#fffaf0",
    caption: "text-secondary/70",
  },
  dark: {
    leaf: "#3a9a6c",
    gold: "#c9a65a",
    star: "#fff6e0",
    caption: "text-primary/80",
  },
} as const;

function BrandStar({
  tone,
  className,
}: {
  tone: BrandLoaderTone;
  className?: string;
}) {
  return (
    <svg
      viewBox={LEONICE_STAR_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn("leonice-star size-[1.15em] shrink-0", className)}
      data-tone={tone}
    >
      <path d={LEONICE_STAR} fill="currentColor" />
    </svg>
  );
}

function BrandMark({
  tone,
  size,
  halo,
}: {
  tone: BrandLoaderTone;
  size: string;
  halo: string;
}) {
  const uid = useId().replace(/:/g, "");
  const sheen = `leonice-sheen-${uid}`;
  const clip = `leonice-clip-${uid}`;
  const glow = `leonice-glow-${uid}`;
  const colors = TONES[tone];

  return (
    <span className="relative inline-grid place-items-center" data-tone={tone}>
      <span aria-hidden="true" className={halo} />
      <svg
        viewBox={LEONICE_MARK_VIEWBOX}
        aria-hidden="true"
        focusable="false"
        className={cn("relative h-auto overflow-visible", size)}
      >
        <defs>
          <linearGradient
            id={sheen}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientTransform="rotate(18 0.5 0.5)"
          >
            <stop offset="0" stopColor="#fff8e6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff8e6" stopOpacity="0.7" />
            <stop offset="1" stopColor="#fff8e6" stopOpacity="0" />
          </linearGradient>
          <clipPath id={clip}>
            <path d={LEONICE_FLAME} />
            <path d={LEONICE_PROFILE} />
          </clipPath>
          <filter id={glow} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        {LEONICE_LEAVES.map((d, index) => (
          <path
            key={d.slice(0, 24)}
            d={d}
            fill={colors.leaf}
            className="leonice-loader__leaf"
            style={{ animationDelay: LEAF_DELAYS[index] }}
          />
        ))}
        <path d={LEONICE_FLAME} fill={colors.gold} />
        <path d={LEONICE_PROFILE} fill={colors.gold} />
        <g clipPath={`url(#${clip})`}>
          <rect
            x="-60"
            y="0"
            width="90"
            height="260"
            fill={`url(#${sheen})`}
            className="leonice-loader__sheen"
          />
        </g>
        <path
          d={LEONICE_STAR}
          fill="#f3d79b"
          filter={`url(#${glow})`}
          className="leonice-loader__star-glow"
        />
        <path
          d={LEONICE_STAR}
          fill={colors.star}
          className="leonice-loader__star"
        />
      </svg>
    </span>
  );
}

export function BrandLoader({
  variant = "section",
  tone = "light",
  label = "Cargando…",
  decorative = false,
  className,
}: BrandLoaderProps) {
  if (variant === "inline") {
    if (decorative) {
      return <BrandStar tone={tone} className={className} />;
    }
    return (
      <span role="status" className="inline-flex items-center">
        <BrandStar tone={tone} className={className} />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  const layout = LAYOUTS[variant];
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("leonice-loader", layout.wrapper, className)}
    >
      <BrandMark tone={tone} size={layout.mark} halo={layout.halo} />
      <p
        className={cn(
          "font-sans tracking-wide",
          layout.caption,
          TONES[tone].caption,
        )}
      >
        {label}
      </p>
    </div>
  );
}
