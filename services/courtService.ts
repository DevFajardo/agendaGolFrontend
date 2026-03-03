import api from './apiConfig';
import { Court } from '@/types';

export const courtService = {
  // Obtener todas las canchas para el listado 
  getAllCourts: async (): Promise<Court[]> => {
    const { data } = await api.get<Court[]>('/courts');
    return data;
  },

  // Obtener una sola cancha por ID para ver disponibilidad 
  getCourtById: async (id: string): Promise<Court> => {
    const { data } = await api.get<Court>(`/courts/${id}`);
    return data;
  }
};