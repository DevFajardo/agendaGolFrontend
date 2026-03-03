export interface Booking {
	id: number;
	field_id: number;
	field_name?: string;
	user_id?: number | string;
	user_email?: string;
	start_time: string;
	duration_hours: number;
	status?: string;
	notes?: string;
}

interface BookingListResponse {
	reservations?: Booking[];
}

interface CancelResponseError {
	detail?: string;
}

const reservationsApiUrl =
	process.env.NEXT_PUBLIC_RESERVATIONS_API_URL ||
	(process.env.NEXT_PUBLIC_BASE_URL_FIELDS
		? `${process.env.NEXT_PUBLIC_BASE_URL_FIELDS.replace(/\/$/, "")}/reservations`
		: "");

const getReservationsApiUrl = () => {
	if (!reservationsApiUrl) {
		throw new Error(
			"No está configurada la URL de reservas (NEXT_PUBLIC_RESERVATIONS_API_URL o NEXT_PUBLIC_BASE_URL_FIELDS)",
		);
	}

	return reservationsApiUrl;
};

// Servicio de reservas: concentra llamadas HTTP y normaliza respuestas del backend.
export const bookingService = {
	// Lista global de reservas (uso administrativo).
	listAll: async (token?: string | null): Promise<Booking[]> => {
		const baseUrl = getReservationsApiUrl();
		const cleanToken = token?.replace(/['"]+/g, "").trim();
		const res = await fetch(`${baseUrl}`, {
			headers: cleanToken ? { Authorization: `Bearer ${cleanToken}` } : undefined,
		});
		if (!res.ok) {
			throw new Error(`No se pudieron cargar las reservas (HTTP ${res.status})`);
		}

		const data = (await res.json()) as BookingListResponse;
		return Array.isArray(data.reservations) ? data.reservations : [];
	},

	// Lista reservas del usuario autenticado.
	listMine: async (token: string, limit = 50): Promise<Booking[]> => {
		const baseUrl = getReservationsApiUrl();
		const cleanToken = token.replace(/['"]+/g, "").trim();
		const res = await fetch(`${baseUrl}/my?skip=0&limit=${limit}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				Accept: "application/json",
			},
		});

		if (!res.ok) {
			throw new Error(`Error del servidor: ${res.status}`);
		}

		// Compatibilidad con dos posibles contratos: array directo o { reservations }.
		const data = (await res.json()) as Booking[] | BookingListResponse;
		return Array.isArray(data)
			? data
			: Array.isArray(data.reservations)
				? data.reservations
				: [];
	},

	// Crea una nueva reserva.
	create: async (
		token: string,
		payload: {
			field_id: number;
			start_time: string;
			duration_hours: number;
			notes?: string;
		},
	): Promise<Response> => {
		const baseUrl = getReservationsApiUrl();
		return fetch(`${baseUrl}/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		});
	},

	// Actualiza únicamente la duración de una reserva.
	updateDuration: async (
		token: string,
		reservationId: number,
		duration: number,
	): Promise<boolean> => {
		const baseUrl = getReservationsApiUrl();
		const cleanToken = token.replace(/"/g, "");
		const response = await fetch(`${baseUrl}/${reservationId}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ duration_hours: duration }),
		});

		return response.ok;
	},

	// Cancela una reserva y propaga mensaje de backend cuando exista.
	cancel: async (token: string, reservationId: number): Promise<void> => {
		const baseUrl = getReservationsApiUrl();
		const cleanToken = token.replace(/['"]+/g, "").trim();
		const res = await fetch(`${baseUrl}/${reservationId}/cancel`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ reason: "Cancelado por el usuario" }),
		});

		if (!res.ok) {
			const contentType = res.headers.get("content-type");
			let data: CancelResponseError | null = null;

			if (contentType && contentType.includes("application/json")) {
				data = (await res.json()) as CancelResponseError;
			}

			throw new Error(data?.detail || "Esta reserva no puede ser cancelada");
		}
	},
};
