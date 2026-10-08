import { HttpError } from "../api/http-error";
import { FRIENDLY_ERROR_MESSAGES } from "./error-messages";

export interface NormalizedError {
  status: number | null;
  code: string | null;
  message: string;
  details: unknown;
}

const NETWORK_MESSAGE =
  "No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.";

function fallbackForStatus(status: number): string {
  if (status >= 500) return FRIENDLY_ERROR_MESSAGES.INTERNAL_ERROR;
  if (status === 404) return FRIENDLY_ERROR_MESSAGES.NOT_FOUND;
  if (status === 403) return FRIENDLY_ERROR_MESSAGES.FORBIDDEN;
  if (status === 401) return FRIENDLY_ERROR_MESSAGES.UNAUTHORIZED;
  return "La solicitud no se pudo completar.";
}

function isGenericServerMessage(message: string): boolean {
  return message.length === 0 || /^HTTP Error \d+$/.test(message);
}

export function normalizeError(error: unknown): NormalizedError {
  if (error instanceof HttpError) {
    const friendly = error.code
      ? FRIENDLY_ERROR_MESSAGES[error.code]
      : undefined;
    const serverMessage = isGenericServerMessage(error.message)
      ? null
      : error.message;

    return {
      status: error.status,
      code: error.code,
      message: friendly ?? serverMessage ?? fallbackForStatus(error.status),
      details: error.details,
    };
  }

  if (error instanceof TypeError) {
    return {
      status: null,
      code: null,
      message: NETWORK_MESSAGE,
      details: null,
    };
  }

  return {
    status: null,
    code: null,
    message:
      error instanceof Error && error.message
        ? error.message
        : FRIENDLY_ERROR_MESSAGES.INTERNAL_ERROR,
    details: null,
  };
}
