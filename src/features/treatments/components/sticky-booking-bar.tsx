"use client";

import { useEffect, useState } from "react";

import { BookingLink } from "@/src/features/landing/components/action-link";

interface StickyBookingBarProps {
  watchId: string;
  title: string;
  detail: string | null;
  message: string;
  actionLabel: string;
}

export function StickyBookingBar({ watchId, title, detail, message, actionLabel }: StickyBookingBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = document.getElementById(watchId);
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "0px 0px -40% 0px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-3 bottom-3 z-40 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] desk:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-3 rounded-full bg-[#062112]/95 py-2 pl-5 pr-2 shadow-[0_12px_32px_-12px_rgb(6_33_18/0.6)] backdrop-blur-md">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-sans text-sm font-bold text-[#F2EBDB]">{title}</span>
          {detail && <span className="truncate font-sans text-xs tabular-nums text-[#E0BC87]">{detail}</span>}
        </div>
        <BookingLink variant="sand" size="sm" arrow={false} message={message}>
          {actionLabel}
        </BookingLink>
      </div>
    </div>
  );
}
