import {
  Award,
  Camera,
  Droplet,
  HandHeart,
  House,
  Leaf,
  ScanSearch,
  Sofa,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { LandingIcon as LandingIconName } from "@/src/features/landing/content/landing-content";

const ICONS: Record<LandingIconName, LucideIcon> = {
  lounge: Sofa,
  leaf: Leaf,
  drop: Droplet,
  award: Award,
  camera: Camera,
  scan: ScanSearch,
  sparkles: Sparkles,
  hands: HandHeart,
  home: House,
};

export function LandingIcon({
  name,
  className = "size-6",
}: {
  name: LandingIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} strokeWidth={1.4} aria-hidden="true" />;
}
