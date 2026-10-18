export interface AdminNotificationRecipient {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRecipientRequest {
  name: string;
  phone: string;
  email?: string;
}

export interface UpdateNotificationRecipientRequest {
  name?: string;
  email?: string | null;
  isActive?: boolean;
}
