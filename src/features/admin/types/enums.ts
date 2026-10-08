export type ReservationStatus =
  | "SOLICITUD_INICIADA"
  | "PENDIENTE_VALORACION"
  | "PENDIENTE_DEPOSITO"
  | "CONFIRMADA"
  | "CITA_EN_CURSO"
  | "COMPLETADA"
  | "CANCELADA"
  | "REPROGRAMADA"
  | "NO_SHOW";

export type ReservationChannel = "WEB" | "WHATSAPP";

export type CancellationSource = "CLIENT" | "ADMIN" | "TIMEOUT";

export type ScheduleExceptionType = "BLOCK" | "OPEN";

export type DepositStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "RECHAZADO"
  | "CONVERTIDO_A_CREDITO";

export type DepositVerificationMethod = "MANUAL" | "AUTOMATICO";

export type DepositCoverage = "ANTICIPO" | "PAGO_COMPLETO";

export type HairLength = "CORTO" | "MEDIANO" | "LARGO";

export type HairColor = "CLARO" | "OSCURO";
