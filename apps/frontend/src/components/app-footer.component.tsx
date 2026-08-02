import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaBookOpen, FaHeart, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/auth.context';

export const AppFooter: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <FaMusic className="footer-icon" />
            <span>MissaPronta</span>
          </div>
          <p className="footer-tagline">
            Monte o repertório e gere o PDF da missa em segundos.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navegação</h4>
          <ul>
            <li>
              <Link to="/musicas"><FaMusic /> Acervo de Músicas</Link>
            </li>
            <li>
              <Link to="/missas"><FaBookOpen /> Acervo de Missas</Link>
            </li>
          </ul>
        </div>

        <div className="footer-auth">
          <h4>Acesso Restrito</h4>
          {user ? (
            <p className="footer-status">
              Sessão ativa como <strong>{user.nome}</strong> ({user.role})
            </p>
          ) : (
            <button type="button" className="footer-login-btn" onClick={openAuthModal}>
              <FaLock /> Entrar como Admin
            </button>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} MissaPronta · Feito com <FaHeart style={{ color: '#e53935', margin: '0 2px' }} /> para o serviço da Igreja.
        </p>
        <p>
          Desenvolvido por <a target='_blank' rel='noopener noreferrer' href="https://github.com/luanhmilano">@luanducode</a>
        </p>
      </div>
    </footer>
  );
};
