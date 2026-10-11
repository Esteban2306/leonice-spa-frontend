import type { CSSProperties, ReactNode } from "react";

export interface CircularCarouselItem {
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
}

export interface CircularCarouselProps<T extends CircularCarouselItem = CircularCarouselItem> {
  items?: T[];
  preset?: "cylinder" | "orbit" | "wheel" | "panorama";
  intro?: "assemble" | "rise" | "spin" | "none";
  cardWidth?: number;
  aspectRatio?: number;
  gap?: number;
  curve?: number;
  tilt?: number;
  perspective?: number;
  autoplay?: "drift" | "step" | "off";
  speed?: number;
  interval?: number;
  direction?: "left" | "right" | "up" | "down";
  draggable?: boolean;
  momentum?: number;
  snap?: boolean;
  pauseOnHover?: boolean;
  focusOnClick?: boolean;
  parallax?: number;
  stretch?: number;
  depthFade?: number;
  fadeColor?: string;
  innerShade?: number;
  cornerRadius?: number;
  captions?: boolean;
  onChange?: (index: number) => void;
  onItemClick?: (item: T, index: number) => void;
  renderFace?: (item: T, index: number) => ReactNode;
  ariaLabel?: string;
  ofLabel?: string;
  className?: string;
  style?: CSSProperties;
}

export default function CircularCarousel<T extends CircularCarouselItem>(
  props: CircularCarouselProps<T>,
): ReactNode;
