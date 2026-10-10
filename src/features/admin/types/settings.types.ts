export interface AdminNotificationRecipient {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRecipientRequest {
  name: string;
  phone: string;
}

export interface UpdateNotificationRecipientRequest {
  name?: string;
  isActive?: boolean;
}
