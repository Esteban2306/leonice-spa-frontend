export const FRIENDLY_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  VALIDATION_FAILED: "Revisa los datos ingresados: hay campos inválidos.",
  UNAUTHORIZED: "Tu sesión terminó. Vuelve a iniciar sesión.",
  FORBIDDEN: "No tienes permiso para realizar esta acción.",
  CSRF_INVALID:
    "La sesión de seguridad expiró. Recarga la página e inténtalo de nuevo.",
  NOT_FOUND: "No encontramos ese registro. Puede que ya no exista.",
  RATE_LIMITED:
    "Se hicieron demasiadas solicitudes seguidas. Espera un momento.",
  SERVICE_UNAVAILABLE: "El servicio no está disponible en este momento.",
  INTERNAL_ERROR: "Ocurrió un error inesperado en el servidor.",
  IDEMPOTENCY_IN_PROGRESS:
    "Esta acción ya se está procesando. Espera unos segundos.",
  DEPOSIT_AMOUNT_REQUIRED:
    "Indica el monto que entregó el cliente para aprobar el depósito.",
  DEPOSIT_NOT_PENDING:
    "Este depósito ya fue revisado por otra persona o proceso.",
  DEPOSIT_CONCURRENT_CHANGE:
    "El depósito cambió mientras lo aprobabas. Revisa su estado actual.",
  RESERVATION_INVALID_TRANSITION:
    "La reserva ya no está en un estado que permita esta acción.",
  RESERVATION_CONCURRENT_CHANGE:
    "La reserva cambió mientras se procesaba. Revisa su estado actual.",
  RESERVATION_CHECK_IN_NOT_TODAY:
    "El check-in solo se puede hacer el día de la cita.",
  RESERVATION_NOT_REVIVABLE:
    "Solo se pueden reactivar reservas canceladas por vencimiento del depósito.",
  RESERVATION_REVIVE_SLOT_IN_PAST: "La cita ya pasó: no se puede reactivar.",
  RESERVATION_REVIVE_NO_CAPACITY:
    "El horario ya no tiene cupo para reactivar esta reserva.",
  RESERVATION_CANCEL_TOO_LATE: "La cita ya empezó; no se puede cancelar.",
  RESERVATION_NOT_CANCELLABLE: "Esta reserva ya no se puede cancelar.",
  SCHEDULE_EXCEPTION_IN_THE_PAST:
    "No se puede modificar el horario de un día que ya pasó.",
  SCHEDULE_EXCEPTION_INVALID_RANGE:
    "La hora de inicio debe ser anterior a la hora de fin.",
  DATE_RANGE_INVALID: "El rango de fechas no es válido.",
};
