export interface DailyReport {
  date: string;
  appointments: {
    scheduled: number;
    completed: number;
    noShow: number;
    rescheduled: number;
    cancelled: number;
    cancelledBy: { CLIENT: number; ADMIN: number; TIMEOUT: number };
    leftOpen: number;
  };
  revenue: {
    completedServices: string;
    depositsApproved: { count: number; amount: string };
    depositsRejected: number;
  };
  bookings: {
    created: number;
    byChannel: { WHATSAPP: number; WEB: number };
  };
  newClients: number;
  topTreatments: Array<{
    treatmentId: string;
    name: string;
    category: string;
    count: number;
  }>;
  categories: Array<{
    categoryId: string;
    name: string;
    scheduled: number;
    completed: number;
  }>;
  today: {
    date: string;
    appointments: number;
    firstAppointmentAt: string | null;
    pendingDeposits: number;
    pendingAssessments: number;
    hairProfilesToRenew: number;
  };
}
