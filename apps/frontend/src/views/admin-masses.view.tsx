import React from 'react';
import { FaBookOpen, FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaShieldAlt, FaCode, FaFilePdf } from 'react-icons/fa';
import { useMissaArchiveController, REPERTOIRE_FIELDS, buildRepertoireSummary } from '../controllers/use-missa-archive.controller';
import { ConfirmationModal } from '../components/confirmation-modal.component';
import { SongSelectCombobox } from '../components/song-select-combobox.component';

export const AdminMassesView: React.FC = () => {
  const {
    songs,
    missas,
    pagedMissas,
    songsById,
    loading,
    message,
    editingMass,
    massToDelete,
    formData,
    setFormData,
    searchTerm,
    handleSearchChange,
    setCurrentPage,
    currentMassPage,
    totalMassPages,
    startEdit,
    cancelEdit,
    closeDeleteModal,
    confirmDelete,
    updateRepertoire,
    handleSubmit,
    handleDelete,
    handleViewHtml,
    handlePdf,
  } = useMissaArchiveController();

  return (
    <div className="page-container">
      <div className="admin-banner">
        <FaShieldAlt className="admin-badge-icon" />
        <div>
          <h3>Painel Administrativo de Missas</h3>
          <p>Monte o repertório das missas associando músicas a cada momento litúrgico.</p>
        </div>
      </div>

      {message && <div className="info-message-alert">{message}</div>}

      <div className="admin-grid-layout">
        {/* Form Column */}
        <div className="admin-card">
          <h2 className="admin-card-title">
            {editingMass ? <><FaEdit /> Editar Missa</> : <><FaPlus /> Montar Nova Missa</>}
          </h2>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Nome da Missa *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                required
                placeholder="Ex: Missa do 1º Domingo do Advento"
              />
            </div>

            <div className="form-group">
              <label>Data da Celebração *</label>
              <input
                type="date"
                value={formData.data}
                onChange={e => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

            <div className="repertoire-selection-grid">
              <h4>Repertório por Momento Litúrgico</h4>
              {REPERTOIRE_FIELDS.map(item => (
                <SongSelectCombobox
                  key={item.key}
                  label={item.label}
                  momentLabel={item.label}
                  value={formData.repertorio[item.key] || ''}
                  songs={songs}
                  onChange={songId => updateRepertoire(item.key, songId)}
                />
              ))}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <FaSave /> {editingMass ? 'Atualizar Missa' : 'Salvar Missa'}
              </button>
              {editingMass && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  <FaTimes /> Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2><FaBookOpen /> Missas Cadastradas ({missas.length})</h2>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Filtrar missas..."
              className="admin-search-input"
            />
          </div>

          {loading ? (
            <p>Carregando missas...</p>
          ) : pagedMissas.length === 0 ? (
            <p className="empty-state">Nenhuma missa encontrada.</p>
          ) : (
            <div className="admin-list">
              {pagedMissas.map(mass => {
                const summary = buildRepertoireSummary(mass, songsById);

                return (
                  <div key={mass._id} className="admin-item">
                    <div className="admin-item-info">
                      <strong>{mass.nome}</strong>
                      <p className="mass-date">{new Date(mass.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                      <div className="repertoire-mini-summary">
                        {summary.slice(0, 3).map(s => (
                          <span key={s.key} className="mini-tag">{s.label}: {s.songLabel}</span>
                        ))}
                        {summary.length > 3 && <span className="mini-tag">+{summary.length - 3} músicas</span>}
                      </div>
                    </div>

                    <div className="admin-item-actions">
                      <button
                        type="button"
                        className="btn-icon-btn btn-secondary"
                        onClick={() => handleViewHtml(mass._id)}
                        title="Ver HTML"
                      >
                        <FaCode />
                      </button>

                      <button
                        type="button"
                        className="btn-icon-btn btn-secondary"
                        onClick={() => { void handlePdf(mass._id); }}
                        title="Baixar PDF"
                      >
                        <FaFilePdf />
                      </button>

                      <button
                        type="button"
                        className="btn-icon-btn btn-secondary"
                        onClick={() => startEdit(mass)}
                        title="Editar Missa"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        className="btn-icon-btn btn-danger"
                        onClick={() => handleDelete(mass._id)}
                        title="Excluir Missa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalMassPages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentMassPage === 1}
              >
                Anterior
              </button>
              <span>{currentMassPage} / {totalMassPages}</span>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setCurrentPage(p => Math.min(totalMassPages, p + 1))}
                disabled={currentMassPage === totalMassPages}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>

      {massToDelete && (
        <ConfirmationModal
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir a missa "${massToDelete.nome}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onConfirm={() => { void confirmDelete(); }}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
};
