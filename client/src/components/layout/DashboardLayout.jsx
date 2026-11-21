import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import {
  LayoutDashboard, Route, BookOpen, Braces, Terminal, Sparkles, Blocks,
  ClipboardCheck, TrendingUp, History, Settings, Shield, Menu, X,
  Sun, Moon, LogOut, Bell, Terminal as LogoIcon,
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const mainNav = [
    { to: '/dashboard', label: 'Ikhtisar', icon: LayoutDashboard },
    { to: '/paths', label: 'Jalur Pembelajaran', icon: Route },
    { to: '/courses', label: 'Kursus Saya', icon: BookOpen },
    { to: '/challenges', label: 'Tantangan Coding', icon: Braces },
    { to: '/playground', label: 'Playground Kode', icon: Terminal },
  ];

  const devNav = [
    { to: '/mentor', label: 'Mentor AI', icon: Sparkles },
    { to: '/projects', label: 'Lab Proyek', icon: Blocks },
    { to: '/assessments', label: 'Asesmen', icon: ClipboardCheck },
  ];

  const personalNav = [
    { to: '/progress', label: 'Laporan Progres', icon: TrendingUp },
    { to: '/history', label: 'Riwayat Belajar', icon: History },
    { to: '/settings', label: 'Pengaturan', icon: Settings },
  ];

  const renderNav = (items) =>
    items.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={() => setMobileOpen(false)}
        className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
      >
        <Icon size={17} />
        <span>{label}</span>
      </NavLink>
    ));

  return (
    <div className="flex min-h-screen">
      {/* Backdrop mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`w-[244px] flex-none border-r line flex flex-col fixed lg:sticky top-0 h-screen z-40 transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: 'var(--surface)' }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-6">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-8 h-8 rounded-lg grid place-items-center text-white" style={{ background: '#6875e8' }}>
              <LogoIcon size={16} />
            </span>
            <span className="text-smx">DevForge Academy</span>
          </div>
          <button className="btn small lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
            <X size={14} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          <p className="eyebrow px-2 mb-2">Utama</p>
          {renderNav(mainNav)}

          <p className="eyebrow px-2 mt-6 mb-2">Pengembangan</p>
          {renderNav(devNav)}

          <p className="eyebrow px-2 mt-6 mb-2">Pribadi</p>
          {renderNav(personalNav)}

          {user?.role === 'admin' && (
            <>
              <p className="eyebrow px-2 mt-6 mb-2">Administrasi</p>
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
                <Shield size={17} />
                <span>Admin</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t line p-3">
          <button className="nav-btn" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Konten utama */}
      <div className="flex-1 min-w-0">
        <header
          className="h-16 sticky top-0 z-20 border-b line flex items-center justify-between px-4 lg:px-8 gap-3"
          style={{ background: 'var(--bg)' }}
        >
          <button className="btn small lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
            <Menu size={16} />
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggleTheme} className="btn small" aria-label="Ganti tema">
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <button className="btn small" aria-label="Notifikasi">
              <Bell size={14} />
            </button>

            <div className="flex items-center gap-2 pl-2">
              <span className="w-8 h-8 rounded-full surface2 grid place-items-center accent font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
              <div className="hidden sm:block leading-tight">
                <strong className="block text-smx">{user?.name}</strong>
                <small className="muted">{user?.role === 'admin' ? 'Admin' : 'Siswa'}</small>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1450px] mx-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}