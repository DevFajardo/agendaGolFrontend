"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { StatusModal } from "@/components/modals/StatusModal";
import { CourtCard } from "@/components/cards/CourtCard";
import { DurationSelector } from "@/components/shared/DurationSelector";
import { useMyReservations } from "@/hooks/useMyReservations";
import { bookingService } from "@/services/bookingService";
import { fieldService } from "@/services/fieldService";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useBookingSlots } from "@/hooks/useBookingSlots";
import { useStatusFeedback } from "@/hooks/useStatusFeedback";
import { debugLog } from "@/utils/debugLog";

interface Court {
  id: number;
  name: string;
  location: string;
  description?: string;
  price_per_hour: number;
  is_active?: boolean;
}

export default function UserDashboard() {
  // 1) Estado base de catálogo y selección de reserva.
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const { feedback, closeFeedback, showSuccess, showError } =
    useStatusFeedback("success");

  const limit = 6;
  const { token } = useAuthStore();
  const { reservations, fetchMyReservations } = useMyReservations({
    token,
    limit: 50,
    autoFetch: true,
  });

  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  // 2) Cálculo de estado visual de cada hora en grilla.
  const { slots, getSlotState } = useBookingSlots({
    reservations,
    selectedCourtId: selectedCourt?.id,
    selectedDate,
    availableSlots,
  });

  useBodyScrollLock(Boolean(selectedCourt));

  // Al abrir modal o cambiar fecha, sincroniza disponibilidad + reservas del usuario.
  useEffect(() => {
    if (selectedCourt) {
      setAvailableSlots([]);
      fetchAvailability(selectedCourt.id, selectedDate);
      fetchMyReservations();
    }
  }, [selectedCourt, selectedDate, fetchMyReservations]);

  // Carga catálogo de canchas activas para mostrar tarjetas.
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const allFields = await fieldService.list(token || "");
        const activeOnly = allFields.filter((f) => f.is_active !== false);
        const sorted = activeOnly.reverse();
        const startIndex = 0;
        const paginated = sorted.slice(startIndex, startIndex + limit);
        setCourts(paginated);
      } catch {
        setCourts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, [token]);

  // Consulta disponibilidad real por cancha y fecha.
  const fetchAvailability = async (courtId: number, date: string) => {
    try {
      setLoadingSlots(true);
      debugLog("📡 Pidiendo disponibilidad real a la API...");

      const availableHours = await fieldService.getAvailability(courtId, date);

      // ESTE LOG ES EL MÁS IMPORTANTE DE TODOS
      debugLog(
        "🔍 JSON CRUDO DEL SERVIDOR:",
        JSON.stringify(availableHours),
      );
      debugLog(
        "📏 CANTIDAD DE HORAS RECIBIDAS:",
        availableHours.length,
      );

      const cleanSlots = availableHours.map((h) => h.trim().substring(0, 5));
      setAvailableSlots(cleanSlots);
    } catch (err) {
      console.error("❌ Error en la petición:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async (slot: string) => {
    if (!selectedCourt) return;

    try {
      setIsBooking(true);

      // Construye datetime ISO local combinando fecha elegida y hora del slot.
      const [hours, minutes] = slot.split(":");
      const dateParts = selectedDate.split("-"); // [YYYY, MM, DD]
      const startTimeStr = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;

      const payload = {
        field_id: Number(selectedCourt.id),
        start_time: startTimeStr,
        duration_hours: selectedDuration,
        notes: `Reserva de ${selectedDuration} hora(s)`,
      };

      debugLog("Enviando reserva:", payload);

      // Intenta crear reserva en backend.
      const response = await bookingService.create(token || "", payload);

      // Manejo de conflicto de disponibilidad devuelto por servidor.
      if (!response.ok) {
        if (response.status === 400) {
          // Si el servidor falla, refrescamos a la fuerza para intentar limpiar
          await fetchAvailability(selectedCourt.id, selectedDate);
          throw new Error(
            "El servidor indica que esta hora ya fue tomada. Por favor, elige otra.",
          );
        }
        throw new Error("La hora ya paso o no es válida. Por favor, elige otra.");
      }

      // Refresca datos para reflejar nuevo estado de los slots.
      await fetchMyReservations();
      await fetchAvailability(selectedCourt.id, selectedDate);

      showSuccess(`¡Listo! Reservado a las ${slot}.`);

      // Cerramos el modal para limpiar la vista
      setSelectedCourt(null);
    } catch (err: unknown) {
      showError(
        err instanceof Error ? err.message : "Error al procesar la reserva",
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700 ">
      <header className="flex flex-col">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          ¡A JUGAR! ⚽
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          Reserva tu cancha favorita en segundos.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 bg-slate-200 animate-pulse rounded-3xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              onViewAvailability={setSelectedCourt}
            />
          ))}
        </div>
      )}

      {selectedCourt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedCourt(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="text-2xl font-black text-slate-800 mb-1">
              Reservar
            </h3>
            <p className="text-green-600 font-black text-sm uppercase mb-6">
              {selectedCourt.name}
            </p>

            <div className="space-y-6">
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
              />

              <DurationSelector
                value={selectedDuration}
                onChange={setSelectedDuration}
              />

              {/* 3. LÓGICA DE BOTONES SIEMPRE VISIBLES */}
              {loadingSlots ? (
                <div className="text-center py-8 animate-pulse font-bold text-slate-400">
                  CONSULTANDO...
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2">
                  {slots.map((slot) => {
                    const { isServerFree, isMine, isDisabled } = getSlotState(slot);

                    return (
                      <button
                        key={slot}
                        disabled={isDisabled || isBooking}
                        onClick={() => handleBooking(slot)}
                        className={`p-3 text-sm font-black border-2 rounded-xl transition-all ${
                          isDisabled
                            ? "bg-slate-100 border-slate-200 text-slate-400 opacity-40 cursor-not-allowed"
                            : "bg-white border-slate-100 text-slate-700 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        <span className={isDisabled ? "line-through" : ""}>
                          {slot}
                        </span>
                        <div className="mt-1">
                          {isMine ? (
                            <span className="text-[9px] text-blue-600 font-bold block">
                              MÍA
                            </span>
                          ) : !isServerFree ? ( // Si el servidor no la manda, es OCUPADA
                            <span className="text-[9px] text-red-500 font-bold block">
                              OCUPADA
                            </span>
                          ) : (
                            <span className="text-[9px] text-green-600 font-bold block">
                              LIBRE
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <StatusModal
        isOpen={feedback.show}
        type={feedback.type}
        message={feedback.msg}
        onClose={closeFeedback}
      />
    </div>
  );
}
