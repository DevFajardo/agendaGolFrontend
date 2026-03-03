"use client";
import { useEffect, useState } from "react";
import api from "@/services/apiConfig";

interface GeneralStatsResponse {
  general_stats?: {
    total_users: number;
    total_reservations: number;
  };
}

interface FieldStatsItem {
  field_name: string;
  total_reservations: number;
}

interface FieldsStatsResponse {
  fields_statistics?: FieldStatsItem[];
}

interface RevenueResponse {
  period_days?: number;
  total_period_revenue?: number;
  daily_revenue?: Record<string, number>;
}

interface StatsState {
  general: GeneralStatsResponse | null;
  fields: FieldsStatsResponse | null;
  revenue: RevenueResponse | null;
}

export default function StatsPage() {
  const [data, setData] = useState<StatsState>({
    general: null,
    fields: null,
    revenue: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [resGeneral, resFields, resRevenue] = await Promise.all([
          api.get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/stats`),
          api.get(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/fields/stats`),
          api.get(
            `${process.env.NEXT_PUBLIC_ADMIN_API_URL}/revenue/daily?days=30`,
          ),
        ]);
        setData({
          general: resGeneral.data,
          fields: resFields.data,
          revenue: resRevenue.data,
        });
      } catch (error) {
        console.error("Error capturado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-160px)] flex flex-col space-y-4 animate-pulse">
        {/* Skeleton del Header */}
        <div className="shrink-0 space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-lg"></div>
        </div>

        {/* Skeleton del Grid Maestro */}
        <div className="grid grid-cols-6 gap-6 flex-1">
          {/* Tarjetas Superiores */}
          <div className="col-span-3 h-32 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
          <div className="col-span-3 h-32 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>

          {/* Bloques Inferiores */}
          <div className="col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  <div className="h-3 w-10 bg-slate-100 rounded"></div>
                </div>
                <div className="h-3 w-full bg-slate-50 rounded-full"></div>
              </div>
            ))}
          </div>

          <div className="col-span-3 bg-slate-900/5 rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-full bg-slate-100/50 rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          ESTADÍSTICAS GENERALES
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Panel de control de rendimiento de AgendaGol
        </p>
      </header>

      {/* GRID MAESTRO DE 6 COLUMNAS */}
      <div className="grid grid-cols-6 gap-6">
        {/* --- FILA SUPERIOR: 2 TARJETAS (3 COLUMNAS CADA UNA) --- */}

        {/* Tarjeta 1: Usuarios */}
        <div className="col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Usuarios Totales
              </p>
              <h3 className="text-4xl font-black text-slate-900 mt-1">
                {data.general?.general_stats?.total_users || 0}
              </h3>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
              👥
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Reservas */}
        <div className="col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Reservas Realizadas
              </p>
              <h3 className="text-4xl font-black text-slate-900 mt-1">
                {data.general?.general_stats?.total_reservations || 0}
              </h3>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
              ⚽
            </div>
          </div>
        </div>

        {/* --- FILA INFERIOR: 2 BLOQUES GRANDES (3 COLUMNAS CADA UNO) --- */}

        {/* Bloque Ocupación (Canchas) */}
        <div className="col-span-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              Ocupación por Cancha
            </h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              Rendimiento basado en reservas totales
            </p>
          </div>

          <div className="space-y-6 flex-1">
            {data.fields?.fields_statistics?.map((field, index) => {
                const percentage = Math.min(
                  (field.total_reservations / 20) * 100,
                  100,
                );
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-slate-700 uppercase">
                        {field.field_name}
                      </span>
                      <span className="text-[10px] font-black text-green-600 uppercase">
                        {field.total_reservations} Reservas
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Bloque Flujo de Caja (Oscuro) */}
        <div className="col-span-3 bg-slate-950 p-8 rounded-3xl text-white shadow-2xl border border-white/5 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter">
                Flujo de Caja
              </h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                Últimos {data.revenue?.period_days} días
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-green-500 leading-none">
                ${data.revenue?.total_period_revenue}
              </span>
              <p className="text-slate-500 text-[9px] font-black uppercase mt-1 tracking-tighter">
                Recaudación Total
              </p>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            {Object.entries(data.revenue?.daily_revenue || {})
              .slice(-6)
              .map(([fecha, monto]) => (
                <div
                  key={fecha}
                  className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {fecha}
                  </span>
                  <span className="text-sm font-black text-white">
                    ${monto}
                  </span>
                </div>
              ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-green-500 bg-green-500/5 py-2 px-4 rounded-xl border border-green-500/10 w-fit">
              <span className="animate-pulse text-xs">📈</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                Tendencia Positiva detectada
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
