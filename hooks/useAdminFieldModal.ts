import { useState } from "react";
import type { Field, FieldFormData } from "@/services/fieldService";

const initialFormData: FieldFormData = {
  name: "",
  location: "",
  price_per_hour: "",
  capacity: "",
  description: "",
};

// Hook de estado para modal de canchas (crear/editar) y formulario asociado.
export function useAdminFieldModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FieldFormData>(initialFormData);

  const openCreate = () => {
    // Reinicia formulario para alta nueva.
    setEditingId(null);
    setError(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEdit = (field: Field) => {
    // Precarga formulario con datos existentes para edición.
    setEditingId(field.id);
    setError(null);
    setFormData({
      name: field.name,
      location: field.location,
      price_per_hour: field.price_per_hour.toString(),
      capacity: field.capacity.toString(),
      description: field.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const resetForm = () => {
    // Limpieza posterior al guardado/cancelación.
    setEditingId(null);
    setFormData(initialFormData);
  };

  return {
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
  };
}
