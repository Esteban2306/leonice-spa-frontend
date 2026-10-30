import type { SVGProps } from "react";

const UNITS_PER_PIXEL = 124 / 36;

interface MaisIconProps extends Omit<SVGProps<SVGSVGElement>, "strokeWidth"> {
  strokeWidth?: number;
}

export function MaisIcon({ strokeWidth = 1, ...props }: MaisIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 124 56"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * UNITS_PER_PIXEL}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform="translate(0 0)">
        <path d="M2 40 V0 L12 24 L22 0 V40" />
      </g>
      <g transform="translate(36 0)">
        <path d="M0 40 L12 0 L24 40 M4 27 H20" />
      </g>
      <g transform="translate(72 0)">
        <path d="M2 14 V40 M2 2 V3" />
      </g>
      <g transform="translate(84 0)">
        <path d="M22 8 C20 3 17 0 12 0 C6 0 2 3 2 9 C2 15 7 18 12 20 C17 22 22 25 22 31 C22 37 18 40 12 40 C6 40 3 37 2 32" />
      </g>
    </svg>
  );
}
