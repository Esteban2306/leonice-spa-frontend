import type { ReactNode } from "react";

export interface AccordionGalleryItem {
  image?: string;
  label: string;
  alt?: string;
  link?: string;
  icon?: ReactNode;
  description?: ReactNode;
  hint?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number | string;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  persistentLabels?: boolean;
  fill?: boolean;
  renderMedia?: (item: AccordionGalleryItem, index: number) => ReactNode;
  ariaLabel?: string;
  className?: string;
}

export default function AccordionGallery(props: AccordionGalleryProps): ReactNode;
