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
    success:
      "Enlace de cancelación copiado. Puedes pegarlo en el chat del cliente.",
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
  createRecipient: {
    success: "Destinatario agregado. Recibirá los avisos por WhatsApp.",
    error: "No se pudo agregar el destinatario",
  },
  updateRecipient: {
    success: "Destinatario actualizado.",
    error: "No se pudo actualizar el destinatario",
  },
  activateRecipient: {
    success: "Avisos activados para este número.",
    error: "No se pudieron activar los avisos",
  },
  deactivateRecipient: {
    success: "Avisos pausados para este número.",
    error: "No se pudieron pausar los avisos",
  },
  changePassword: {
    success: "Contraseña actualizada. Vuelve a iniciar sesión con la nueva.",
    error: "No se pudo cambiar la contraseña",
  },
  updateBaseSchedule: {
    success: "Horario semanal actualizado. El calendario y el bot ya lo usan.",
    error: "No se pudo guardar el horario semanal",
  },
  createCategory: {
    success: "Categoría creada.",
    error: "No se pudo crear la categoría",
  },
  updateCategory: {
    success: "Categoría actualizada.",
    error: "No se pudo actualizar la categoría",
  },
  activateCategory: {
    success: "Categoría activada. Sus servicios activos vuelven a ofrecerse.",
    error: "No se pudo activar la categoría",
  },
  deactivateCategory: {
    success: "Categoría desactivada. Ya no se ofrece para nuevas reservas.",
    error: "No se pudo desactivar la categoría",
  },
  createTreatment: {
    success: "Servicio creado y disponible para reservas.",
    error: "No se pudo crear el servicio",
  },
  updateTreatment: {
    success: "Servicio actualizado.",
    error: "No se pudo actualizar el servicio",
  },
  activateTreatment: {
    success: "Servicio activado. Vuelve a ofrecerse para reservas.",
    error: "No se pudo activar el servicio",
  },
  deactivateTreatment: {
    success: "Servicio desactivado. Las reservas existentes se conservan.",
    error: "No se pudo desactivar el servicio",
  },
  saveHairPricing: {
    success: "Precios por cabello guardados.",
    error: "No se pudieron guardar los precios por cabello",
  },
  createCapacityPool: {
    success: "Capacidad agregada a la estación.",
    error: "No se pudo crear la capacidad",
  },
  updateCapacityPool: {
    success: "Capacidad actualizada.",
    error: "No se pudo actualizar la capacidad",
  },
  deactivateCapacityPool: {
    success: "Capacidad desactivada.",
    error: "No se pudo desactivar la capacidad",
  },
  activateCapacityPool: {
    success: "Capacidad activada.",
    error: "No se pudo activar la capacidad",
  },
  createPromotion: {
    success: "Promoción creada.",
    error: "No se pudo crear la promoción",
  },
  updatePromotion: {
    success: "Promoción actualizada.",
    error: "No se pudo actualizar la promoción",
  },
  deactivatePromotion: {
    success: "Promoción desactivada.",
    error: "No se pudo desactivar la promoción",
  },
} as const satisfies Record<string, ActionMessages>;

export type AdminActionKey = keyof typeof ADMIN_ACTION_MESSAGES;
