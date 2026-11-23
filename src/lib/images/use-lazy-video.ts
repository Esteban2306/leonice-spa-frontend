"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

import { cloudinaryVideo, videoPoster, videoWidthFor } from "@/src/lib/images/cloudinary-loader";

const PRELOAD_MARGIN = "200px";

const subscribeNoop = () => () => {};
const clientWidth = () => videoWidthFor(window.innerWidth);
const serverWidth = () => null;

export function useLazyVideo(
  ref: RefObject<HTMLVideoElement | null>,
  videoUrl: string,
  posterUrl: string | null,
) {
  const width = useSyncExternalStore(subscribeNoop, clientWidth, serverWidth);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, visible]);

  return {
    src: visible && width ? cloudinaryVideo(videoUrl, width) : undefined,
    poster: width ? videoPoster(videoUrl, posterUrl, width) : undefined,
  };
}
