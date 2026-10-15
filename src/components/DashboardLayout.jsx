import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Map, Settings, LogOut, Sun, Moon, Thermometer, Star } from 'react-feather';
import { isMobile } from 'react-device-detect';
import Cookies from 'js-cookie';
import { useTheme } from '../context/ThemeContext';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const topLinks = [
  { to: '/dashboard', label: 'Home', icon: Home, end: true },
  { to: '/dashboard/sites', label: 'Sites', icon: Map },
  { to: '/dashboard/favorites', label: 'Favorites', icon: Star },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const currentUser = Cookies.get('currentUser')
    ? JSON.parse(Cookies.get('currentUser'))
    : null;

  const initials = getInitials(currentUser?.name);

  const handleLogout = () => {
    Cookies.remove('currentUser');
    Cookies.remove('aToken');
    Cookies.remove('rToken');
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
    }`;

  const bottomNavLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive
        ? 'text-neutral-900 dark:text-white'
        : 'text-neutral-400 dark:text-neutral-600'
    }`;

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-950">
        {/* Top bar */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-black border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-neutral-900 dark:bg-white rounded flex items-center justify-center shrink-0">
              <Thermometer size={14} className="text-white dark:text-black" />
            </div>
            <span className="text-neutral-900 dark:text-white font-semibold tracking-tight text-sm">Edge Automation</span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center"
            >
              <span className="text-xs font-semibold text-white dark:text-black">{initials}</span>
            </button>

            {menuOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 p-1">
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                  <p className="text-xs text-neutral-500 truncate">{currentUser?.email}</p>
                  <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">{currentUser?.name}</p>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-neutral-500">
                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  </span>
                  <button
                    onClick={toggleTheme}
                    role="switch"
                    aria-checked={theme === 'dark'}
                    className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-neutral-500' : 'bg-neutral-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 pt-14 pb-20">
          <Outlet />
        </div>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around px-2 z-50">
          <NavLink to="/dashboard" end className={bottomNavLinkClass}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/dashboard/sites" className={bottomNavLinkClass}>
            <Map size={20} />
            <span>Sites</span>
          </NavLink>
          <NavLink to="/dashboard/favorites" className={bottomNavLinkClass}>
            <Star size={20} />
            <span>Favorites</span>
          </NavLink>
          <NavLink to="/dashboard/settings" className={bottomNavLinkClass}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-950">
      <aside className="w-56 shrink-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black fixed top-0 left-0 h-screen">
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="w-7 h-7 bg-neutral-900 dark:bg-white rounded flex items-center justify-center shrink-0">
            <Thermometer size={14} className="text-white dark:text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-900 dark:text-white font-semibold tracking-tight leading-tight">Edge Automation</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-600 leading-tight">Site Information DB</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {topLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="text-neutral-500">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </span>
            <button
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle dark mode"
              className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${theme === 'dark' ? 'bg-neutral-500' : 'bg-neutral-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
          <NavLink to="/dashboard/settings" className={linkClass}>
            <Settings size={16} />
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 ml-56 p-8 pl-14 pr-14">
        <Outlet />
      </div>
    </div>
  );
}
