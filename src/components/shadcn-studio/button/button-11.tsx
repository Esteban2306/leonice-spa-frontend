import type { ComponentProps } from "react";

import { Button } from "../../ui/button";

type GradientColor = "primary" | "secondary" | "tertiary" | "quaternary";

interface GradientButtonProps extends ComponentProps<typeof Button> {
  text: string;
  gradient?: GradientColor;
}

const gradientClasses: Record<GradientColor, string> = {
  primary: "from-primary via-primary/60 to-primary",
  secondary: "from-secondary via-secondary/60 to-secondary",
  tertiary: "from-tertiary via-tertiary/60 to-tertiary",
  quaternary: "from-quaternary via-quaternary/60 to-quaternary",
};

export function GradientButton({
  text,
  gradient = "primary",
  className,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      className={`font-sans border-0 bg-transparent bg-linear-to-r bg-size-[200%_auto] hover:bg-transparent hover:bg-position-[99%_center] ${gradientClasses[gradient]} ${className ?? ""}`}
      {...props}
    >
      {text}
    </Button>
  );
}
