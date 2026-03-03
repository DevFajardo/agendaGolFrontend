"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { FormField } from "../ui/FormField";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/apiConfig";
import Cookies from "js-cookie";
import { isAxiosError } from "axios";

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

  // Estructura esperada del payload JWT devuelto por backend.
  interface JWTPayload {
    user_id: number;
    sub: string;
    email: string;
    is_admin: boolean;
  }

  const onSubmit = async (data: LoginInput) => {
    // Reinicia estado de UI antes de iniciar autenticación.
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1) Autentica credenciales contra backend.
      const response = await api.post("/auth/login", data);
      const resData = response.data;

      const token = resData.access_token || resData.token;

      if (!token) {
        throw new Error("No se recibió un token de acceso.");
      }

      // 2) Decodifica JWT localmente para armar el usuario frontend.
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64)) as JWTPayload;

      // 3) Mapea campos backend al shape usado por Zustand.
      const roleValue = payload.is_admin
        ? ("admin" as const)
        : ("user" as const);

      const userData = {
        id: String(payload.user_id),
        username: payload.sub,
        name: payload.sub,
        email: payload.email,
        role: roleValue,
      };

      // 4) Persiste sesión en store + cookies para navegación y refresh.
      setAuth(userData, token);

      Cookies.set("auth-token", token, { expires: 7, path: "/" });
      Cookies.set("user-role", userData.role, { expires: 7, path: "/" });

      // 5) Redirige al dashboard correspondiente al rol.
      window.location.href = `/dashboard/${userData.role}`;
    } catch (err: unknown) {
      // Manejo tipado de errores de red y errores genéricos.
      console.warn("Fallo en la autenticación");

      if (isAxiosError(err)) {
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
