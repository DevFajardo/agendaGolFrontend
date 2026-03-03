import { useCallback, useEffect, useState } from "react";
import { bookingService, type Booking } from "@/services/bookingService";

interface UseMyReservationsParams {
  token: string | null;
  limit?: number;
  autoFetch?: boolean;
}

// Hook de lectura de reservas del usuario autenticado.
// Expone estado, setter y recarga manual para reutilizar en distintas pantallas.
export function useMyReservations({
  token,
  limit = 50,
  autoFetch = true,
}: UseMyReservationsParams) {
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);

  const fetchMyReservations = useCallback(async () => {
    if (!token) return;

    try {
      // Marca carga antes de consultar API.
      setIsLoading(true);
      const list = await bookingService.listMine(token, limit);
      setReservations(list);
    } catch {
      // Fallback seguro para no dejar datos inconsistentes en UI.
      setReservations([]);
    } finally {
      // Cierra ciclo de carga en éxito o error.
      setIsLoading(false);
    }
  }, [token, limit]);

  useEffect(() => {
    // Auto-carga opcional al montar o cambiar dependencias.
    if (autoFetch) {
      fetchMyReservations();
    }
  }, [autoFetch, fetchMyReservations]);

  return {
    reservations,
    setReservations,
    isLoading,
    fetchMyReservations,
  };
}
