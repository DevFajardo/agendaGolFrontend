import api from "./apiConfig";
import { LoginInput, RegisterInput } from "@/lib/validations/auth";

// Capa de acceso a API de autenticación.
// Mantiene las llamadas HTTP fuera de componentes para facilitar reutilización.
export const authService = {
  // Inicia sesión con credenciales validadas por Zod en el formulario.
  login: async (credentials: LoginInput) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  // Obtiene usuario autenticado actual usando el token ya configurado en API client.
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  // Registra usuario nuevo adaptando nombres de campos esperados por backend.
  register: async (userData: RegisterInput) => {
    const { data } = await api.post("/auth/register", {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    return data;
  },
};
