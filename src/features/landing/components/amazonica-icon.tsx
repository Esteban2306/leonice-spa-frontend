import type { SVGProps } from "react";

const VIEWBOX_RATIO = 64 / 24;

interface AmazonicaIconProps extends Omit<SVGProps<SVGSVGElement>, "strokeWidth"> {
  strokeWidth?: number;
}

export function AmazonicaIcon({ strokeWidth = 2, ...props }: AmazonicaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * VIEWBOX_RATIO}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="32" cy="32" r="29" />
      <polyline points="24.5,21 32,13.5 39.5,21" />
      <ellipse cx="32" cy="39" rx="10" ry="12.5" />
    </svg>
  );
}
