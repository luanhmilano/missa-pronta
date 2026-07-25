import PdfPrinter from 'pdfmake';
import type { PopulatedMissa } from './missa.util.js';
import { buildMassViewModel, formatLyricsText } from './missa.util.js';

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

export function getPdfFileName(mass: PopulatedMissa): string {
  const safeName = mass.nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return `${safeName || 'missa'}.pdf`;
}

export async function renderMassPdfBuffer(mass: PopulatedMissa): Promise<Buffer> {
  const printer = new PdfPrinter(fonts);
  const viewModel = buildMassViewModel(mass);

  const content: any[] = [
    { text: 'Arquidiocese Metropolitana de Belém', style: 'instHeader', alignment: 'center' },
    { text: 'Basílica Santuário de Nossa Senhora de Nazaré do Desterro', style: 'instHeader', alignment: 'center' },
    { text: 'Juventude Nazarena', style: 'instHeader', alignment: 'center' },
    { text: 'Movimento Sementes da Misericórdia', style: 'instHeader', alignment: 'center' },
    { text: mass.nome, style: 'eventTitle', alignment: 'center', margin: [0, 8, 0, 2] },
    { text: viewModel.formattedDate, style: 'eventDate', alignment: 'center', margin: [0, 0, 0, 20] }
  ];

  for (const section of viewModel.sections) {
    const formattedLabel = section.label.replace(/_/g, ' ').toUpperCase();

    content.push({
      text: formattedLabel,
      style: 'sectionTitle',
      margin: [0, 10, 0, 4]
    });

    if (section.song) {
      content.push({
        text: section.song.titulo,
        style: 'songTitle'
      });
      content.push({
        text: `Tom: ${section.song.tom || 'não informado'}`,
        style: 'songTone'
      });

      const lyricsFormatted = formatLyricsText(section.song.letra);
      if (lyricsFormatted) {
        content.push({
          text: lyricsFormatted,
          style: 'lyrics'
        });
      } else {
        content.push({
          text: 'Sem letra cadastrada.',
          style: 'emptyText'
        });
      }
    } else {
      content.push({
        text: 'Música não selecionada.',
        style: 'emptyText'
      });
    }
  }

  const docDefinition: any = {
    content,
    pageSize: 'A4',
    pageMargins: [40, 45, 40, 40],
    header: function (currentPage: number, pageCount: number, pageSize: { width: number; height: number }) {
      const halfWidth = pageSize.width / 2;
      const barHeight = 25;
      return {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: halfWidth,
            h: barHeight,
            color: '#0044CC'
          },
          {
            type: 'rect',
            x: halfWidth,
            y: 0,
            w: halfWidth,
            h: barHeight,
            color: '#C00000'
          }
        ]
      };
    },
    styles: {
      instHeader: {
        fontSize: 10.5,
        bold: true,
        color: '#000000',
        lineHeight: 1.15
      },
      eventTitle: {
        fontSize: 16,
        bold: true,
        color: '#000000'
      },
      eventDate: {
        fontSize: 11,
        italics: true,
        color: '#1F2937'
      },
      sectionTitle: {
        fontSize: 13.5,
        bold: true,
        color: '#C00000',
        decoration: 'underline'
      },
      songTitle: {
        fontSize: 12,
        bold: true,
        color: '#0044CC',
        margin: [0, 4, 0, 2]
      },
      songTone: {
        fontSize: 10,
        italics: true,
        bold: true,
        color: '#C00000',
        margin: [0, 0, 0, 4]
      },
      lyrics: {
        fontSize: 11.5,
        bold: true,
        color: '#000000',
        lineHeight: 1.3,
        margin: [0, 4, 0, 18]
      },
      emptyText: {
        fontSize: 10.5,
        italics: true,
        color: '#1F2937',
        margin: [0, 2, 0, 18]
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  return new Promise((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', (err: Error) => reject(err));

    pdfDoc.end();
  });
}
