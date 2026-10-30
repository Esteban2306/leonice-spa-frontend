import type { SVGProps } from "react";

const UNITS_PER_PIXEL = 150 / 44;

interface LmarIconProps extends Omit<SVGProps<SVGSVGElement>, "strokeWidth"> {
  strokeWidth?: number;
}

export function LmarIcon({ strokeWidth = 1, ...props }: LmarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 150 56"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * UNITS_PER_PIXEL}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform="translate(0 0)">
        <path d="M2 0 V40 H22" />
      </g>
      <g transform="translate(28 0)">
        <path d="M2 0 V8" />
      </g>
      <g transform="translate(40 0)">
        <path d="M2 40 V0 L12 24 L22 0 V40" />
      </g>
      <g transform="translate(76 0)">
        <path d="M0 40 L12 0 L24 40 M4 27 H20" />
      </g>
      <g transform="translate(112 0)">
        <path d="M2 40 V0 H14 C21 0 22 4 22 9.5 C22 15 21 19 14 19 H2 M13 19 L22 40" />
      </g>
    </svg>
  );
}
