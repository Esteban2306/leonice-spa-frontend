import { httpClient } from "@/src/lib/api/client";
import type {
  AdminNotificationRecipient,
  CreateNotificationRecipientRequest,
  UpdateNotificationRecipientRequest,
} from "../types/settings.types";

export const notificationRecipientsApi = {
  findAll() {
    return httpClient.request<AdminNotificationRecipient[]>(
      "/admin-notification-recipients",
      "GET",
    );
  },

  create(data: CreateNotificationRecipientRequest) {
    return httpClient.request<AdminNotificationRecipient>(
      "/admin-notification-recipients",
      "POST",
      data,
    );
  },

  update(recipientId: string, data: UpdateNotificationRecipientRequest) {
    return httpClient.request<AdminNotificationRecipient>(
      `/admin-notification-recipients/${recipientId}`,
      "PATCH",
      data,
    );
  },
};
