import type { SVGProps } from "react";

const UNITS_PER_PIXEL = 328 / 52;

interface AlterEgoIconProps extends Omit<SVGProps<SVGSVGElement>, "strokeWidth"> {
  strokeWidth?: number;
}

export function AlterEgoIcon({ strokeWidth = 0.9, ...props }: AlterEgoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -8 328 56"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * UNITS_PER_PIXEL}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform="translate(0 0)">
        <path d="M0 40 L12 0 L24 40 M4 27 H20" />
      </g>
      <g transform="translate(36 0)">
        <path d="M2 0 V40 H22" />
      </g>
      <g transform="translate(72 0)">
        <path d="M0 0 H24 M12 0 V40" />
      </g>
      <g transform="translate(108 0)">
        <path d="M22 0 H2 V40 H22 M2 20 H18" />
      </g>
      <g transform="translate(144 0)">
        <path d="M2 40 V0 H14 C21 0 22 4 22 9.5 C22 15 21 19 14 19 H2 M13 19 L22 40" />
      </g>
      <g transform="translate(216 0)">
        <path d="M22 0 H2 V40 H22 M2 20 H18" />
      </g>
      <g transform="translate(252 0)">
        <path d="M22 7 C20 2.5 17 0 12 0 C5 0 2 8 2 20 C2 32 5 40 12 40 C19 40 22 35 22 28 V21 H13" />
      </g>
      <g transform="translate(288 0)">
        <ellipse cx="12" cy="20" rx="10" ry="20" />
      </g>
    </svg>
  );
}
