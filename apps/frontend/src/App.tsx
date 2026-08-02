import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/auth.context';
import { ThemeProvider } from './context/theme.context';
import { AppHeader } from './components/app-header.component';
import { AppFooter } from './components/app-footer.component';
import { AppRouter } from './router/app-router';
import { LoginModal } from './components/login-modal.component';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="app-shell">
            <AppHeader />
            <main className="main-content">
              <AppRouter />
            </main>
            <AppFooter />
            <LoginModal />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;