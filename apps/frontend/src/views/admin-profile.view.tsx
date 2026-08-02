import React, { useEffect, useState } from 'react';
import { FaUserShield, FaCheck, FaTimes, FaUserClock, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../context/auth.context';
import { api } from '../services/api';

interface PendingUser {
  _id: string;
  nome: string;
  email: string;
  createdAt: string;
}

export const AdminProfileView: React.FC = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/pending-users');
      setPendingUsers(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar solicitações pendentes:', err);
      setMessage({ type: 'error', text: 'Erro ao carregar solicitações de novos administradores.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id: string, name: string) => {
    try {
      setActionLoading(id);
      setMessage(null);
      await api.patch(`/auth/users/${id}/approve`);
      setMessage({ type: 'success', text: `Cadastro de "${name}" aprovado com sucesso!` });
      setPendingUsers(prev => prev.filter(u => u._id !== id));
    } catch (err: any) {
      const errorText = err.response?.data?.error || 'Erro ao aprovar o usuário.';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      setActionLoading(id);
      setMessage(null);
      await api.patch(`/auth/users/${id}/reject`);
      setMessage({ type: 'success', text: `Solicitação de "${name}" recusada.` });
      setPendingUsers(prev => prev.filter(u => u._id !== id));
    } catch (err: any) {
      const errorText = err.response?.data?.error || 'Erro ao recusar o usuário.';
      setMessage({ type: 'error', text: errorText });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="page-container">
      {/* Banner */}
      <div className="admin-banner">
        <FaUserShield className="admin-badge-icon" />
        <div>
          <h3>Perfil Administrativo & Aprovações</h3>
          <p>Gerencie seus dados e revise as solicitações de acesso de novos administradores.</p>
        </div>
      </div>

      {message && (
        <div className={message.type === 'success' ? 'info-message-alert' : 'modal-error-alert'}>
          {message.text}
        </div>
      )}

      <div className="profile-grid">
        {/* User Card */}
        <div className="admin-card user-profile-card">
          <h2 className="admin-card-title">
            <FaUserShield /> Meu Perfil
          </h2>
          <div className="profile-detail-item">
            <span className="profile-label">Nome:</span>
            <strong className="profile-value">{user?.nome}</strong>
          </div>
          <div className="profile-detail-item">
            <span className="profile-label">E-mail:</span>
            <span className="profile-value">{user?.email}</span>
          </div>
          <div className="profile-detail-item">
            <span className="profile-label">Função:</span>
            <span className="user-role-badge">Administrador</span>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="admin-card pending-approvals-card">
          <div className="admin-card-header">
            <h2>
              <FaUserClock /> Pendências de Aprovação ({pendingUsers.length})
            </h2>
          </div>

          {loading ? (
            <p className="loading-state">Carregando solicitações pendentes...</p>
          ) : pendingUsers.length === 0 ? (
            <div className="empty-state">
              <FaCheck className="empty-state-icon" />
              <p>Nenhuma solicitação pendente no momento.</p>
            </div>
          ) : (
            <div className="pending-users-list">
              {pendingUsers.map(pending => (
                <div key={pending._id} className="pending-user-item">
                  <div className="pending-user-info">
                    <h4>{pending.nome}</h4>
                    <p className="pending-user-email">
                      <FaEnvelope /> {pending.email}
                    </p>
                    <p className="pending-user-date">
                      <FaCalendarAlt /> Solicitado em: {new Date(pending.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="pending-user-actions">
                    <button
                      type="button"
                      className="btn-approve"
                      onClick={() => handleApprove(pending._id, pending.nome)}
                      disabled={actionLoading === pending._id}
                      title="Aprovar Usuário"
                    >
                      <FaCheck /> Aprovar
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleReject(pending._id, pending.nome)}
                      disabled={actionLoading === pending._id}
                      title="Recusar Usuário"
                    >
                      <FaTimes /> Recusar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
