import { httpClient } from "@/src/lib/api/client";
import type { QueryOptions } from "@/src/lib/api/http.types";
import type {
  DrawResult,
  EventTicket,
  PromoEvent,
  SavePromoEventRequest,
  UpdatePromoEventRequest,
} from "../types/promo-events.types";

export const promoEventsApi = {
  findAll(options: QueryOptions = {}) {
    return httpClient.request<PromoEvent[]>("/promo-events", "GET", undefined, {
      signal: options.signal,
    });
  },

  create(data: SavePromoEventRequest) {
    return httpClient.request<PromoEvent>("/promo-events", "POST", data);
  },

  update(eventId: string, data: UpdatePromoEventRequest) {
    return httpClient.request<PromoEvent>(
      `/promo-events/${eventId}`,
      "PATCH",
      data,
    );
  },

  remove(eventId: string) {
    return httpClient.request<void>(`/promo-events/${eventId}`, "DELETE");
  },

  tickets(eventId: string, options: QueryOptions = {}) {
    return httpClient.request<EventTicket[]>(
      `/promo-events/${eventId}/tickets`,
      "GET",
      undefined,
      { signal: options.signal },
    );
  },

  draw(eventId: string, prize: string) {
    return httpClient.request<DrawResult>(
      `/promo-events/${eventId}/draw`,
      "POST",
      { prize },
    );
  },
};
