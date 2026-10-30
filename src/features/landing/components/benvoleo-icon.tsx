import type { SVGProps } from "react";

const UNITS_PER_PIXEL = 232 / 52;

interface BenvoleoIconProps extends Omit<SVGProps<SVGSVGElement>, "strokeWidth"> {
  strokeWidth?: number;
}

export function BenvoleoIcon({ strokeWidth = 0.9, ...props }: BenvoleoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -10 232 62"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * UNITS_PER_PIXEL}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform="translate(10 0) skewX(-14)">
        <g transform="translate(0 0)">
          <path d="M2 0 V40 M2 0 H12 C19 0 21 4 21 10 C21 16 18 19 12 19 H2 M12 19 C20 19 24 23 24 29.5 C24 36 20 40 12 40 H2" />
        </g>
        <g transform="translate(30 0)">
          <path d="M2 28 H20 C20 20 16 16 11 16 C5 16 2 21 2 28 C2 35 5 40 11 40 C15 40 18 38 20 35" />
        </g>
        <g transform="translate(56 0)">
          <path d="M2 16 V40 M2 26 C2 19 6 16 11 16 C17 16 19 20 19 26 V40" />
        </g>
        <g transform="translate(81 0)">
          <path d="M1 16 L10 40 L19 16" />
        </g>
        <g transform="translate(105 0)">
          <ellipse cx="11" cy="28" rx="9" ry="12" />
        </g>
        <g transform="translate(131 0)">
          <path d="M2 2 V36 C2 39 4 40 7 40" />
        </g>
        <g transform="translate(143 0)">
          <path d="M2 28 H20 C20 20 16 16 11 16 C5 16 2 21 2 28 C2 35 5 40 11 40 C15 40 18 38 20 35" />
        </g>
        <g transform="translate(169 0)">
          <ellipse cx="11" cy="28" rx="9" ry="12" />
          <path d="M15 14 C15 8 20 4 27 5 C26 12 21 16 15 14 Z" />
          <path d="M16 13 L24 7" />
        </g>
      </g>
    </svg>
  );
}
