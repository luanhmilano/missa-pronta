import React from 'react';
import { FaMusic, FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSongArchiveController, MOMENTS } from '../controllers/use-song-archive.controller';
import { ConfirmationModal } from '../components/confirmation-modal.component';

export const AdminSongsView: React.FC = () => {
  const {
    songs,
    pagedSongs,
    loading,
    message,
    editingSong,
    songToDelete,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    currentSongPage,
    totalSongPages,
    expandedSongId,
    startEdit,
    cancelEdit,
    closeDeleteModal,
    confirmDelete,
    handleSubmit,
    handleDelete,
    toggleExpandLyrics,
  } = useSongArchiveController();

  return (
    <div className="page-container">
      <div className="admin-banner">
        <FaShieldAlt className="admin-badge-icon" />
        <div>
          <h3>Painel Administrativo de Músicas</h3>
          <p>Cadastre novas músicas ou atualize dados do acervo musical.</p>
        </div>
      </div>

      {message && <div className="info-message-alert">{message}</div>}

      <div className="admin-grid-layout">
        {/* Form Column */}
        <div className="admin-card">
          <h2 className="admin-card-title">
            {editingSong ? <><FaEdit /> Editar Música</> : <><FaPlus /> Cadastrar Nova Música</>}
          </h2>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Título da Música *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                required
                placeholder="Ex: Noite Feliz"
              />
            </div>

            <div className="form-group">
              <label>Tom Musical</label>
              <input
                type="text"
                value={formData.tom}
                onChange={e => setFormData({ ...formData, tom: e.target.value })}
                placeholder="Ex: C, G, Am"
              />
            </div>

            <div className="form-group">
              <label>Momento Litúrgico *</label>
              <select
                value={formData.momentoLiturgico}
                onChange={e => setFormData({ ...formData, momentoLiturgico: e.target.value as any })}
              >
                {MOMENTS.map(moment => (
                  <option key={moment} value={moment}>{moment}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Letra (Estrofes separadas por linha dupla) *</label>
              <textarea
                value={formData.letra}
                onChange={e => setFormData({ ...formData, letra: e.target.value })}
                rows={10}
                required
                placeholder={'Noite feliz, noite feliz!\nO Senhor, Deus de amor\n\nPobrezinho nasceu em Belém\nEis na lapa Jesus, nosso bem'}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <FaSave /> {editingSong ? 'Atualizar Música' : 'Salvar Música'}
              </button>
              {editingSong && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  <FaTimes /> Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List & Edit Column */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2><FaMusic /> Músicas do Acervo ({songs.length})</h2>
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filtrar músicas..."
              className="admin-search-input"
            />
          </div>

          {loading ? (
            <p>Carregando músicas...</p>
          ) : pagedSongs.length === 0 ? (
            <p className="empty-state">Nenhuma música encontrada.</p>
          ) : (
            <div className="admin-list">
              {pagedSongs.map(song => (
                <div key={song._id} className="admin-item">
                  <div className="admin-item-info">
                    <strong>{song.titulo}</strong>
                    <div className="song-meta">
                      {song.tom && <span className="song-tag song-tag--tom">Tom: {song.tom}</span>}
                      <span className="song-tag song-tag--moment">{song.momentoLiturgico}</span>
                    </div>
                  </div>

                  <div className="admin-item-actions">
                    <button
                      type="button"
                      className="btn-icon-btn btn-secondary"
                      onClick={() => toggleExpandLyrics(song._id)}
                      title="Ver Letra"
                    >
                      {expandedSongId === song._id ? <FaEyeSlash /> : <FaEye />}
                    </button>

                    <button
                      type="button"
                      className="btn-icon-btn btn-secondary"
                      onClick={() => startEdit(song)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>

                    <button
                      type="button"
                      className="btn-icon-btn btn-danger"
                      onClick={() => handleDelete(song._id)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {expandedSongId === song._id && (
                    <div className="song-lyrics-preview">
                      {Array.isArray(song.letra) && song.letra.map((strophe, sIdx) => (
                        <p key={sIdx}>
                          {Array.isArray(strophe) ? strophe.join('\n') : strophe}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {totalSongPages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentSongPage === 1}
              >
                Anterior
              </button>
              <span>{currentSongPage} / {totalSongPages}</span>
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

      {songToDelete && (
        <ConfirmationModal
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir a música "${songToDelete.titulo}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onConfirm={() => { void confirmDelete(); }}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
};
