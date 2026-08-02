import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { Missa, MissaSongRef, Song } from '../types';

export const MASSES_PER_PAGE = 3;

export const REPERTOIRE_FIELDS = [
  { key: 'entrada', label: 'ENTRADA' },
  { key: 'atoPenitencial', label: 'ATO_PENITENCIAL' },
  { key: 'salmo', label: 'SALMO' },
  { key: 'aclamacao', label: 'ACLAMACAO' },
  { key: 'ofertorio', label: 'OFERTORIO' },
  { key: 'santo', label: 'SANTO' },
  { key: 'cordeiro', label: 'CORDEIRO' },
  { key: 'comunhao', label: 'COMUNHAO' },
  { key: 'final', label: 'FINAL' }
];

export type MassEditorState = {
  nome: string;
  data: string;
  repertorio: Record<string, string>;
};

export const EMPTY_EDITOR: MassEditorState = {
  nome: '',
  data: '',
  repertorio: {}
};

export function normalizeSongRef(value: MissaSongRef | string | null | undefined): string {
  if (!value || typeof value === 'string') {
    return typeof value === 'string' ? value : '';
  }
  return value._id ?? '';
}

export function toEditorState(mass: Missa): MassEditorState {
  return {
    nome: mass.nome,
    data: mass.data ? mass.data.slice(0, 10) : '',
    repertorio: Object.entries(mass.repertorio ?? {}).reduce<Record<string, string>>((acc, [key, song]) => {
      acc[key] = normalizeSongRef(song);
      return acc;
    }, {})
  };
}

export function normalizeSongLabel(value: MissaSongRef | string | null | undefined, songsById: Map<string, Song>): string {
  const songId = normalizeSongRef(value);
  if (!songId) return 'Sem música';

  const song = songsById.get(songId);
  if (song) return `${song.titulo}${song.tom ? ` (${song.tom})` : ''}`;
  if (value && typeof value !== 'string' && value.titulo) {
    return `${value.titulo}${value.tom ? ` (${value.tom})` : ''}`;
  }

  return 'Música não encontrada';
}

export function buildRepertoireSummary(mass: Missa, songsById: Map<string, Song>) {
  return REPERTOIRE_FIELDS
    .map(field => {
      const songLabel = normalizeSongLabel(mass.repertorio?.[field.key], songsById);
      return songLabel === 'Sem música'
        ? null
        : { key: field.key, label: field.label, songLabel };
    })
    .filter((item): item is { key: string; label: string; songLabel: string } => item !== null);
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function useMissaArchiveController() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [missas, setMissas] = useState<Missa[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingMass, setEditingMass] = useState<Missa | null>(null);
  const [massToDelete, setMassToDelete] = useState<Missa | null>(null);
  const [formData, setFormData] = useState<MassEditorState>(EMPTY_EDITOR);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const selectedMassId = editingMass?._id ?? null;
  const songsById = useMemo(() => new Map(songs.map(song => [song._id, song])), [songs]);
  const normalizedSearchTerm = normalizeText(searchTerm.trim());

  const filteredMissas = useMemo(() => {
    if (!normalizedSearchTerm) return missas;

    return missas.filter(mass => {
      const repertoireSummary = buildRepertoireSummary(mass, songsById)
        .map(item => `${item.label} ${item.songLabel}`)
        .join(' ');
      const searchable = [
        mass.nome,
        new Date(mass.data).toLocaleDateString('pt-BR'),
        repertoireSummary
      ].join(' ');

      return normalizeText(searchable).includes(normalizedSearchTerm);
    });
  }, [missas, normalizedSearchTerm, songsById]);

  const totalMassPages = Math.max(1, Math.ceil(filteredMissas.length / MASSES_PER_PAGE));
  const currentMassPage = Math.min(currentPage, totalMassPages);
  const pagedMissas = filteredMissas.slice((currentMassPage - 1) * MASSES_PER_PAGE, currentMassPage * MASSES_PER_PAGE);

  const loadData = async () => {
    try {
      const [songsResponse, missasResponse] = await Promise.all([
        api.get('/songs'),
        api.get('/missas')
      ]);
      setSongs(songsResponse.data);
      setMissas(missasResponse.data);
    } catch (error) {
      console.error('[useMissaArchiveController] load error', error);
      setMessage('Erro ao carregar missas.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await loadData();
  };

  useEffect(() => {
    void loadData();
  }, []);

  const startEdit = (mass: Missa) => {
    setEditingMass(mass);
    setFormData(toEditorState(mass));
    setMessage('');
  };

  const cancelEdit = () => {
    setEditingMass(null);
    setFormData(EMPTY_EDITOR);
  };

  const closeDeleteModal = () => {
    setMassToDelete(null);
  };

  const confirmDelete = async () => {
    if (!massToDelete) return;

    try {
      await api.delete(`/missas/${massToDelete._id}`);
      setLoading(true);
      await loadData();
      if (editingMass?._id === massToDelete._id) {
        cancelEdit();
      }
      setMessage('Missa excluída com sucesso.');
    } catch (error) {
      console.error('[useMissaArchiveController] delete error', error);
      setMessage('Erro ao excluir missa.');
    } finally {
      closeDeleteModal();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const updateRepertoire = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      repertorio: { ...prev.repertorio, [key]: value }
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      nome: formData.nome,
      data: formData.data,
      repertorio: formData.repertorio
    };

    try {
      if (editingMass) {
        await api.put(`/missas/${editingMass._id}`, payload);
        setMessage('Missa atualizada com sucesso.');
      } else {
        await api.post('/missas', payload);
        setMessage('Missa cadastrada com sucesso.');
      }

      cancelEdit();
      setLoading(true);
      await loadData();
    } catch (error) {
      console.error('[useMissaArchiveController] save error', error);
      setMessage('Erro ao salvar missa.');
    }
  };

  const handleDelete = (id: string) => {
    const mass = missas.find(item => item._id === id);
    if (mass) {
      setMassToDelete(mass);
    }
  };

  const handleViewHtml = (massId: string) => {
    const baseURL = api.defaults.baseURL || 'http://localhost:3333';
    window.open(`${baseURL}/missas/${massId}/html`, '_blank');
  };

  const handlePdf = async (massId: string) => {
    const response = await api.get(`/missas/${massId}/pdf`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = downloadUrl;
    anchor.download = `missa-${massId}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  return {
    songs,
    missas,
    filteredMissas,
    pagedMissas,
    songsById,
    loading,
    message,
    editingMass,
    selectedMassId,
    massToDelete,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    currentMassPage,
    totalMassPages,
    refreshData,
    startEdit,
    cancelEdit,
    closeDeleteModal,
    confirmDelete,
    handleSearchChange,
    updateRepertoire,
    handleSubmit,
    handleDelete,
    handleViewHtml,
    handlePdf,
  };
}
