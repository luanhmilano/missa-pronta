import React from 'react';
import { FaBookOpen, FaSearch, FaCode, FaFilePdf, FaRedo, FaCalendarAlt } from 'react-icons/fa';
import { useMissaArchiveController, buildRepertoireSummary } from '../controllers/use-missa-archive.controller';

export const MassesView: React.FC = () => {
  const {
    missas,
    filteredMissas,
    pagedMissas,
    songsById,
    loading,
    message,
    searchTerm,
    handleSearchChange,
    setCurrentPage,
    currentMassPage,
    totalMassPages,
    refreshData,
    handleViewHtml,
    handlePdf,
  } = useMissaArchiveController();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="page-eyebrow"><FaBookOpen /> Celebrações</span>
          <h1 className="page-title">Acervo de Missas e Repertórios</h1>
          <p className="page-subtitle">Visualize a ordem das missas cadastradas, consulte o formato HTML ou baixe o PDF formatado.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => { void refreshData(); }}>
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
            onChange={handleSearchChange}
            placeholder="Buscar por nome da missa, data ou título da música..."
            aria-label="Buscar missa"
          />
        </div>
      </div>

      <div className="masses-list-container">
        {loading ? (
          <div className="loading-state"><FaRedo className="spin-icon" /> Carregando acervo de missas...</div>
        ) : missas.length === 0 ? (
          <div className="empty-state">Nenhuma missa cadastrada no acervo.</div>
        ) : filteredMissas.length === 0 ? (
          <div className="empty-state">Nenhuma missa encontrada para "{searchTerm}".</div>
        ) : (
          pagedMissas.map(mass => {
            const summary = buildRepertoireSummary(mass, songsById);

            return (
              <article key={mass._id} className="mass-card">
                <div className="mass-card-header">
                  <div>
                    <h3 className="mass-title">{mass.nome}</h3>
                    <p className="mass-date">
                      <FaCalendarAlt /> {new Date(mass.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>
                  <div className="mass-actions">
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => handleViewHtml(mass._id)}
                    >
                      <FaCode /> Visualizar
                    </button>
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={() => { void handlePdf(mass._id); }}
                    >
                      <FaFilePdf /> Baixar PDF
                    </button>
                  </div>
                </div>

                <div className="mass-repertoire-grid">
                  {summary.length > 0 ? (
                    summary.map(item => (
                      <div key={item.key} className="repertoire-item">
                        <span className="repertoire-moment">{item.label}</span>
                        <span className="repertoire-song-name">{item.songLabel}</span>
                      </div>
                    ))
                  ) : (
                    <p className="empty-repertoire">Nenhum canto associado a esta missa ainda.</p>
                  )}
                </div>
              </article>
            );
          })
        )}

        {filteredMissas.length > 0 && (
          <div className="pagination-bar">
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentMassPage === 1}
            >
              Anterior
            </button>
            <span className="pagination-info">
              Página <strong>{currentMassPage}</strong> de {totalMassPages} ({filteredMissas.length} missas)
            </span>
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
  );
};
