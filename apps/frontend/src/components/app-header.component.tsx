import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  FaMusic, 
  FaBookOpen, 
  FaPlus, 
  FaSun, 
  FaMoon, 
  FaLock,
  FaBars, 
  FaTimes,
  FaShieldAlt,
  FaUserShield,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/auth.context';
import { useTheme } from '../context/theme.context';

export const AppHeader: React.FC = () => {
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
          <FaMusic className="brand-icon" />
          <span className="brand-title">MissaPronta</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink 
            to="/musicas" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            <FaMusic className="nav-icon" /> Acervo de Músicas
          </NavLink>

          <NavLink 
            to="/missas" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            <FaBookOpen className="nav-icon" /> Acervo de Missas
          </NavLink>

          {isAdmin && (
            <>
              <span className="nav-divider">|</span>
              <NavLink 
                to="/admin/musicas" 
                className={({ isActive }) => `nav-link nav-link--admin ${isActive ? 'nav-link--active' : ''}`}
              >
                <FaPlus className="nav-icon" /> Cadastrar Música
              </NavLink>

              <NavLink 
                to="/admin/missas" 
                className={({ isActive }) => `nav-link nav-link--admin ${isActive ? 'nav-link--active' : ''}`}
              >
                <FaPlus className="nav-icon" /> Montar Missa
              </NavLink>
            </>
          )}
        </nav>

        {/* Controls: Theme Toggle & Admin Auth */}
        <div className="header-actions">
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Alternar tema claro e escuro"
            title={isDark ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          >
            {isDark ? <FaSun className="theme-icon sun" /> : <FaMoon className="theme-icon moon" />}
          </button>

          {user ? (
            <div className="user-badge-container">
              <Link 
                to="/admin/perfil" 
                className="user-badge-link" 
                title={`Perfil de ${user.nome} - Gerenciar Pendências`}
              >
                <span className="user-badge">
                  <FaShieldAlt className="admin-icon" />
                  <span className="user-name-text">{user.nome}</span>
                </span>
              </Link>
              <button 
                type="button" 
                className="btn-logout" 
                onClick={logout}
                title="Encerrar sessão"
              >
                <FaSignOutAlt /> <span className="logout-text">Sair</span>
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              className="btn-login" 
              onClick={openAuthModal}
            >
              <FaLock className="btn-icon" /> Entrar como Admin
            </button>
          )}

          {/* Hamburger button for Mobile */}
          <button 
            type="button" 
            className="mobile-hamburger-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu de Navegação"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <NavLink 
            to="/musicas" 
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaMusic /> Acervo de Músicas
          </NavLink>

          <NavLink 
            to="/missas" 
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
            onClick={closeMobileMenu}
          >
            <FaBookOpen /> Acervo de Missas
          </NavLink>

          {isAdmin && (
            <>
              <div className="mobile-nav-heading">Administração</div>
              <NavLink 
                to="/admin/musicas" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                <FaPlus /> Cadastrar Música
              </NavLink>

              <NavLink 
                to="/admin/missas" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                <FaPlus /> Montar Missa
              </NavLink>

              <NavLink 
                to="/admin/perfil" 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                <FaUserShield /> Meu Perfil & Aprovações
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

