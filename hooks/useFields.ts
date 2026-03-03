import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { Field } from "@/services/fieldService";

interface FieldsResponse {
  fields?: Field[];
}

export const useFields = () => {
  const [fields, setFields] = useState<Field[]>([]); // Iniciamos como array vacío siempre
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const getFields = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FIELDS_API_URL}/fields`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = (await res.json()) as Field[] | FieldsResponse;

      // Si el backend manda array directo o dentro de { fields }, lo soportamos.
      setFields(
        Array.isArray(data)
          ? data
          : Array.isArray(data.fields)
            ? data.fields
            : [],
      );
    } catch {
      setFields([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Esto es lo que dispara la carga al entrar
  useEffect(() => {
    getFields();
  }, [getFields]);

  return { fields, loading };
};
