import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { Sun, Moon, Terminal } from 'lucide-react';

export default function PublicLayout() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b line">
        <nav className="max-w-[1180px] mx-auto flex items-center justify-between gap-3 py-5 px-6">
          <Link to="/" className="flex items-center gap-3 font-bold no-underline" style={{ color: 'var(--text)' }}>
            <span className="w-8 h-8 rounded-lg grid place-items-center text-white" style={{ background: '#6875e8' }}>
              <Terminal size={16} />
            </span>
            <span>DevForge Academy</span>
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn small" aria-label="Ganti tema">
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {user ? (
              <Link to="/dashboard" className="btn small primary">Buka Dashboard</Link>
            ) : (
              <>
                <Link to="/paths" className="btn small hide-mobile">Jalur Pembelajaran</Link>
                <Link to="/login" className="btn small primary">Buka Demo</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t line">
        <div className="max-w-[1180px] mx-auto flex flex-wrap justify-between gap-4 py-7 px-6 muted text-smx">
          <span>DevForge Academy · Belajar dengan niat.</span>
          <span>Pendidikan pengembang, disusun dengan terstruktur.</span>
        </div>
      </footer>
    </div>
  );
}