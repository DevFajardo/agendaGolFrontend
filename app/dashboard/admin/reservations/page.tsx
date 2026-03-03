"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { bookingService, type Booking } from "@/services/bookingService";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminReservas() {
  const [reservas, setReservas] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const list = await bookingService.listAll(token);
        setReservas(list);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        setReservas([]); // Aseguramos que sea un array vacío si falla
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, [token]);

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        {/* Skeleton del Título */}
        <div className="h-8 w-64 bg-slate-200 rounded-lg mb-6"></div>

        {/* Skeleton de la Tabla */}
        <div className="overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="bg-slate-50 h-12 border-b border-slate-100"></div>
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center px-6 py-4 space-x-4">
                <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Historial de Reservas ⚽" />
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Cancha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reservas.length > 0 ? (
              reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reserva.user_email || reserva.user_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reserva.field_name || "Cancha General"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reserva.start_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${reserva.status === "confirmada" ? "bg-green-100 text-green-800" : "bg-red-300 text-yellow-800"}`}
                    >
                      {reserva.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No hay reservas registradas. 📭
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
