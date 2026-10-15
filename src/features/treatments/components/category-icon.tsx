import {
  Droplets,
  Flower2,
  Hand,
  Leaf,
  Sparkles,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  droplets: Droplets,
  flower: Flower2,
  hand: Hand,
  leaf: Leaf,
  sparkles: Sparkles,
  waves: Waves,
  wind: Wind,
};

export function CategoryIcon({
  iconKey,
  className = "size-6",
}: {
  iconKey: string | null;
  className?: string;
}) {
  const Icon = (iconKey && ICONS[iconKey]) || Sparkles;
  return <Icon className={className} strokeWidth={1.4} aria-hidden="true" />;
}
