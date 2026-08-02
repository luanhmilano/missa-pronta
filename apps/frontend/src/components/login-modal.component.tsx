import React, { useState } from 'react';
import { FaLock, FaTimes, FaExclamationCircle, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/auth.context';

export const LoginModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form state
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setError(null);
    setSuccessMessage(null);
    closeAuthModal();
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao realizar login. Verifique suas credenciais.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await register(regNome, regEmail, regPassword);
      setSuccessMessage(result.message || 'Solicitação de cadastro enviada com sucesso! Aguarde a aprovação de um administrador.');
      setRegNome('');
      setRegEmail('');
      setRegPassword('');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao solicitar cadastro. Tente novamente.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {mode === 'login' ? <><FaLock /> Accesso Administrativo</> : <><FaUserPlus /> Nova Solicitação de Admin</>}
          </h2>
          <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Fechar">
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => handleSwitchMode('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => handleSwitchMode('register')}
          >
            Solicitar Cadastro
          </button>
        </div>
        
        {error && (
          <div className="modal-error-alert">
            <FaExclamationCircle /> {error}
          </div>
        )}

        {successMessage && (
          <div className="modal-success-alert">
            <FaCheckCircle /> {successMessage}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="modal-form">
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@musicasmissa.com"
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="modal-form">
            <div className="form-group">
              <label>Nome Completo *</label>
              <input
                type="text"
                value={regNome}
                onChange={(e) => setRegNome(e.target.value)}
                required
                placeholder="Ex: João da Silva"
              />
            </div>

            <div className="form-group">
              <label>E-mail *</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                placeholder="joao@musicasmissa.com"
              />
            </div>

            <div className="form-group">
              <label>Senha * (mínimo 6 caracteres)</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Cadastro'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

