import { create } from "zustand";
import { persist } from "zustand/middleware";

// Modelo de usuario normalizado que consume el frontend.
interface User {
  id: string | number;
  email: string;
  role: "admin" | "user";
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (backendUser: BackendUser, token: string) => void;
  logout: () => void;
}

interface BackendUser {
  id: string | number;
  email: string;
  is_admin?: boolean;
  username?: string;
  full_name?: string;
}

// Store global de autenticación con persistencia en localStorage.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (backendUser, token) => {
        // Normaliza respuesta backend para que toda la app use un contrato estable.
        const normalizedUser: User = {
          id: backendUser.id,
          email: backendUser.email,
          // Prioriza username y mantiene fallback para compatibilidad.
          name: backendUser.username || backendUser.full_name || "Usuario",
          role: backendUser.is_admin ? "admin" : "user",
        };

        set({
          user: normalizedUser,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Limpieza explícita para evitar sesiones residuales.
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      // Clave de persistencia en localStorage.
      name: "auth-storage",
    },
  ),
);
