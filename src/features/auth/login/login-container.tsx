"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { HttpError } from "@/src/lib/api/http-error";
import { normalizeError } from "@/src/lib/errors/normalize-error";

import { useLogin } from "../hooks/use-auth";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { LoginView } from "./login-view";
import { safeAdminRedirect } from "./safe-redirect";

export function LoginContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      await login.mutateAsync(values);

      router.replace(safeAdminRedirect(searchParams.get("redirect")));
    } catch (error) {
      setServerError(
        error instanceof HttpError && error.status === 401
          ? "Correo o contraseña incorrectos."
          : normalizeError(error).message,
      );
    }
  };

  return (
    <LoginView
      form={form}
      onSubmit={onSubmit}
      serverError={serverError}
      isLoading={form.formState.isSubmitting || login.isPending}
    />
  );
}
