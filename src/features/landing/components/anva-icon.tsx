import type { SVGProps } from "react";

const UNITS_PER_PIXEL = 1580 / 36;

interface AnvaIconProps extends Omit<SVGProps<SVGSVGElement>, "strokeWidth"> {
  strokeWidth?: number;
}

export function AnvaIcon({ strokeWidth = 1.5, ...props }: AnvaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-40 -40 1580 830"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth * UNITS_PER_PIXEL}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M 15 725 C 90 725 150 690 210 640 C 130 620 90 560 150 500 C 190 465 240 450 300 435 C 340 370 380 270 410 160 C 420 100 430 60 430 55" />
      <path d="M 430 55 C 440 150 460 300 490 430 C 510 520 540 570 570 580 C 610 590 640 540 650 500" />
      <path d="M 300 440 L 450 425" />
      <path d="M 625 380 C 660 395 675 480 692 590" />
      <path d="M 680 470 C 700 380 755 305 800 310 C 835 315 830 360 810 420 C 785 490 765 540 785 580 C 800 605 822 580 822 552" />
      <path d="M 830 215 C 880 140 940 130 985 180 C 1040 260 1055 420 1050 520 C 1048 580 1042 625 1040 640 C 1130 360 1260 120 1380 30 C 1430 -5 1480 20 1485 70" />
      <path d="M 1250 350 C 1190 380 1150 470 1160 550 C 1165 585 1195 570 1225 540 C 1255 510 1278 460 1298 420 C 1310 435 1300 500 1312 535 C 1322 560 1340 525 1350 515" />
    </svg>
  );
}
