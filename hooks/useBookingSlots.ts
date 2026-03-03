import { useMemo } from "react";
import type { Booking } from "@/services/bookingService";

const defaultSlots = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

interface UseBookingSlotsParams {
  reservations: Booking[];
  selectedCourtId?: number;
  selectedDate: string;
  availableSlots: string[];
}

// Hook de apoyo visual: calcula estado de cada slot horario para el modal de reserva.
export function useBookingSlots({
  reservations,
  selectedCourtId,
  selectedDate,
  availableSlots,
}: UseBookingSlotsParams) {
  // Horario base fijo mostrado en UI.
  const slots = useMemo(() => defaultSlots, []);

  const getSlotState = (slot: string) => {
    // Disponibilidad oficial reportada por backend.
    const isServerFree = availableSlots.includes(slot);

    // Reserva propia en misma cancha/fecha/hora (excepto canceladas).
    const isMine = reservations.some((reservation) => {
      if (reservation.status === "cancelada") return false;
      const reservationTime = reservation.start_time.split("T")[1]?.substring(0, 5);
      const isSameCourt = Number(reservation.field_id) === Number(selectedCourtId);
      const isSameDate = reservation.start_time.split("T")[0] === selectedDate;
      return isSameCourt && isSameDate && slot === reservationTime;
    });

    // Regla de deshabilitado actual: no libre en servidor o ya reservado por mí.
    const isDisabled = !isServerFree || isMine;

    return {
      isServerFree,
      isMine,
      isDisabled,
    };
  };

  return {
    slots,
    getSlotState,
  };
}
