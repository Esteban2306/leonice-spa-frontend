export interface PromoEvent {
  id: string;
  name: string;
  description: string;
  prizes: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  ticketsEnabled: boolean;
  ticketCount: number;
  winnerCount: number;
}

export interface SavePromoEventRequest {
  name: string;
  description: string;
  prizes?: string;
  startsAt: string;
  endsAt: string;
  ticketsEnabled: boolean;
}

export interface UpdatePromoEventRequest
  extends Partial<SavePromoEventRequest> {
  isActive?: boolean;
}

export interface EventTicket {
  id: string;
  number: number;
  createdAt: string;
  wonAt: string | null;
  prize: string | null;
  reservationId: string | null;
  client: { id: string; name: string; phone: string };
}

export interface DrawResult {
  id: string;
  number: number;
  prize: string;
  wonAt: string;
  client: { id: string; name: string; phone: string };
}
