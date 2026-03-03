import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// 1. Instancia para el Servicio de Autenticación (Puerto 8000)
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_AUTH,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Instancia para el Servicio de Canchas y Reservas (Puerto 8002)
export const courtsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_FIELDS,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Interceptor Único para inyectar el Token
// Creamos una función para no repetir código en ambas instancias
const injectToken = (config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Aplicamos el interceptor a ambas APIs (por si el auth necesita token para logout/perfil)
authApi.interceptors.request.use(injectToken);
courtsApi.interceptors.request.use(injectToken);

// Mantenemos un export default apuntando a authApi por compatibilidad con tu Login actual
export default authApi;
