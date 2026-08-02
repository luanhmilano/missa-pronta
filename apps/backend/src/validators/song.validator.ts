import { z } from 'zod';
import { LiturgicalMoment } from '../models/song.model.js';

export const createSongSchema = z.object({
  titulo: z.string({ required_error: 'O título é obrigatório.' }).min(1, 'O título não pode ser vazio.').trim(),
  tom: z.string().optional().default(''),
  momentoLiturgico: z.nativeEnum(LiturgicalMoment, {
    errorMap: () => ({ message: 'Momento litúrgico inválido.' }),
  }),
  letra: z.array(z.array(z.string())).min(1, 'A letra deve conter ao menos uma estrofe.'),
});

export const updateSongSchema = createSongSchema.partial();

export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
