"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { StatusModal } from "@/components/modals/StatusModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { DurationSelector } from "@/components/shared/DurationSelector";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useMyReservations } from "@/hooks/useMyReservations";
import { useReservationFilters } from "@/hooks/useReservationFilters";
import { useReservationActions } from "@/hooks/useReservationActions";
import { useStatusFeedback } from "@/hooks/useStatusFeedback";

export default function ReservationsPage() {
  const { token } = useAuthStore();
  // 1) Fuente de datos de reservas del usuario.
  const { reservations, setReservations, isLoading, fetchMyReservations } =
    useMyReservations({
      token,
      limit: 10,
      autoFetch: true,
    });
  // 2) Filtro por pestaña y configuración visual asociada.
  const {
    activeTab,
    setActiveTab,
    filteredReservations,
    statusConfig,
    emptyMessages,
  } = useReservationFilters(reservations);
  // 3) Feedback de estado para acciones de edición/cancelación.
  const { feedback, closeFeedback, showSuccess, showError } =
    useStatusFeedback();

  // 4) Acciones de negocio y estados de modales.
  const {
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
  } = useReservationActions({
    token,
    setReservations,
    showSuccess,
    showError,
  });

  // Evita scroll de fondo cuando hay modal abierto.
  useBodyScrollLock(Boolean(editingRes || showCancelModal));

  return (
    <div className="p-2 max-w-5xl mx-auto">
      <PageHeader
        title="Mis Partidos"
        className="mb-10"
        action={
          <button
            onClick={fetchMyReservations}
            className="px-5 py-2 bg-green-500 border border-green-200 rounded-2xl font-bold shadow-sm hover:bg-green-400 transition-all cursor-pointer"
          >
            Refrescar
          </button>
        }
      />
      {/* NAVEGACIÓN DE PESTAÑAS */}
      <div className="flex gap-2 mb-8 bg-slate-100 p-2 rounded-3xl w-fit">
        {(["activas", "canceladas"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="text-center py-20 font-black text-slate-300 animate-pulse uppercase tracking-widest">
          Conectando con el estadio...
        </div>
      ) : filteredReservations.length === 0 ? (
        <EmptyState
          icon={emptyMessages[activeTab].icon}
          title={emptyMessages[activeTab].title}
          description={emptyMessages[activeTab].desc}
        />
      ) : (
        /* --- LISTA DE RESERVAS --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
          {filteredReservations.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${statusConfig[activeTab].styles}`}
                >
                  {statusConfig[activeTab].text}
                </span>
                <span className="text-slate-300 font-bold text-xs italic">
                  #{res.id}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase mb-4 group-hover:text-blue-600 transition-colors">
                {res.field_name}
              </h3>
              <div className="space-y-3 text-slate-500 font-bold text-sm mb-8">
                <p className="flex items-center gap-2">
                  📅{" "}
                  {new Date(res.start_time).toLocaleDateString("es-ES", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="flex items-center gap-2">
                  🕒{" "}
                  {new Date(res.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  <span className="text-blue-500">({res.duration_hours}h)</span>
                </p>
              </div>
              <div className="flex gap-3">
                {/* SOLO MOSTRAR ACCIONES SI LA RESERVA ESTÁ ACTIVA */}
                {activeTab === "activas" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(res)}
                      className="px-8 cursor-pointer flex-1 py-4 bg-green-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] transition-all"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openCancelModal(res.id)}
                      className="px-8 cursor-pointer flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {editingRes && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl border border-white/20">
            <h2 className="text-3xl font-black text-slate-900 uppercase leading-none mb-2 italic">
              Editar Duración
            </h2>
            <p className="text-slate-400 font-bold text-sm mb-8 uppercase tracking-tighter">
              {editingRes.field_name}
            </p>

            <DurationSelector
              value={newDuration}
              onChange={setNewDuration}
              containerClassName="flex gap-3 mb-10"
              buttonClassName={(option, isActive) =>
                `cursor-pointer flex-1 py-5 rounded-3xl font-black transition-all border-4 ${
                  isActive
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-slate-100 bg-slate-50 text-slate-400"
                }`
              }
              renderLabel={(option) =>
                `${option} ${option === 1 ? "HORA" : "HORAS"}`
              }
            />

            <div className="space-y-3">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="cursor-pointer w-full py-5 bg-green-500 text-white rounded-[2rem] font-black uppercase shadow-lg shadow-blue-200 active:scale-95 transition-all"
              >
                {isUpdating ? "GUARDANDO..." : "CONFIRMAR CAMBIO"}
              </button>
              <button
                onClick={closeEdit}
                className="cursor-pointer w-full py-3 text-red-400 font-black uppercase text-[10px] tracking-widest"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE CANCELACIÓN BONITO */}
      <ConfirmModal
        isOpen={showCancelModal}
        title="¿CANCELAR PARTIDO?"
        description="Esta acción liberará el cupo y no se puede deshacer."
        confirmText="SÍ, CANCELAR AHORA"
        cancelText="VOLVER ATRÁS"
        onCancel={closeCancelModal}
        onConfirm={confirmCancel}
        verticalActions
        overlayClassName="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[60] p-6 animate-in fade-in duration-300"
        contentClassName="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl border border-white/20 text-center animate-in zoom-in duration-200"
        confirmButtonClassName="w-full py-5 bg-red-600 text-white rounded-[2rem] font-black uppercase shadow-lg shadow-red-200 active:scale-95 transition-all"
        cancelButtonClassName="w-full py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest"
      />
      <StatusModal
        show={feedback.show}
        type={feedback.type}
        msg={feedback.msg}
        onClose={closeFeedback}
      />
    </div>
  );
}
