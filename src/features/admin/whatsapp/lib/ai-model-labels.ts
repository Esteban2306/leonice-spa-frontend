import type { AiModelRole } from "@/src/features/admin/types/conduit.types";

export const AI_MODEL_ROLE_LABELS: Record<AiModelRole, string> = {
  CONVERSATION: "Conversación",
  IMAGE_ANALYSIS: "Imágenes",
  FALLBACK: "Respaldo",
  CLASSIFIER: "Clasificador",
  TRANSCRIPTION: "Audios",
};
