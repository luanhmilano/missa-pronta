export const REPERTOIRE_FIELDS = [
  'repertorio.entrada',
  'repertorio.atoPenitencial',
  'repertorio.salmo',
  'repertorio.aclamacao',
  'repertorio.ofertorio',
  'repertorio.santo',
  'repertorio.cordeiro',
  'repertorio.comunhao',
  'repertorio.final'
].join(' ');

export type PopulatedSong = {
  _id?: string | { toString(): string };
  titulo: string;
  tom?: string;
  letra?: string[][];
  momentoLiturgico?: string;
};

export type PopulatedMissa = {
  _id: string | { toString(): string };
  nome: string;
  data: Date | string;
  repertorio: Record<string, PopulatedSong | null | undefined>;
};

export const REPERTOIRE_LABELS: Record<string, string> = {
  entrada: 'ENTRADA',
  atoPenitencial: 'ATO_PENITENCIAL',
  salmo: 'SALMO',
  aclamacao: 'ACLAMACAO',
  ofertorio: 'OFERTORIO',
  santo: 'SANTO',
  cordeiro: 'CORDEIRO',
  comunhao: 'COMUNHAO',
  final: 'FINAL'
};

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeZone: 'UTC'
  }).format(d);
}

export function formatLyricsText(letra?: string[][]): string {
  if (!letra || !letra.length) return '';
  return letra
    .map(strophe => (Array.isArray(strophe) ? strophe.join('\n') : strophe))
    .join('\n\n');
}

export function buildMassViewModel(mass: PopulatedMissa) {
  const sections = Object.entries(REPERTOIRE_LABELS).map(([key, label]) => ({
    key,
    label,
    song: mass.repertorio[key] ?? null
  }));

  return {
    mass,
    formattedDate: formatDate(new Date(mass.data)),
    sections
  };
}
