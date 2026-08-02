import { z } from 'zod';

const repertoireSchema = z.object({
  entrada: z.string().optional(),
  atoPenitencial: z.string().optional(),
  salmo: z.string().optional(),
  aclamacao: z.string().optional(),
  ofertorio: z.string().optional(),
  santo: z.string().optional(),
  cordeiro: z.string().optional(),
  comunhao: z.string().optional(),
  final: z.string().optional(),
}).optional();

export const createMissaSchema = z.object({
  nome: z.string({ required_error: 'O nome da missa é obrigatório.' }).min(1, 'O nome não pode ser vazio.').trim(),
  data: z.string({ required_error: 'A data é obrigatória.' }).or(z.date()),
  repertorio: repertoireSchema,
});

export const updateMissaSchema = createMissaSchema.partial();

export type CreateMissaInput = z.infer<typeof createMissaSchema>;
export type UpdateMissaInput = z.infer<typeof updateMissaSchema>;
