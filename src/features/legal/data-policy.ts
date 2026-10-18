export const DATA_POLICY_PATH = "/politica-de-datos";
export const DATA_POLICY_VERSION = "v1";
export const DATA_POLICY_REVIEWED = false;

export interface PolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export const dataPolicySections: PolicySection[] = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    paragraphs: [
      "Leonice Arenas Spa Capilar, con domicilio en Carrera 9 # 13A - 17, Granada, Meta (Colombia), es responsable del tratamiento de los datos personales que recolecta a través de este sitio web, de WhatsApp y de la atención presencial.",
      "NIT o documento del responsable: pendiente de completar. Canal de atención: WhatsApp +57 314 451 8129.",
    ],
  },
  {
    id: "marco",
    title: "2. Marco legal",
    paragraphs: [
      "Esta política se adopta en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas colombianas sobre protección de datos personales.",
    ],
  },
  {
    id: "datos",
    title: "3. Datos que tratamos",
    items: [
      "Identificación y contacto: nombre, número de teléfono o WhatsApp y fecha de nacimiento.",
      "Datos de la cita: tratamientos solicitados, fechas, historial de reservas, cancelaciones y pagos de anticipo, incluidas las imágenes de los comprobantes que envías.",
      "Perfil capilar: color y largo del cabello y observaciones del diagnóstico.",
      "Datos de salud (sensibles): alergias y estado de embarazo, solo cuando nos autorizas expresamente a tratarlos.",
      "Conversaciones por WhatsApp con el spa y con su asistente automático.",
    ],
  },
  {
    id: "finalidades",
    title: "4. Finalidades",
    items: [
      "Agendar, confirmar, reprogramar y cancelar tus citas, y enviarte recordatorios y avisos sobre ellas.",
      "Verificar los pagos de anticipo y gestionar saldos a favor.",
      "Prestar el servicio de forma segura, teniendo en cuenta alergias, embarazo y el estado de tu cabello.",
      "Atender tus preguntas, peticiones, quejas y reclamos.",
      "Enviarte novedades y promociones, solo si lo autorizas; puedes retirar esta autorización en cualquier momento.",
      "Cumplir obligaciones legales, contables y tributarias.",
    ],
  },
  {
    id: "sensibles",
    title: "5. Datos sensibles y de menores",
    paragraphs: [
      "Responder preguntas sobre datos sensibles, como los de salud, es facultativo: no es obligatorio entregarlos. Solo los tratamos con tu autorización previa, expresa e informada, y únicamente para proteger tu salud durante el servicio.",
      "Los datos de niñas, niños y adolescentes solo se tratan con autorización de su representante legal y respetando su interés superior.",
    ],
  },
  {
    id: "derechos",
    title: "6. Tus derechos",
    items: [
      "Conocer, actualizar y rectificar tus datos personales.",
      "Solicitar prueba de la autorización que nos diste.",
      "Recibir información sobre el uso que les damos a tus datos.",
      "Revocar la autorización o pedir la supresión de tus datos cuando no exista un deber legal o contractual de conservarlos.",
      "Acceder gratuitamente a tus datos.",
      "Presentar quejas ante la Superintendencia de Industria y Comercio, después de agotar el trámite ante el spa.",
    ],
  },
  {
    id: "procedimiento",
    title: "7. Cómo ejercer tus derechos",
    paragraphs: [
      "Escríbenos por WhatsApp indicando tu nombre, tu número de contacto y lo que solicitas.",
      "Las consultas se responden en un máximo de diez (10) días hábiles y los reclamos en un máximo de quince (15) días hábiles, prorrogables en los términos de la ley.",
    ],
  },
  {
    id: "encargados",
    title: "8. Proveedores y transferencias",
    paragraphs: [
      "Para operar usamos proveedores tecnológicos que tratan datos por nuestra cuenta: mensajería de WhatsApp, alojamiento de la plataforma, almacenamiento de imágenes de comprobantes y servicios de inteligencia artificial del asistente automático. Algunos pueden estar fuera de Colombia; exigimos que protejan la información con estándares adecuados.",
    ],
  },
  {
    id: "sitio",
    title: "9. Este sitio web",
    paragraphs: [
      "Este sitio no usa cookies de publicidad ni de analítica. El mapa de ubicación lo provee Google Maps, que puede usar sus propias cookies según sus políticas.",
    ],
  },
  {
    id: "seguridad",
    title: "10. Seguridad y conservación",
    paragraphs: [
      "Aplicamos medidas técnicas y administrativas para proteger tus datos contra acceso no autorizado, pérdida o alteración. Los conservamos mientras sean necesarios para las finalidades descritas o mientras la ley lo exija.",
    ],
  },
  {
    id: "vigencia",
    title: "11. Vigencia",
    paragraphs: [
      `Versión ${DATA_POLICY_VERSION}. Rige desde su publicación. Cualquier cambio sustancial se informará por los canales del spa.`,
    ],
  },
];
