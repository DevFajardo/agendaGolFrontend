import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

interface MockUser {
  id: number;
  email: string;
  password: string;
  username: string;
  is_admin: boolean;
}

interface MockField {
  id: number;
  name: string;
  location: string;
  description: string;
  price_per_hour: number;
  capacity: number;
  is_active: boolean;
}

interface MockBooking {
  id: number;
  field_id: number;
  field_name: string;
  user_id: number;
  user_email: string;
  start_time: string;
  duration_hours: number;
  status: "confirmada" | "cancelada";
  notes?: string;
}

const DEFAULT_SLOT_HOURS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const createIsoDate = (daysFromToday: number, hour = "19:00") => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const [hh, mm] = hour.split(":");
  date.setHours(Number(hh), Number(mm), 0, 0);
  return date.toISOString();
};

const mockUsers: MockUser[] = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "123456",
    username: "admin",
    is_admin: true,
  },
  {
    id: 2,
    email: "user@gmail.com",
    password: "123456",
    username: "jugador_demo",
    is_admin: false,
  },
];

let mockFields: MockField[] = [
  {
    id: 1,
    name: "Cancha Norte",
    location: "Av. Principal 123",
    description: "Césped sintético, iluminación LED.",
    price_per_hour: 45,
    capacity: 12,
    is_active: true,
  },
  {
    id: 2,
    name: "Cancha Sur",
    location: "Calle Deportiva 88",
    description: "Ideal para partidos nocturnos.",
    price_per_hour: 55,
    capacity: 14,
    is_active: true,
  },
  {
    id: 3,
    name: "Cancha Techada",
    location: "Zona Centro, Bloque B",
    description: "Cubierta, apta para lluvia.",
    price_per_hour: 65,
    capacity: 10,
    is_active: true,
  },
];

let mockBookings: MockBooking[] = [
  {
    id: 1,
    field_id: 1,
    field_name: "Cancha Norte",
    user_id: 2,
    user_email: "user@gmail.com",
    start_time: createIsoDate(1, "18:00"),
    duration_hours: 2,
    status: "confirmada",
    notes: "Partido amistoso",
  },
  {
    id: 2,
    field_id: 2,
    field_name: "Cancha Sur",
    user_id: 2,
    user_email: "user@gmail.com",
    start_time: createIsoDate(3, "20:00"),
    duration_hours: 1,
    status: "confirmada",
  },
  {
    id: 3,
    field_id: 3,
    field_name: "Cancha Techada",
    user_id: 1,
    user_email: "admin@gmail.com",
    start_time: createIsoDate(2, "17:00"),
    duration_hours: 1,
    status: "cancelada",
  },
];

const base64UrlEncode = (raw: string) => {
  const base64 =
    typeof window !== "undefined"
      ? window.btoa(raw)
      : Buffer.from(raw, "utf8").toString("base64");

  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};

export const shouldUseMocks = () => {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") return true;

  const hasAuth = Boolean(process.env.NEXT_PUBLIC_BASE_URL_AUTH);
  const hasFields = Boolean(
    process.env.NEXT_PUBLIC_FIELDS_API_URL || process.env.NEXT_PUBLIC_BASE_URL_FIELDS,
  );
  const hasReservations = Boolean(
    process.env.NEXT_PUBLIC_RESERVATIONS_API_URL || process.env.NEXT_PUBLIC_BASE_URL_FIELDS,
  );

  return !hasAuth || !hasFields || !hasReservations;
};

export const decodeTokenPayload = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json =
      typeof window !== "undefined"
        ? window.atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");

    return JSON.parse(json) as {
      user_id?: number;
      email?: string;
      is_admin?: boolean;
      sub?: string;
    };
  } catch {
    return null;
  }
};

const createMockToken = (user: MockUser) => {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      user_id: user.id,
      sub: user.username,
      email: user.email,
      is_admin: user.is_admin,
      mock: true,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    }),
  );

  return `${header}.${payload}.mock-signature`;
};

export const mockAuth = {
  login: (credentials: LoginInput) => {
    const user = mockUsers.find(
      (entry) =>
        entry.email.toLowerCase() === credentials.email.toLowerCase() &&
        entry.password === credentials.password,
    );

    if (!user) {
      throw new Error("Credenciales inválidas. Usa admin@gmail.com o user@gmail.com con 123456");
    }

    return {
      access_token: createMockToken(user),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_admin: user.is_admin,
      },
    };
  },

  register: (payload: RegisterInput) => {
    const exists = mockUsers.some(
      (user) => user.email.toLowerCase() === payload.email.toLowerCase(),
    );

    if (exists) {
      throw new Error("Este correo ya está registrado en el modo demo");
    }

    const newUser: MockUser = {
      id: Math.max(...mockUsers.map((user) => user.id), 0) + 1,
      email: payload.email,
      password: payload.password,
      username: payload.username,
      is_admin: false,
    };

    mockUsers.push(newUser);

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      is_admin: newUser.is_admin,
    };
  },
};

export const mockFieldsService = {
  list: () => [...mockFields],

  save: (payload: {
    name: string;
    location: string;
    price_per_hour: string;
    capacity: string;
    description: string;
  }, editingId?: number | null) => {
    const parsedField = {
      name: payload.name,
      location: payload.location,
      description: payload.description,
      price_per_hour: Number(payload.price_per_hour) || 0,
      capacity: Number(payload.capacity) || 0,
      is_active: true,
    };

    if (editingId) {
      mockFields = mockFields.map((field) =>
        field.id === editingId ? { ...field, ...parsedField } : field,
      );
      return true;
    }

    const nextId = Math.max(...mockFields.map((field) => field.id), 0) + 1;
    mockFields = [{ id: nextId, ...parsedField }, ...mockFields];
    return true;
  },

  remove: (id: number) => {
    mockFields = mockFields.filter((field) => field.id !== id);
    mockBookings = mockBookings.filter((booking) => booking.field_id !== id);
    return true;
  },

  availability: (fieldId: number, date: string) => {
    const busySlots = new Set(
      mockBookings
        .filter(
          (booking) =>
            booking.field_id === fieldId &&
            booking.status !== "cancelada" &&
            booking.start_time.split("T")[0] === date,
        )
        .map((booking) => booking.start_time.split("T")[1]?.substring(0, 5)),
    );

    return DEFAULT_SLOT_HOURS.filter((hour) => !busySlots.has(hour));
  },
};

const resolveUserFromToken = (token?: string | null) => {
  if (!token) return null;

  const payload = decodeTokenPayload(token);
  if (!payload) return null;

  return (
    mockUsers.find(
      (user) =>
        (payload.user_id && user.id === payload.user_id) ||
        (payload.email && user.email.toLowerCase() === payload.email.toLowerCase()),
    ) || null
  );
};

export const mockBookingService = {
  listAll: () => [...mockBookings],

  listMine: (token?: string | null) => {
    const user = resolveUserFromToken(token);
    if (!user) return [];
    return mockBookings.filter((booking) => booking.user_id === user.id);
  },

  create: (
    token: string,
    payload: {
      field_id: number;
      start_time: string;
      duration_hours: number;
      notes?: string;
    },
  ) => {
    const user = resolveUserFromToken(token);
    if (!user) {
      return new Response(JSON.stringify({ detail: "No autenticado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const date = payload.start_time.split("T")[0];
    const hour = payload.start_time.split("T")[1]?.substring(0, 5);

    const alreadyTaken = mockBookings.some(
      (booking) =>
        booking.field_id === payload.field_id &&
        booking.status !== "cancelada" &&
        booking.start_time.split("T")[0] === date &&
        booking.start_time.split("T")[1]?.substring(0, 5) === hour,
    );

    if (alreadyTaken) {
      return new Response(
        JSON.stringify({ detail: "Horario ocupado en modo demo" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const field = mockFields.find((entry) => entry.id === payload.field_id);
    const newBooking: MockBooking = {
      id: Math.max(...mockBookings.map((booking) => booking.id), 0) + 1,
      field_id: payload.field_id,
      field_name: field?.name || "Cancha Demo",
      user_id: user.id,
      user_email: user.email,
      start_time: payload.start_time,
      duration_hours: payload.duration_hours,
      status: "confirmada",
      notes: payload.notes,
    };

    mockBookings = [newBooking, ...mockBookings];

    return new Response(JSON.stringify(newBooking), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },

  updateDuration: (reservationId: number, duration: number) => {
    mockBookings = mockBookings.map((booking) =>
      booking.id === reservationId ? { ...booking, duration_hours: duration } : booking,
    );
    return true;
  },

  cancel: (reservationId: number) => {
    const exists = mockBookings.some((booking) => booking.id === reservationId);
    if (!exists) {
      throw new Error("La reserva no existe en modo demo");
    }

    mockBookings = mockBookings.map((booking) =>
      booking.id === reservationId ? { ...booking, status: "cancelada" } : booking,
    );
  },
};

export const mockStatsService = {
  getDashboardData: () => {
    const totalUsers = mockUsers.length;
    const totalReservations = mockBookings.filter(
      (booking) => booking.status === "confirmada",
    ).length;

    const fieldsStatistics = mockFields.map((field) => ({
      field_name: field.name,
      total_reservations: mockBookings.filter(
        (booking) => booking.field_id === field.id && booking.status === "confirmada",
      ).length,
    }));

    const dailyRevenue: Record<string, number> = {};
    for (let index = 0; index < 7; index += 1) {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const key = date.toISOString().split("T")[0];
      const dayRevenue = mockBookings
        .filter(
          (booking) =>
            booking.status === "confirmada" && booking.start_time.startsWith(key),
        )
        .reduce((acc, booking) => {
          const fieldPrice =
            mockFields.find((field) => field.id === booking.field_id)?.price_per_hour || 0;
          return acc + fieldPrice * booking.duration_hours;
        }, 0);

      dailyRevenue[key] = dayRevenue;
    }

    const totalPeriodRevenue = Object.values(dailyRevenue).reduce(
      (acc, value) => acc + value,
      0,
    );

    return {
      general: {
        general_stats: {
          total_users: totalUsers,
          total_reservations: totalReservations,
        },
      },
      fields: {
        fields_statistics: fieldsStatistics,
      },
      revenue: {
        period_days: 7,
        total_period_revenue: totalPeriodRevenue,
        daily_revenue: dailyRevenue,
      },
    };
  },
};
