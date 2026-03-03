"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { FormField } from "../ui/FormField";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { authService, buildUserFromToken } from "@/services/authService";
import Cookies from "js-cookie";
import axios from "axios";

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    // Reinicia estado de UI antes de iniciar autenticación.
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1) Autentica credenciales contra backend o modo mock.
      const resData = await authService.login(data);

      const token = resData.access_token || resData.token;

      if (!token) {
        throw new Error("No se recibió un token de acceso.");
      }

      // 2) Usuario desde respuesta o token (fallback).
      const userData =
        resData.user ||
        resData.user_data ||
        buildUserFromToken(token);

      if (!userData || !userData.email) {
        throw new Error("No se pudo obtener el usuario autenticado.");
      }

      // 4) Persiste sesión en store + cookies para navegación y refresh.
      setAuth(userData, token);

      Cookies.set("auth-token", token, { expires: 7, path: "/" });
      Cookies.set("user-role", userData.is_admin ? "admin" : "user", {
        expires: 7,
        path: "/",
      });

      // 5) Redirige al dashboard correspondiente al rol.
      window.location.href = `/dashboard/${userData.is_admin ? "admin" : "user"}`;
    } catch (err: unknown) {
      // Manejo tipado de errores de red y errores genéricos.
      console.warn("Fallo en la autenticación");

      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setErrorMsg(
          typeof detail === "string" ? detail : "Error en el servidor",
        );
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <FormField
        label="Correo Electrónico"
        placeholder="tu@email.com"
        register={register("email")}
        error={errors.email?.message}
      />
      <FormField
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        register={register("password")}
        error={errors.password?.message}
      />

      <Button type="submit" isLoading={loading}>
        Ingresar
      </Button>
    </form>
  );
};
