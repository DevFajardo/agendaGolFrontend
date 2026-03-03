"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { AdminFieldCard } from "@/components/cards/AdminFieldCard";
import { useAdminFields } from "@/hooks/useAdminFields";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useAdminFieldModal } from "@/hooks/useAdminFieldModal";
import { useTimedStatusFeedback } from "@/hooks/useTimedStatusFeedback";

export default function AdminPage() {
  const { token } = useAuthStore();

  // 1) Feedback temporal para confirmaciones de CRUD.
  const { feedback, showSuccess } = useTimedStatusFeedback(3000);

  // 2) Paginación del grid de canchas.
  const [page, setPage] = useState(1);
  const limit = 6;

  // 3) Estado de modales y envío.
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isModalOpen,
    editingId,
    error,
    formData,
    setError,
    setFormData,
    openCreate,
    openEdit,
    closeModal,
    resetForm,
  } = useAdminFieldModal();

  const { fields, loading, hasMore, saveField, deleteField } = useAdminFields({
    token,
    page,
    limit,
  });

  // Bloquea scroll de fondo mientras hay modal activo.
  useBodyScrollLock(isModalOpen || deleteConfirmId !== null, "15px");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación mínima previa al envío.
    const price = parseFloat(formData.price_per_hour);
    const cap = parseInt(formData.capacity);

    if (price < 0 || cap < 0) {
      setError("El precio y la capacidad no pueden ser valores negativos 🚫");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const saved = await saveField(formData, editingId);

      if (saved) {
        showSuccess(editingId ? "Cancha actualizada ✨" : "Cancha creada ✨");
        closeModal();
        resetForm();
        if (!editingId) setPage(1);
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("Hubo un error al conectar con el servidor 🔌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId || !token) return;
    setIsSubmitting(true);
    try {
      // Elimina y refresca listado desde hook de datos.
      const removed = await deleteField(deleteConfirmId);
      if (removed) {
        showSuccess("Cancha eliminada correctamente 🗑️");
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skeleton inicial mientras se obtiene la página actual.
  if (loading) {
    return (
      <div className="space-y-8 p-6 max-w-7xl mx-auto animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-slate-200 rounded-xl"></div>
          <div className="h-14 w-44 bg-slate-100 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm h-[300px]"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Gestión de Canchas"
        action={
          <button
            onClick={openCreate}
            className="cursor-pointer bg-green-500 hover:bg-green-400 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase shadow-xl transition-all"
          >
            + Nueva Cancha
          </button>
        }
      />

      {fields.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-5xl mb-4">🏟️</p>
          <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter">
            No hay canchas registradas
          </h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fields.map((field) => (
          <AdminFieldCard
            key={field.id}
            field={field}
            onEdit={openEdit}
            onDelete={setDeleteConfirmId}
          />
        ))}
      </div>

      {/* PAGINACIÓN */}
      <PaginationControls
        page={page}
        hasMore={hasMore}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />

      {/* MODAL ELIMINAR */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="¿Borrar cancha?"
        confirmText="Sí, borrar"
        cancelText="No"
        onCancel={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
      />

      {/* MODAL CREAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <button
              onClick={closeModal}
              className="cursor-pointer absolute top-8 right-8 text-slate-400 hover:text-red-500 transition-colors"
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
            <h2 className="text-3xl font-black text-slate-900 uppercase mb-8">
              {editingId ? "Editar" : "Nueva"}
            </h2>

            {/* ERROR DENTRO DEL FORMULARIO */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-black uppercase mb-4 animate-bounce">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="NOMBRE DE LA CANCHA"
                className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                required
                placeholder="UBICACIÓN"
                className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <textarea
                placeholder="DESCRIPCIÓN"
                className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-green-500/20 transition-all min-h-[100px] resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">
                    $
                  </span>
                  <input
                    required
                    type="number"
                    placeholder="PRECIO"
                    className="w-full bg-slate-50 p-5 pl-10 rounded-2xl font-black outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    value={formData.price_per_hour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_hour: e.target.value,
                      })
                    }
                  />
                </div>
                <input
                  required
                  type="number"
                  placeholder="CAPACIDAD"
                  className="w-full bg-slate-50 p-5 rounded-2xl font-black outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                />
              </div>
              <button
                disabled={isSubmitting}
                className="cursor-pointer w-full bg-slate-950 text-white py-5 mt-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-green-600 active:scale-95 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? "Sincronizando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST DE ÉXITO - ESQUINA INFERIOR DERECHA */}
      {feedback.show && (
        <div className="fixed bottom-8 right-8 z-[200] bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-2xl animate-in fade-in slide-in-from-right-4">
          {feedback.msg}
        </div>
      )}
    </div>
  );
}
