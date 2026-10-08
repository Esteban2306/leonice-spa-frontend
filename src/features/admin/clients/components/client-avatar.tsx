import { getInitials } from "../lib/client-crm";

interface ClientInitialsAvatarProps {
  name: string;
  size?: "md" | "lg";
}

const SIZES = {
  md: "size-11 text-base",
  lg: "size-16 text-xl md:size-20 md:text-2xl",
} as const;

export function ClientInitialsAvatar({ name, size = "md" }: ClientInitialsAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-tertiary font-heading text-secondary ${SIZES[size]}`}
    >
      {getInitials(name)}
    </span>
  );
}
