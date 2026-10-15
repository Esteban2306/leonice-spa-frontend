"use client";

import { useRef, type ReactNode } from "react";

import { useSectionStack } from "@/src/features/landing/motion/use-section-stack";

import "@/src/features/landing/section-stack.css";

export function SectionStack({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  useSectionStack(mainRef);
  return <main ref={mainRef}>{children}</main>;
}
