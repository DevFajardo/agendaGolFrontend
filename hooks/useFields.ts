import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const useFields = () => {
  const [fields, setFields] = useState([]); // Iniciamos como array vacío siempre
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
      const data = await res.json();

      // Si el backend manda un array, lo guardamos. Si no, forzamos array vacío.
      setFields(Array.isArray(data) ? data : []);
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
