import { useCallback, useEffect, useState } from "react";
import { fieldService, type Field, type FieldFormData } from "@/services/fieldService";

interface UseAdminFieldsParams {
  token: string | null;
  page: number;
  limit: number;
}

// Hook de datos para gestión admin de canchas con paginación local.
export function useAdminFields({ token, page, limit }: UseAdminFieldsParams) {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const loadFields = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      // Obtiene catálogo completo y luego aplica paginación en cliente.
      const allFields = await fieldService.list(token);
      const activeFields = allFields.filter((f) => f.is_active !== false);
      const sorted = activeFields.reverse();
      const startIndex = (page - 1) * limit;
      const paginatedFields = sorted.slice(startIndex, startIndex + limit);

      setFields(paginatedFields);
      setHasMore(sorted.length > startIndex + limit);
    } finally {
      setLoading(false);
    }
  }, [token, page, limit]);

  const saveField = useCallback(
    async (formData: FieldFormData, editingId?: number | null) => {
      if (!token) return false;
      // Guarda (create/update) y recarga para mantener lista sincronizada.
      const success = await fieldService.save(token, formData, editingId);
      if (success) {
        await loadFields();
      }
      return success;
    },
    [token, loadFields],
  );

  const deleteField = useCallback(
    async (fieldId: number) => {
      if (!token) return false;
      // Elimina y vuelve a consultar para reflejar estado final.
      const success = await fieldService.remove(token, fieldId);
      if (success) {
        await loadFields();
      }
      return success;
    },
    [token, loadFields],
  );

  useEffect(() => {
    // Carga inicial y recarga automática al cambiar token/página/límite.
    if (token) {
      loadFields();
    }
  }, [token, loadFields]);

  return {
    fields,
    loading,
    hasMore,
    loadFields,
    saveField,
    deleteField,
  };
}
