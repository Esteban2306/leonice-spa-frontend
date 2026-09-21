"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../hooks/use-auth";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { LoginView } from "./login-view";

export function LoginContainer() {
  const router = useRouter();
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

      router.replace("/admin");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "No fue posible iniciar sesión.",
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
