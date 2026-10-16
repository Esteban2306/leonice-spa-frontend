export const UPLOAD_MAX_SIDE = 1600;
export const UPLOAD_SKIP_BYTES = 250 * 1024;
export const UPLOAD_QUALITY = 0.85;

export function fitWithin(
  width: number,
  height: number,
  maxSide: number = UPLOAD_MAX_SIDE,
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxSide) return { width, height };
  const scale = maxSide / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function needsShrinking(
  size: number,
  width: number,
  height: number,
): boolean {
  return size > UPLOAD_SKIP_BYTES || Math.max(width, height) > UPLOAD_MAX_SIDE;
}

function webpName(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, "") || "foto";
  return `${base}.webp`;
}

function encode(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", UPLOAD_QUALITY),
  );
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (typeof window === "undefined" || typeof createImageBitmap !== "function")
    return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    if (!needsShrinking(file.size, bitmap.width, bitmap.height)) return file;

    const target = fitWithin(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = target.width;
    canvas.height = target.height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, target.width, target.height);

    const blob = await encode(canvas);
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size)
      return file;
    return new File([blob], webpName(file.name), {
      type: "image/webp",
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}
