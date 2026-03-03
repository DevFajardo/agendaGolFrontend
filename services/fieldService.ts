export interface Field {
  id: number;
  name: string;
  location: string;
  description?: string;
  price_per_hour: number;
  capacity: number;
  is_active?: boolean;
}

export interface FieldFormData {
  name: string;
  location: string;
  price_per_hour: string;
  capacity: string;
  description: string;
}

interface FieldsResponse {
  fields?: Field[];
}

interface AvailabilityResponse {
  available_hours?: string[];
}

const fieldsApiUrl = process.env.NEXT_PUBLIC_FIELDS_API_URL;

// Servicio de canchas: encapsula CRUD y disponibilidad.
export const fieldService = {
  // Lista canchas para administración.
  list: async (token: string): Promise<Field[]> => {
    const res = await fetch(`${fieldsApiUrl}/?skip=0&limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });

    if (!res.ok) {
      throw new Error("No se pudieron cargar las canchas");
    }

    const data = (await res.json()) as FieldsResponse;
    return Array.isArray(data.fields) ? data.fields : [];
  },

  // Crea o actualiza cancha según exista editingId.
  save: async (
    token: string,
    payload: FieldFormData,
    editingId?: number | null,
  ): Promise<boolean> => {
    const price = parseFloat(payload.price_per_hour);
    const cap = parseInt(payload.capacity, 10);

    const url = editingId ? `${fieldsApiUrl}/${editingId}` : `${fieldsApiUrl}`;
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...payload,
        price_per_hour: price || 0,
        capacity: cap || 0,
        is_active: true,
      }),
    });

    return res.ok;
  },

  // Elimina cancha por id.
  remove: async (token: string, id: number): Promise<boolean> => {
    const res = await fetch(`${fieldsApiUrl}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.ok;
  },

  // Consulta horas disponibles para fecha/cancha específica.
  getAvailability: async (courtId: number, date: string): Promise<string[]> => {
    const res = await fetch(
      `${fieldsApiUrl}/${courtId}/availability?date=${encodeURIComponent(
        date.split("T")[0],
      )}`,
    );

    if (!res.ok) {
      throw new Error("No se pudo consultar disponibilidad");
    }

    const data = (await res.json()) as AvailabilityResponse;
    return Array.isArray(data.available_hours) ? data.available_hours : [];
  },
};
