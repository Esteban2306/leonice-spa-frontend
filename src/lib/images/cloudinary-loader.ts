import type { ImageLoaderProps } from "next/image";

const CLOUDINARY_PREFIX = "https://res.cloudinary.com/";
const UPLOAD_SEGMENT = "/image/upload/";
const VERSION_SEGMENT = /^v\d+$/;

export function cloudinaryDelivery(src: string, width: number): string {
  if (!src.startsWith(CLOUDINARY_PREFIX)) return src;
  const uploadAt = src.indexOf(UPLOAD_SEGMENT);
  if (uploadAt === -1) return src;

  const head = src.slice(0, uploadAt + UPLOAD_SEGMENT.length);
  const segments = src.slice(head.length).split("/");
  const versionAt = segments.findIndex((segment) => VERSION_SEGMENT.test(segment));
  const insertAt = versionAt === -1 ? 0 : versionAt;
  segments.splice(insertAt, 0, `f_auto,q_auto,c_limit,w_${width}`);
  return head + segments.join("/");
}

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  return cloudinaryDelivery(src, width);
}
