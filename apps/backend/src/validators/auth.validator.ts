import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({ required_error: 'O email é obrigatório.' }).email('Email em formato inválido.'),
  password: z.string({ required_error: 'A senha é obrigatória.' }).min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nome: z.string({ required_error: 'O nome é obrigatório.' }).min(2, 'O nome deve ter no mínimo 2 caracteres.').trim(),
  email: z.string({ required_error: 'O email é obrigatório.' }).email('Email em formato inválido.').trim(),
  password: z.string({ required_error: 'A senha é obrigatória.' }).min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

