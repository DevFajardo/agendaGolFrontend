"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      router.replace("/login");
    }
  }, [token, user, router]);

  const handleLogout = () => {
    logout();
    Cookies.remove("auth-token");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* SIDEBAR OSCURO - DISEÑO LIMPIO */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col sticky top-0 h-screen shadow-2xl border-r border-white/5">
        <div className="p-8">
          <h1 className="text-2xl font-black text-green-500 italic tracking-tighter">
            AGENDA<span className="text-white">GOL</span>
            <span className="block text-[10px] not-italic font-bold text-slate-500 tracking-[0.2em] mt-1 uppercase">
              Management
            </span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">
            Principal
          </p>
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-green-500/30 hover:bg-white/10 transition-all font-bold text-sm"
          >
            <span className="text-lg">🏟️</span> Gestión de Canchas
          </Link>
          <Link
            href="/dashboard/admin/reservations"
            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all font-bold text-sm text-slate-400 hover:text-white"
          >
            <span className="text-lg">📅</span> Historial Reservas
          </Link>
          <Link
            href="/dashboard/admin/stats"
            className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all font-bold text-sm text-slate-400 hover:text-white"
          >
            <span className="text-lg">📊</span> Estadísticas
          </Link>
        </nav>

        {/* Quitamos el botón de cerrar sesión de aquí para evitar duplicados */}
        <div className="p-8 text-center">
          <div className="py-4 px-2 rounded-2xl bg-green-500/5 border border-green-500/10">
            <p className="text-[9px] font-black text-green-500/50 uppercase tracking-widest">
              v1.0.4 Stable
            </p>
          </div>
        </div>
      </aside>

      {/* CUERPO PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR SUPERIOR MEJORADO */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 text-xl">
              🛡️
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-base leading-none uppercase tracking-tight">
                {user?.name || "Administrador"}
              </span>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.15em] mt-1">
                Administrador del Sistema
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                Servidores Activos
              </span>
            </div>

            {/* Único botón de Logout en el Navbar */}
            <button
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-xs uppercase tracking-widest shadow-sm border border-red-100"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
