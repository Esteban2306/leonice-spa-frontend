import { httpClient } from "@/src/lib/api/client";
import {
  AuthenticatedUser,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
} from "../types/auth.types";

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return httpClient.request<LoginResponse>("/auth/login", "POST", payload, {
      auth: false,
    });
  },

  me(): Promise<AuthenticatedUser> {
    return httpClient.request<AuthenticatedUser>("/auth/me", "GET");
  },

  refresh(): Promise<RefreshResponse> {
    return httpClient.request<RefreshResponse>(
      "/auth/refresh",
      "POST",
      undefined,
      {
        auth: false,
      },
    );
  },
  logout(): Promise<LogoutResponse> {
    return httpClient.request<LogoutResponse>("/auth/logout", "POST");
  },

  changePassword(
    payload: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return httpClient.request<ChangePasswordResponse>(
      "/auth/password",
      "PATCH",
      payload,
    );
  },
};
