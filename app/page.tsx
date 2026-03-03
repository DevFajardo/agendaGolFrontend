"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // COMPROBACIÓN EXTRA: Miramos el storage directamente
    const authStorage = localStorage.getItem("auth-storage");
    const hasToken = authStorage ? JSON.parse(authStorage).state.token : null;

    if (!isAuthenticated && !hasToken) {
      // 1. Si de verdad no hay nada, al login
      router.push("/login");
    } else if (user && user.role) {
      // 2. Si hay sesión, redirigimos según el rol mapeado
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        // IMPORTANTE: Si tu carpeta de usuario NO se llama dashboard,
        // cámbiala aquí por el nombre correcto (ej: "/catalogo")
        router.push("/dashboard/user");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-green-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          Sincronizando Acceso...
        </p>
      </div>
    </div>
  );
}
