import api from "./apiConfig";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";
import axios from "axios";
import { mockAuth, shouldUseMocks, decodeTokenPayload } from "./mockData";

// Capa de acceso a API de autenticación.
// Mantiene las llamadas HTTP fuera de componentes para facilitar reutilización.
export const authService = {
  // Inicia sesión con credenciales validadas por Zod en el formulario.
  login: async (credentials: LoginInput) => {
    if (shouldUseMocks()) {
      return mockAuth.login(credentials);
    }

    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && !error.response) {
        return mockAuth.login(credentials);
      }
      throw error;
    }
  },

  // Obtiene usuario autenticado actual usando el token ya configurado en API client.
  getMe: async () => {
    if (shouldUseMocks()) {
      return null;
    }

    try {
      const { data } = await api.get("/auth/me");
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && !error.response) {
        return null;
      }
      throw error;
    }
  },

  // Registra usuario nuevo adaptando nombres de campos esperados por backend.
  register: async (userData: RegisterInput) => {
    if (shouldUseMocks()) {
      return mockAuth.register(userData);
    }

    try {
      const { data } = await api.post("/auth/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && !error.response) {
        return mockAuth.register(userData);
      }
      throw error;
    }
  },
};

export const buildUserFromToken = (token: string) => {
  const payload = decodeTokenPayload(token);
  if (!payload?.email) return null;

  return {
    id: String(payload.user_id || payload.email),
    email: payload.email,
    username: payload.sub || payload.email.split("@")[0],
    is_admin: Boolean(payload.is_admin),
  };
};
