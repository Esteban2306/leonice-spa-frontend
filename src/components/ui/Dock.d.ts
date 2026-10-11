import type { CSSProperties, ReactNode } from "react";

export interface DockMenuRow {
  label?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  items?: DockMenuRow[];
  separator?: boolean;
  checked?: boolean;
  disabled?: boolean;
}

export interface DockItem {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number | boolean;
  className?: string;
  menu?: DockMenuRow[];
  separator?: boolean;
}

export interface DockProps {
  items?: DockItem[];
  position?: "bottom" | "top" | "left" | "right";
  theme?: "dark" | "light";
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  gap?: number;
  roundness?: number;
  spring?: { mass?: number; stiffness?: number; damping?: number };
  bounce?: boolean;
  autoHide?: boolean;
  tiles?: boolean;
  showLabels?: boolean;
  showIndicators?: boolean;
  showBadges?: boolean;
  badgeColor?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Dock(props: DockProps): ReactNode;
