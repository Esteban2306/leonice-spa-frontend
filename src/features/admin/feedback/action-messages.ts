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
  conduitConnect: {
    success:
      "Conexión iniciada. Escanea el código QR desde el teléfono del spa.",
    error: "No se pudo iniciar la conexión",
  },
  conduitReconnect: {
    success: "Generamos un código QR nuevo.",
    error: "No se pudo reconectar",
  },
  conduitDisconnect: {
    success: "WhatsApp quedó desconectado.",
    error: "No se pudo desconectar",
  },
  conduitWarmup: {
    success: "Nivel de calentamiento actualizado.",
    error: "No se pudo cambiar el nivel de calentamiento",
  },
  conduitCampaignPolicy: {
    success: "Política anti-bloqueo actualizada.",
    error: "No se pudo cambiar la política anti-bloqueo",
  },
  conduitBotOn: {
    success: "Asistente encendido. Vuelve a responder a las clientas.",
    error: "No se pudo encender el asistente",
  },
  conduitBotOff: {
    success: "Asistente apagado. Los recordatorios siguen saliendo.",
    error: "No se pudo apagar el asistente",
  },
  conduitBotSettings: {
    success: "Ajustes del asistente guardados.",
    error: "No se pudieron guardar los ajustes del asistente",
  },
  conduitPersonality: {
    success: "Personalidad del asistente guardada.",
    error: "No se pudo guardar la personalidad",
  },
  conduitPrompt: {
    success: "Instrucciones guardadas. Aplican desde el próximo mensaje.",
    error: "No se pudieron guardar las instrucciones",
  },
  conduitAddModel: {
    success: "Modelo de IA agregado.",
    error: "No se pudo agregar el modelo de IA",
  },
  conduitRemoveModel: {
    success: "Modelo de IA quitado.",
    error: "No se pudo quitar el modelo de IA",
  },
  conduitResetModel: {
    success: "Modelo de IA reactivado.",
    error: "No se pudo reactivar el modelo de IA",
  },
  conduitToolOn: {
    success: "Herramienta activada.",
    error: "No se pudo activar la herramienta",
  },
  conduitToolOff: {
    success: "Herramienta desactivada.",
    error: "No se pudo desactivar la herramienta",
  },
  conduitAddEscalation: {
    success: "Contacto agregado. Recibirá los avisos del asistente.",
    error: "No se pudo agregar el contacto",
  },
  conduitRemoveEscalation: {
    success: "Contacto quitado.",
    error: "No se pudo quitar el contacto",
  },
  conduitReply: {
    success: "Mensaje enviado. El asistente queda en pausa en este chat.",
    error: "No se pudo enviar el mensaje",
  },
  conduitPause: {
    success: "Asistente en pausa en este chat.",
    error: "No se pudo pausar el asistente",
  },
  conduitResume: {
    success: "Asistente reanudado. Responderá los mensajes pendientes.",
    error: "No se pudo reanudar el asistente",
  },
  conduitClose: {
    success: "Conversación cerrada. Se reabre si la clienta vuelve a escribir.",
    error: "No se pudo cerrar la conversación",
  },
  conduitSaveTemplate: {
    success: "Plantilla guardada.",
    error: "No se pudo guardar la plantilla",
  },
  conduitRemoveTemplate: {
    success: "Plantilla eliminada.",
    error: "No se pudo eliminar la plantilla",
  },
  conduitCancelMessage: {
    success: "Envío programado cancelado.",
    error: "No se pudo cancelar el envío",
  },
  conduitRequeue: {
    success: "Mensaje enviado de nuevo a la cola.",
    error: "No se pudo reintentar el mensaje",
  },
  conduitRetryOutbox: {
    success: "Evento reenviado a la cola.",
    error: "No se pudo reintentar el evento",
  },
  businessSettings: {
    success: "Información del negocio guardada. El asistente ya la usa.",
    error: "No se pudo guardar la información del negocio",
  },
  saveAutomationRule: {
    success: "Regla de automatización guardada.",
    error: "No se pudo guardar la regla",
  },
  createRecipient: {
    success: "Destinatario agregado. Recibirá los avisos del equipo.",
    error: "No se pudo agregar el destinatario",
  },
  updateRecipient: {
    success: "Destinatario actualizado.",
    error: "No se pudo actualizar el destinatario",
  },
  updateRecipientEmail: {
    success: "Correo del destinatario actualizado.",
    error: "No se pudo actualizar el correo",
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
  uploadTreatmentVideo: {
    success: "Video guardado. Ya se ve en la página del servicio.",
    error: "No se pudo subir el video",
  },
  removeTreatmentVideo: {
    success: "Video quitado.",
    error: "No se pudo quitar el video",
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
  createProduct: {
    success: "Producto creado.",
    error: "No se pudo crear el producto",
  },
  updateProduct: {
    success: "Producto actualizado.",
    error: "No se pudo actualizar el producto",
  },
  activateProduct: {
    success: "Producto activado. Vuelve a mostrarse en la web.",
    error: "No se pudo activar el producto",
  },
  deactivateProduct: {
    success: "Producto desactivado. Ya no se muestra en la web.",
    error: "No se pudo desactivar el producto",
  },
  removeProduct: {
    success: "Producto eliminado junto con sus fotos.",
    error: "No se pudo eliminar el producto",
  },
  saveProductTags: {
    success: "Etiquetas del producto guardadas.",
    error: "No se pudieron guardar las etiquetas",
  },
  createProductVariant: {
    success: "Variante agregada.",
    error: "No se pudo agregar la variante",
  },
  updateProductVariant: {
    success: "Variante actualizada.",
    error: "No se pudo actualizar la variante",
  },
  removeProductVariant: {
    success: "Variante eliminada.",
    error: "No se pudo eliminar la variante",
  },
  uploadVariantImage: {
    success: "Foto guardada.",
    error: "No se pudo subir la foto",
  },
  removeVariantImage: {
    success: "Foto quitada.",
    error: "No se pudo quitar la foto",
  },
  createProductCategory: {
    success: "Categoría de productos creada.",
    error: "No se pudo crear la categoría",
  },
  updateProductCategory: {
    success: "Categoría de productos actualizada.",
    error: "No se pudo actualizar la categoría",
  },
  removeProductCategory: {
    success: "Categoría eliminada.",
    error: "No se pudo eliminar la categoría",
  },
  createProductTag: {
    success: "Etiqueta creada.",
    error: "No se pudo crear la etiqueta",
  },
  updateProductTag: {
    success: "Etiqueta actualizada.",
    error: "No se pudo actualizar la etiqueta",
  },
  removeProductTag: {
    success: "Etiqueta eliminada de todos los productos.",
    error: "No se pudo eliminar la etiqueta",
  },
  createProductRecommendation: {
    success: "Recomendación agregada al servicio.",
    error: "No se pudo agregar la recomendación",
  },
  removeProductRecommendation: {
    success: "Recomendación quitada.",
    error: "No se pudo quitar la recomendación",
  },
  createTestimonial: {
    success: "Testimonio creado.",
    error: "No se pudo crear el testimonio",
  },
  updateTestimonial: {
    success: "Testimonio actualizado.",
    error: "No se pudo actualizar el testimonio",
  },
  publishTestimonial: {
    success: "Testimonio publicado en la web.",
    error: "No se pudo publicar el testimonio",
  },
  hideTestimonial: {
    success: "Testimonio oculto de la web.",
    error: "No se pudo ocultar el testimonio",
  },
  removeTestimonial: {
    success: "Testimonio eliminado junto con sus fotos.",
    error: "No se pudo eliminar el testimonio",
  },
  reorderTestimonials: {
    success: "Orden actualizado.",
    error: "No se pudo cambiar el orden",
  },
  uploadTestimonialImage: {
    success: "Foto guardada.",
    error: "No se pudo subir la foto",
  },
  removeTestimonialImage: {
    success: "Foto quitada.",
    error: "No se pudo quitar la foto",
  },
} as const satisfies Record<string, ActionMessages>;

export type AdminActionKey = keyof typeof ADMIN_ACTION_MESSAGES;
