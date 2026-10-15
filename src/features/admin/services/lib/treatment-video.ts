export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function validateVideoFile(file: File): string | null {
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) return "Usa un video MP4, WebM o MOV.";
  if (file.size > MAX_VIDEO_BYTES) return "El video pesa más de 100 MB.";
  return null;
}
