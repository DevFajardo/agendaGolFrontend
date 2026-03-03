import { useMemo, useState } from "react";
import type { Booking } from "@/services/bookingService";

export type ReservationTab = "activas" | "pasadas" | "canceladas";

const statusConfig: Record<ReservationTab, { text: string; styles: string }> = {
  activas: { text: "Confirmada", styles: "bg-green-100 text-green-600" },
  pasadas: { text: "Completada", styles: "bg-slate-100 text-slate-600" },
  canceladas: { text: "Cancelada", styles: "bg-red-100 text-red-600" },
};

const emptyMessages: Record<
  ReservationTab,
  { icon: string; title: string; desc: string }
> = {
  activas: {
    icon: "🏟️",
    title: "No tienes partidos programados",
    desc: "Tu historial está limpio. ¡Es momento de reservar una cancha!",
  },
  pasadas: {
    icon: "⏱️",
    title: "No hay partidos anteriores",
    desc: "Aún no has completado encuentros. ¡Sal a la cancha!",
  },
  canceladas: {
    icon: "🚫",
    title: "Sin registros de cancelación",
    desc: "¡Qué buena racha! No has tenido que cancelar ningún partido.",
  },
};

// Hook de presentación: clasifica reservas por pestaña activa sin mutar datos fuente.
export function useReservationFilters(reservations: Booking[]) {
  const [activeTab, setActiveTab] = useState<ReservationTab>("activas");

  const filteredReservations = useMemo(() => {
    // Clasifica por estado cancelado y por fecha para separar activas/pasadas.
    return reservations.filter((res) => {
      const status = String(res.status || "").toLowerCase();
      const isCancelled = status.includes("cancelada");
      const isPast = new Date(res.start_time) < new Date();

      if (activeTab === "canceladas") return isCancelled;
      if (activeTab === "pasadas") return isPast && !isCancelled;
      return !isPast && !isCancelled;
    });
  }, [reservations, activeTab]);

  return {
    activeTab,
    setActiveTab,
    filteredReservations,
    statusConfig,
    emptyMessages,
  };
}
