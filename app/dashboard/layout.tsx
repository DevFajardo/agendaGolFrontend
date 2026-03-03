"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation"; // Importamos usePathname
import { useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname(); // Detectamos en qué ruta estamos

  // Verificamos si la ruta actual es de Admin
  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  const handleLogout = () => {
    logout();
    Cookies.remove("auth-token", { path: "/" });
    Cookies.remove("user-role", { path: "/" });
    router.replace("/login");
  };

  if (!token) return null;

  // SI ES RUTA DE ADMIN, SOLO RENDERIZAMOS EL CONTENIDO
  // No mostramos el Navbar blanco para no duplicar menús
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // SI ES RUTA DE USUARIO NORMAL, MOSTRAMOS EL NAVBAR BLANCO
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/dashboard/user" className="flex items-center">
            <h1 className="text-xl font-black text-green-600 italic tracking-tighter cursor-pointer">
              AGENDA<span className="text-slate-800">GOL</span>
            </h1>
          </Link>

          <div className="hidden md:flex gap-6 text-sm font-bold text-slate-500">
            <Link
              href="/dashboard/user"
              className="hover:text-green-600 transition-colors"
            >
              EXPLORAR
            </Link>
            <Link
              href="/dashboard/user/reservations"
              className="hover:text-green-600 transition-colors"
            >
              MIS RESERVAS
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none mb-1">
              {user?.name?.toUpperCase() || "USUARIO"}
            </p>
            {/* Badge Dinámico: Si por alguna razón un admin entra aquí, dirá ADMIN */}
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-widest ${
                user?.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user?.role?.toUpperCase() || "JUGADOR"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="cursor-pointer group flex items-center gap-2 text-xs font-black bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 active:scale-95"
          >
            <span className="hidden sm:inline">CERRAR SESIÓN</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
