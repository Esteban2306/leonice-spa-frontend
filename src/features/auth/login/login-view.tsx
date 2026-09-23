import type { UseFormReturn } from "react-hook-form";

import type { LoginFormValues } from "../schemas/login.schema";
import Image from "next/image";
import leoniceLogo from "../../../../public/leonice-logo-b.png";
import { InputFloatingLabel } from "@/src/components/shadcn-studio/input/input-24";
import { GradientButton } from "@/src/components/shadcn-studio/button/button-11";

interface LoginViewProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  serverError: string | null;
  isLoading: boolean;
}

export function LoginView({
  form,
  onSubmit,
  serverError,
  isLoading,
}: LoginViewProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <section className="w-full max-w-md bg-black/20 p-10 rounded-2xl">
      <div className="mb-8">
        <div className="flex justify-center">
          <Image
            src={leoniceLogo}
            alt="Logo de lonice arenas"
            className="max-w-30"
          ></Image>
        </div>

        <h1 className="mt-2 text-3xl font-heading text-[#003C17]">
          Administración
        </h1>

        <p className="mt-2 text-sm text-muted-foreground font-sans">
          Ingresa para acceder al panel administrativo.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <InputFloatingLabel
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />{" "}
        </div>

        <div className="space-y-2">
          <div className="space-y-2">
            <InputFloatingLabel
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-red-600">
            {serverError}
          </p>
        )}

        <div className="flex justify-center">
          <GradientButton
            type="submit"
            disabled={isLoading}
            text={isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            gradient="secondary"
            className={"w-[80%] text-white text-[16px] cursor-pointer min-h-10"}
          />
        </div>
      </form>
    </section>
  );
}
