import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Introduce un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
export const registerSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'), // Cambiado de name a username
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;