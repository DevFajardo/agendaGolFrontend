"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { authService } from "@/services/authService";
import { FormField } from "../ui/FormField";
import { Button } from "../ui/Button";
import axios from "axios";
import { useTimedStatusFeedback } from "@/hooks/useTimedStatusFeedback";

export const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Feedback temporal compartido: por defecto 4s para errores.
  const { feedback, closeFeedback, showSuccess, showError } =
    useTimedStatusFeedback(4000);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    // Limpia mensajes previos antes de un nuevo intento.
    setLoading(true);
    closeFeedback();

    try {
      // 1) Crea usuario en backend.
      await authService.register(data);

      // 2) Éxito corto para permitir lectura antes de redirigir.
      showSuccess("¡Cuenta creada con éxito! Redirigiendo...", 2000);

      // 3) Redirección diferida a login para completar flujo de onboarding.
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Error al registrarse";
        showError(message);
      } else {
        showError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Nombre de Usuario"
        placeholder="ej: emmanuel_f"
        register={register("username")}
        error={errors.username?.message}
      />
      <FormField
        label="Email"
        placeholder="correo@ejemplo.com"
        register={register("email")}
        error={errors.email?.message}
      />
      <FormField
        label="Password"
        type="password"
        placeholder="••••••••"
        register={register("password")}
        error={errors.password?.message}
      />
      <Button type="submit" isLoading={loading}>
        Crear Cuenta
      </Button>
      {/* NOTIFICACIONES (TOASTS) */}
      {feedback.show && (
        <div
          className={`fixed bottom-8 right-8 z-[200] px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-2xl animate-in fade-in slide-in-from-right-4 ${
            feedback.type === "success"
              ? "bg-white text-slate-900"
              : "bg-red-600 text-white"
          }`}
        >
          {feedback.msg}
        </div>
      )}
    </form>
  );
};
