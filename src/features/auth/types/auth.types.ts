export type UserRole = "ADMIN";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  role: UserRole;
}

export interface LogoutResponse {
  ok: true;
}

export interface RefreshResponse {
  ok: true;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  ok: true;
}
