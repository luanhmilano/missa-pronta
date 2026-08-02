import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { LiturgicalMoment, Song } from '../types';

export const SONGS_PER_PAGE = 10;

export const MOMENTS: LiturgicalMoment[] = [
  'ENTRADA',
  'ATO_PENITENCIAL',
  'SALMO',
  'ACLAMACAO',
  'OFERTORIO',
  'SANTO',
  'CORDEIRO',
  'COMUNHAO',
  'FINAL'
];

export type SongEditorState = {
  titulo: string;
  tom: string;
  momentoLiturgico: LiturgicalMoment;
  letra: string;
};

export const EMPTY_EDITOR: SongEditorState = {
  titulo: '',
  tom: '',
  momentoLiturgico: 'ENTRADA',
  letra: ''
};

export function toEditorState(song: Song): SongEditorState {
  return {
    titulo: song.titulo,
    tom: song.tom ?? '',
    momentoLiturgico: song.momentoLiturgico,
    letra: Array.isArray(song.letra)
      ? song.letra.map(strophe => (Array.isArray(strophe) ? strophe.join('\n') : strophe)).join('\n\n')
      : ''
  };
}

export function parseLyrics(text: string): string[][] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map(strophe => strophe.split(/\r?\n/).map(line => line.trim()).filter(Boolean))
    .filter(strophe => strophe.length > 0);
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function useSongArchiveController() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [formData, setFormData] = useState<SongEditorState>(EMPTY_EDITOR);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSongId, setExpandedSongId] = useState<string | null>(null);

  const selectedSongId = editingSong?._id ?? null;
  const normalizedSearchTerm = normalizeText(searchTerm.trim());

  const filteredSongs = useMemo(() => {
    if (!normalizedSearchTerm) {
      return songs;
    }

    return songs.filter(song => {
      const searchable = [song.titulo, song.tom, song.momentoLiturgico].filter(Boolean).join(' ');
      return normalizeText(searchable).includes(normalizedSearchTerm);
    });
  }, [normalizedSearchTerm, songs]);

  const totalSongPages = Math.max(1, Math.ceil(filteredSongs.length / SONGS_PER_PAGE));
  const currentSongPage = Math.min(currentPage, totalSongPages);
  const pagedSongs = filteredSongs.slice((currentSongPage - 1) * SONGS_PER_PAGE, currentSongPage * SONGS_PER_PAGE);

  const loadSongs = async () => {
    try {
      const response = await api.get('/songs');
      setSongs(response.data);
    } catch (error) {
      console.error('[useSongArchiveController] load error', error);
      setMessage('Erro ao carregar músicas.');
    } finally {
      setLoading(false);
    }
  };

  const refreshSongs = async () => {
    setLoading(true);
    await loadSongs();
  };

  useEffect(() => {
    void loadSongs();
  }, []);

  const startEdit = (song: Song) => {
    setEditingSong(song);
    setFormData(toEditorState(song));
    setMessage('');
  };

  const cancelEdit = () => {
    setEditingSong(null);
    setFormData(EMPTY_EDITOR);
  };

  const closeDeleteModal = () => {
    setSongToDelete(null);
  };

  const confirmDelete = async () => {
    if (!songToDelete) return;

    try {
      await api.delete(`/songs/${songToDelete._id}`);
      setLoading(true);
      await loadSongs();
      if (editingSong?._id === songToDelete._id) {
        cancelEdit();
      }
      setMessage('Música excluída com sucesso.');
    } catch (error) {
      console.error('[useSongArchiveController] delete error', error);
      setMessage('Erro ao excluir música.');
    } finally {
      closeDeleteModal();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      titulo: formData.titulo,
      tom: formData.tom,
      momentoLiturgico: formData.momentoLiturgico,
      letra: parseLyrics(formData.letra)
    };

    try {
      if (editingSong) {
        await api.put(`/songs/${editingSong._id}`, payload);
        setMessage('Música atualizada com sucesso.');
      } else {
        await api.post('/songs', payload);
        setMessage('Música cadastrada com sucesso.');
      }

      cancelEdit();
      setLoading(true);
      await loadSongs();
    } catch (error) {
      console.error('[useSongArchiveController] save error', error);
      setMessage('Erro ao salvar música.');
    }
  };

  const handleDelete = (id: string) => {
    const song = songs.find(item => item._id === id);
    if (song) {
      setSongToDelete(song);
    }
  };

  const toggleExpandLyrics = (id: string) => {
    setExpandedSongId(current => (current === id ? null : id));
  };

  return {
    songs,
    filteredSongs,
    pagedSongs,
    loading,
    message,
    editingSong,
    selectedSongId,
    songToDelete,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    currentSongPage,
    totalSongPages,
    expandedSongId,
    refreshSongs,
    startEdit,
    cancelEdit,
    closeDeleteModal,
    confirmDelete,
    handleSubmit,
    handleDelete,
    toggleExpandLyrics,
  };
}
