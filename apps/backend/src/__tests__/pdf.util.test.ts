import { buildPdfSectionContent } from '../utils/pdf.util.js';

describe('buildPdfSectionContent', () => {
  it('deve renderizar uma música com título, tom e letra', () => {
    const content = buildPdfSectionContent({
      label: 'ATO_PENITENCIAL',
      song: {
        titulo: 'Canto de Entrada',
        tom: 'C',
        letra: [['Primeira linha'], ['Segunda linha']]
      }
    });

    expect(content).toEqual([
      { text: 'ATO PENITENCIAL', style: 'sectionTitle', margin: [0, 10, 0, 4] },
      { text: 'Canto de Entrada', style: 'songTitle' },
      { text: 'Tom: C', style: 'songTone' },
      { text: 'Primeira linha\n\nSegunda linha', style: 'lyrics' }
    ]);
  });

  it('deve indicar quando a música não foi selecionada', () => {
    expect(buildPdfSectionContent({ label: 'ENTRADA', song: null })).toEqual([
      { text: 'ENTRADA', style: 'sectionTitle', margin: [0, 10, 0, 4] },
      { text: 'Música não selecionada.', style: 'emptyText' }
    ]);
  });

  it('deve indicar tom não informado e letra ausente', () => {
    expect(buildPdfSectionContent({ label: 'FINAL', song: { titulo: 'Canto final' } })).toEqual([
      { text: 'FINAL', style: 'sectionTitle', margin: [0, 10, 0, 4] },
      { text: 'Canto final', style: 'songTitle' },
      { text: 'Tom: não informado', style: 'songTone' },
      { text: 'Sem letra cadastrada.', style: 'emptyText' }
    ]);
  });
});
