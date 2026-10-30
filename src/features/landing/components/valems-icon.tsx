import type { SVGProps } from "react";

const UNITS_PER_PIXEL = 172 / 44;

interface ValemsIconProps extends Omit<SVGProps<SVGSVGElement>, "strokeWidth"> {
  strokeWidth?: number;
}

export function ValemsIcon({ strokeWidth = 1, ...props }: ValemsIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-8 -10 172 62"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * UNITS_PER_PIXEL}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform="translate(10 0) skewX(-14)">
        <g transform="translate(0 0)">
          <path d="M1 0 L13 40 L25 0" />
        </g>
        <g transform="translate(30 0)">
          <path d="M18 16 V40 M18 28 C18 21 14 16 10 16 C5 16 2 21 2 28 C2 35 5 40 10 40 C14 40 18 35 18 28" />
        </g>
        <g transform="translate(53 0)">
          <path d="M2 2 V36 C2 39 4 40 7 40" />
        </g>
        <g transform="translate(63 0)">
          <path d="M2 28 H20 C20 20 16 16 11 16 C5 16 2 21 2 28 C2 35 5 40 11 40 C15 40 18 38 20 35" />
        </g>
        <g transform="translate(89 0)">
          <path d="M2 16 V40 M2 26 C2 19 5 16 9 16 C14 16 16 19 16 25 V40 M16 25 C16 19 19 16 23 16 C28 16 30 19 30 25 V40" />
        </g>
        <g transform="translate(125 0)">
          <path d="M17 20 C15 17 13 16 10 16 C5 16 3 19 3 22 C3 26 7 27 10 28 C14 29 18 30 18 34 C18 38 15 40 10 40 C6 40 3 38 2 35" />
        </g>
      </g>
    </svg>
  );
}
