"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";
import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
} from "../types/auth.types";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useSession() {
  const devAuthBypass =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

  return useQuery<AuthenticatedUser, Error>({
    queryKey: authKeys.session(),
    queryFn: authApi.me,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !devAuthBypass,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: authApi.login,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.session(),
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,

    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationKey: ["auth", "change-password"],
    mutationFn: authApi.changePassword,
  });
}
