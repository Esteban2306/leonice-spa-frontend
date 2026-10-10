import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationRecipientsApi } from "../api/notification-recipients.api";
import { adminQueryKeys } from "./query-keys";

import type {
  CreateNotificationRecipientRequest,
  UpdateNotificationRecipientRequest,
} from "../types/settings.types";

const RECIPIENTS_STALE_TIME = 5 * 60 * 1000;

export function useNotificationRecipients() {
  return useQuery({
    queryKey: adminQueryKeys.settings.recipients(),
    queryFn: () => notificationRecipientsApi.findAll(),
    staleTime: RECIPIENTS_STALE_TIME,
    refetchOnWindowFocus: false,
  });
}

export function useCreateNotificationRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "settings", "recipients", "create"],
    mutationFn: (data: CreateNotificationRecipientRequest) =>
      notificationRecipientsApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.settings.recipients(),
      }),
  });
}

export function useUpdateNotificationRecipient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin", "settings", "recipients", "update"],
    mutationFn: ({
      recipientId,
      data,
    }: {
      recipientId: string;
      data: UpdateNotificationRecipientRequest;
    }) => notificationRecipientsApi.update(recipientId, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.settings.recipients(),
      }),
  });
}
