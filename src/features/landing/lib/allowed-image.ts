const ALLOWED_IMAGE_HOST = "res.cloudinary.com";
const ALLOWED_IMAGE_PATH = "/exyhq5ry/";

export function allowedImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" &&
      parsed.hostname === ALLOWED_IMAGE_HOST &&
      parsed.pathname.startsWith(ALLOWED_IMAGE_PATH)
      ? url
      : null;
  } catch {
    return null;
  }
}
