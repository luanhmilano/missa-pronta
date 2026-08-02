import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaSearch, FaTimes, FaChevronDown, FaStar, FaMusic } from 'react-icons/fa';
import type { Song } from '../types';

export interface SongSelectComboboxProps {
  label: string;
  momentLabel: string;
  value: string;
  songs: Song[];
  onChange: (songId: string) => void;
  placeholder?: string;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const SongSelectCombobox: React.FC<SongSelectComboboxProps> = ({
  label,
  momentLabel,
  value,
  songs,
  onChange,
  placeholder = 'Selecione ou pesquise...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedSong = useMemo(
    () => songs.find(s => s._id === value),
    [songs, value]
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    setSearchTerm('');
  };

  const handleSelect = (songId: string) => {
    onChange(songId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  const normalizedSearch = useMemo(() => normalizeText(searchTerm.trim()), [searchTerm]);

  const filteredSongs = useMemo(() => {
    if (!normalizedSearch) return songs;
    return songs.filter(song => {
      const searchTarget = `${song.titulo} ${song.tom ?? ''} ${song.momentoLiturgico ?? ''}`;
      return normalizeText(searchTarget).includes(normalizedSearch);
    });
  }, [songs, normalizedSearch]);

  const recommendedSongs = useMemo(() => {
    return filteredSongs.filter(
      song => normalizeText(song.momentoLiturgico ?? '') === normalizeText(momentLabel)
    );
  }, [filteredSongs, momentLabel]);

  const otherSongs = useMemo(() => {
    return filteredSongs.filter(
      song => normalizeText(song.momentoLiturgico ?? '') !== normalizeText(momentLabel)
    );
  }, [filteredSongs, momentLabel]);

  return (
    <div className="combobox-field-container" ref={containerRef}>
      <label className="combobox-label">{label}</label>

      <div
        className={`combobox-trigger ${isOpen ? 'combobox-trigger--active' : ''} ${
          selectedSong ? 'combobox-trigger--selected' : ''
        }`}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      >
        <span className="combobox-trigger-text">
          {selectedSong ? (
            <>
              <FaMusic className="combobox-icon-music" />
              <span className="combobox-song-title">{selectedSong.titulo}</span>
              {selectedSong.tom && (
                <span className="combobox-song-tom">({selectedSong.tom})</span>
              )}
            </>
          ) : (
            <span className="combobox-placeholder">{placeholder}</span>
          )}
        </span>

        <div className="combobox-trigger-actions">
          {selectedSong && (
            <button
              type="button"
              className="combobox-clear-btn"
              onClick={handleClear}
              title="Limpar seleção"
            >
              <FaTimes />
            </button>
          )}
          <FaChevronDown className={`combobox-chevron ${isOpen ? 'combobox-chevron--open' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="combobox-dropdown" role="listbox">
          <div className="combobox-search-box">
            <FaSearch className="combobox-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="combobox-search-input"
              placeholder="Buscar música por título, tom..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  setIsOpen(false);
                }
              }}
            />
            {searchTerm && (
              <button
                type="button"
                className="combobox-search-clear"
                onClick={() => setSearchTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="combobox-options-list">
            <button
              type="button"
              className={`combobox-option ${value === '' ? 'combobox-option--selected' : ''}`}
              onClick={() => handleSelect('')}
            >
              <em>-- Nenhuma música --</em>
            </button>

            {recommendedSongs.length > 0 && (
              <div className="combobox-group">
                <div className="combobox-group-header">
                  <FaStar className="combobox-star-icon" /> Recomendadas para {momentLabel} ({recommendedSongs.length})
                </div>
                {recommendedSongs.map(song => (
                  <button
                    key={song._id}
                    type="button"
                    className={`combobox-option ${
                      song._id === value ? 'combobox-option--selected' : ''
                    }`}
                    onClick={() => handleSelect(song._id)}
                  >
                    <span className="combobox-option-title">{song.titulo}</span>
                    {song.tom && <span className="combobox-option-tom">{song.tom}</span>}
                  </button>
                ))}
              </div>
            )}

            {otherSongs.length > 0 && (
              <div className="combobox-group">
                {recommendedSongs.length > 0 && (
                  <div className="combobox-group-header">Outras Músicas ({otherSongs.length})</div>
                )}
                {otherSongs.map(song => (
                  <button
                    key={song._id}
                    type="button"
                    className={`combobox-option ${
                      song._id === value ? 'combobox-option--selected' : ''
                    }`}
                    onClick={() => handleSelect(song._id)}
                  >
                    <span className="combobox-option-title">{song.titulo}</span>
                    {song.tom && <span className="combobox-option-tom">{song.tom}</span>}
                    {song.momentoLiturgico && (
                      <span className="combobox-option-tag">{song.momentoLiturgico}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {filteredSongs.length === 0 && (
              <div className="combobox-empty-state">Nenhuma música encontrada para "{searchTerm}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
