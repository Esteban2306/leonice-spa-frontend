interface ClientAvatarProps {
  name: string;
  size?: "md" | "lg";
}

const SIZE_CLASSES = {
  md: "size-11 text-lg",
  lg: "size-14 text-2xl",
} as const;

export function ClientAvatar({ name, size = "md" }: ClientAvatarProps) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "?";

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-quaternary/30 font-sans font-medium text-secondary/70 ${SIZE_CLASSES[size]}`}
    >
      {initial}
    </div>
  );
}
