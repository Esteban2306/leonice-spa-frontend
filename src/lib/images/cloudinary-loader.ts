import type { ImageLoaderProps } from "next/image";

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/";
const IMAGE_UPLOAD = "/image/upload/";
const VIDEO_UPLOAD = "/video/upload/";
const VERSION_SEGMENT = /^v\d+$/;

export const MAX_DELIVERY_WIDTH = 1280;
export const MOBILE_VIDEO_WIDTH = 720;
export const MOBILE_BREAKPOINT = 768;

function withTransformation(src: string, upload: string, transformation: string): string | null {
  if (!src.startsWith(CLOUDINARY_PREFIX)) return null;
  const uploadAt = src.indexOf(upload);
  if (uploadAt === -1) return null;
  const head = src.slice(0, uploadAt + upload.length);
  const segments = src.slice(head.length).split("/");
  const versionAt = segments.findIndex((segment) => VERSION_SEGMENT.test(segment));
  segments.splice(versionAt === -1 ? 0 : versionAt, 0, transformation);
  return head + segments.join("/");
}

function deliveryWidth(width: number): number {
  return Math.min(Math.max(Math.round(width), 1), MAX_DELIVERY_WIDTH);
}

export function cloudinaryDelivery(src: string, width: number): string {
  return withTransformation(src, IMAGE_UPLOAD, `f_auto,q_auto,c_limit,w_${deliveryWidth(width)}`) ?? src;
}

export function cloudinaryVideo(src: string, width: number): string {
  return (
    withTransformation(src, VIDEO_UPLOAD, `f_auto,q_auto,vc_auto,c_limit,w_${deliveryWidth(width)}`) ?? src
  );
}

export function cloudinaryVideoPoster(src: string, width: number): string | null {
  const poster = withTransformation(src, VIDEO_UPLOAD, `so_0,f_auto,q_auto,c_limit,w_${deliveryWidth(width)}`);
  return poster ? poster.replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg") : null;
}

export function videoWidthFor(viewportWidth: number): number {
  return viewportWidth < MOBILE_BREAKPOINT ? MOBILE_VIDEO_WIDTH : MAX_DELIVERY_WIDTH;
}

export function videoPoster(videoUrl: string, posterUrl: string | null, width: number): string | undefined {
  if (posterUrl) return cloudinaryDelivery(posterUrl, width);
  return cloudinaryVideoPoster(videoUrl, width) ?? undefined;
}

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  if (src.startsWith("/") && !src.startsWith("//")) {
    return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
  }
  return cloudinaryDelivery(src, width);
}
