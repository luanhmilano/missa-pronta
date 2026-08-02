import { loginSchema } from '../validators/auth.validator.js';
import { createSongSchema } from '../validators/song.validator.js';
import { createMissaSchema } from '../validators/missa.validator.js';

describe('Zod Validators', () => {
  describe('loginSchema', () => {
    it('deve validar um login correto', () => {
      const validData = { email: 'admin@test.com', password: 'password123' };
      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('deve rejeitar um email inválido', () => {
      const invalidData = { email: 'email_invalido', password: 'password123' };
      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('createSongSchema', () => {
    it('deve validar uma música válida', () => {
      const validSong = {
        titulo: 'Glória a Deus nas Alturas',
        tom: 'E',
        momentoLiturgico: 'ATO_PENITENCIAL',
        letra: [['Glória a Deus nas alturas'], ['E paz na terra aos homens']],
      };
      const result = createSongSchema.safeParse(validSong);

      expect(result.success).toBe(true);
    });

    it('deve rejeitar momento litúrgico inválido', () => {
      const invalidSong = {
        titulo: 'Música Inválida',
        tom: 'C',
        momentoLiturgico: 'MOMENTO_INEXISTENTE',
        letra: [['Test']],
      };
      const result = createSongSchema.safeParse(invalidSong);

      expect(result.success).toBe(false);
    });
  });

  describe('createMissaSchema', () => {
    it('deve validar uma missa válida', () => {
      const validMissa = {
        nome: 'Missa de Domingo',
        data: '2026-08-01',
        repertorio: { entrada: '679c67b9389efb367104b2b1' },
      };
      const result = createMissaSchema.safeParse(validMissa);

      expect(result.success).toBe(true);
    });
  });
});
