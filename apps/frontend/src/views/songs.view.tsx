import React from 'react';
import { FaMusic, FaSearch, FaEye, FaEyeSlash, FaRedo } from 'react-icons/fa';
import { useSongArchiveController } from '../controllers/use-song-archive.controller';

export const SongsView: React.FC = () => {
  const {
    songs,
    filteredSongs,
    pagedSongs,
    loading,
    message,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    currentSongPage,
    totalSongPages,
    expandedSongId,
    refreshSongs,
    toggleExpandLyrics,
  } = useSongArchiveController();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="page-eyebrow"><FaMusic /> Acervo Público</span>
          <h1 className="page-title">Repertório de Cantos Litúrgicos</h1>
          <p className="page-subtitle">Consulte músicas, filtros por tempo/momento litúrgico e letras completas para os cantores.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => { void refreshSongs(); }}>
          <FaRedo /> Atualizar lista
        </button>
      </div>

      {message && <div className="info-message-alert">{message}</div>}

      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="search"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por título, tom musical ou momento (ex: Entrada, Salmo)..."
            aria-label="Buscar música"
          />
        </div>
      </div>

      <div className="songs-list-container">
        {loading ? (
          <div className="loading-state"><FaRedo className="spin-icon" /> Carregando acervo de músicas...</div>
        ) : songs.length === 0 ? (
          <div className="empty-state">Nenhuma música cadastrada no acervo.</div>
        ) : filteredSongs.length === 0 ? (
          <div className="empty-state">Nenhuma música encontrada para "{searchTerm}".</div>
        ) : (
          pagedSongs.map(song => (
            <article key={song._id} className="song-card">
              <div className="song-card-header">
                <div>
                  <h3 className="song-title">{song.titulo}</h3>
                  <div className="song-meta">
                    {song.tom && <span className="song-tag song-tag--tom">Tom: {song.tom}</span>}
                    <span className="song-tag song-tag--moment">{song.momentoLiturgico}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => toggleExpandLyrics(song._id)}
                >
                  {expandedSongId === song._id ? (
                    <><FaEyeSlash /> Ocultar Letra</>
                  ) : (
                    <><FaEye /> Ver Letra</>
                  )}
                </button>
              </div>

              {expandedSongId === song._id && (
                <div className="song-lyrics-body">
                  {Array.isArray(song.letra) && song.letra.length > 0 ? (
                    song.letra.map((strophe, index) => (
                      <div key={index} className="song-strophe">
                        {Array.isArray(strophe) ? strophe.map((line, lIdx) => (
                          <div key={lIdx} className="song-line">{line}</div>
                        )) : strophe}
                      </div>
                    ))
                  ) : (
                    <p className="no-lyrics">Letra não informada.</p>
                  )}
                </div>
              )}
            </article>
          ))
        )}

        {filteredSongs.length > 0 && (
          <div className="pagination-bar">
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentSongPage === 1}
            >
              Anterior
            </button>
            <span className="pagination-info">
              Página <strong>{currentSongPage}</strong> de {totalSongPages} ({filteredSongs.length} músicas)
            </span>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setCurrentPage(p => Math.min(totalSongPages, p + 1))}
              disabled={currentSongPage === totalSongPages}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
