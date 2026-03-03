import { useState } from "react";
import { bookingService, type Booking } from "@/services/bookingService";

interface UseReservationActionsParams {
  token: string | null;
  setReservations: React.Dispatch<React.SetStateAction<Booking[]>>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

// Hook de acciones de reservas: edición de duración y cancelación con feedback.
export function useReservationActions({
  token,
  setReservations,
  showSuccess,
  showError,
}: UseReservationActionsParams) {
  // Estado de UI para modales y operación en curso.
  const [editingRes, setEditingRes] = useState<Booking | null>(null);
  const [newDuration, setNewDuration] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [resToCancel, setResToCancel] = useState<number | null>(null);

  const startEdit = (reservation: Booking) => {
    setEditingRes(reservation);
    setNewDuration(reservation.duration_hours);
  };

  const closeEdit = () => setEditingRes(null);

  const openCancelModal = (id: number) => {
    setResToCancel(id);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setResToCancel(null);
  };

  const handleUpdate = async () => {
    if (!editingRes || !token) return;

    setIsUpdating(true);
    try {
      // Intenta persistir la nueva duración en backend.
      const ok = await bookingService.updateDuration(token, editingRes.id, newDuration);
      if (!ok) throw new Error("Servidor no responde");

      showSuccess("Reserva actualizada");
    } catch {
      // Se mantiene mensaje existente para el flujo simulado actual.
      showSuccess("Actualización aplicada (Simulada por error 500)");
    } finally {
      // Actualización local para reflejar cambio inmediatamente en UI.
      setReservations((prev) =>
        prev.map((r) =>
          r.id === editingRes.id ? { ...r, duration_hours: newDuration } : r,
        ),
      );
      setIsUpdating(false);
      setEditingRes(null);
    }
  };

  const confirmCancel = async () => {
    if (!resToCancel || !token) return;

    try {
      // Cancela en backend y remueve de la lista local.
      await bookingService.cancel(token, resToCancel);
      setReservations((prev) => prev.filter((r) => r.id !== resToCancel));
      showSuccess("PARTIDO CANCELADO CORRECTAMENTE");
    } catch (err: unknown) {
      showError(
        err instanceof Error
          ? err.message
          : "ERROR AL PROCESAR LA CANCELACIÓN",
      );
    } finally {
      closeCancelModal();
    }
  };

  return {
    editingRes,
    newDuration,
    isUpdating,
    showCancelModal,
    setNewDuration,
    startEdit,
    closeEdit,
    openCancelModal,
    closeCancelModal,
    handleUpdate,
    confirmCancel,
  };
}
