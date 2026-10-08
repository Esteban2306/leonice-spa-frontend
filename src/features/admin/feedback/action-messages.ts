export interface ActionMessages {
  success: string;
  error: string;
}

export const ADMIN_ACTION_MESSAGES = {
  approveDeposit: {
    success: "Depósito aprobado. La reserva quedó confirmada.",
    error: "No se pudo aprobar el depósito",
  },
  rejectDeposit: {
    success: "Comprobante rechazado. Se avisó al cliente.",
    error: "No se pudo rechazar el comprobante",
  },
  cancelReservation: {
    success: "Reserva cancelada. El horario quedó libre.",
    error: "No se pudo cancelar la reserva",
  },
  checkIn: {
    success: "Check-in registrado. La cita está en curso.",
    error: "No se pudo registrar el check-in",
  },
  complete: {
    success: "Cita completada.",
    error: "No se pudo completar la cita",
  },
  revive: {
    success: "Reserva reactivada. Vuelve a esperar el depósito.",
    error: "No se pudo reactivar la reserva",
  },
  sendCancellationLink: {
    success: "Enlace de cancelación enviado al cliente por WhatsApp.",
    error: "No se pudo enviar el enlace de cancelación",
  },
  copyCancellationLink: {
    success: "Enlace de cancelación copiado. Puedes pegarlo en el chat del cliente.",
    error: "No se pudo generar el enlace de cancelación",
  },
  createReservation: {
    success: "Reserva creada. Quedó esperando el depósito del cliente.",
    error: "No se pudo crear la reserva",
  },
  rescheduleReservation: {
    success: "Reserva reagendada.",
    error: "No se pudo reagendar la reserva",
  },
  createClient: {
    success: "Cliente creado.",
    error: "No se pudo crear el cliente",
  },
  updateClient: {
    success: "Perfil del cliente actualizado.",
    error: "No se pudo guardar el perfil",
  },
  setHairProfile: {
    success: "Perfil capilar actualizado. Queda vigente por 4 meses.",
    error: "No se pudo guardar el perfil capilar",
  },
  confirmHairProfile: {
    success: "Vigencia del perfil capilar renovada por 4 meses.",
    error: "No se pudo confirmar el perfil capilar",
  },
  recordConsent: {
    success: "Consentimiento registrado.",
    error: "No se pudo registrar el consentimiento",
  },
  blockSchedule: {
    success: "Horario bloqueado. Ya no se ofrecerá para reservas.",
    error: "No se pudo bloquear el horario",
  },
  openSchedule: {
    success: "Horario extra habilitado para reservas.",
    error: "No se pudo habilitar el horario extra",
  },
  removeScheduleException: {
    success: "Excepción de horario eliminada.",
    error: "No se pudo quitar la excepción de horario",
  },
} as const satisfies Record<string, ActionMessages>;

export type AdminActionKey = keyof typeof ADMIN_ACTION_MESSAGES;
