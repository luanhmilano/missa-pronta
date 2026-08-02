import { renderMassHtml } from '../utils/html.util.js';
import type { PopulatedMissa } from '../utils/missa.util.js';

describe('html.util', () => {
  it('deve renderizar o HTML da missa corretamente com os títulos e estrofes', () => {
    const missaMock: PopulatedMissa = {
      _id: '123',
      nome: 'Missa de Teste',
      data: '2026-08-01T00:00:00.000Z',
      repertorio: {
        entrada: {
          _id: 'song-1',
          titulo: 'Canto de Entrada',
          tom: 'C',
          momentoLiturgico: 'ENTRADA' as any,
          letra: [
            ['Estrofe 1 linha 1', 'Estrofe 1 linha 2'],
            ['Estrofe 2 linha 1'],
          ],
        },
      },
    };

    const html = renderMassHtml(missaMock);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Missa de Teste');
    expect(html).toContain('Canto de Entrada');
    expect(html).toContain('Tom: C');
    expect(html).toContain('Estrofe 1 linha 1');
    expect(html).toContain('Estrofe 1 linha 2');
    expect(html).toContain('Estrofe 2 linha 1');
  });

  it('deve lidar graciosamente com momentos litúrgicos ausentes', () => {
    const missaSemRepertorio: PopulatedMissa = {
      _id: '456',
      nome: 'Missa Vazia',
      data: '2026-08-01T00:00:00.000Z',
      repertorio: {},
    };

    const html = renderMassHtml(missaSemRepertorio);

    expect(html).toContain('Missa Vazia');
    expect(html).not.toContain('Canto de Entrada');
  });
});
