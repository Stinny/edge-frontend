import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Map, Settings, LogOut, Sun, Moon } from 'react-feather';
import Cookies from 'js-cookie';
import { useTheme } from '../context/ThemeContext';

const topLinks = [
  { to: '/dashboard', label: 'Home', icon: Home, end: true },
  { to: '/dashboard/sites', label: 'Sites', icon: Map },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    Cookies.remove('currentUser');
    Cookies.remove('aToken');
    Cookies.remove('rToken');
    navigate('/login', { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black fixed top-0 left-0 h-screen">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="w-7 h-7 bg-neutral-900 dark:bg-white rounded flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 11H5a1 1 0 0 1 0 2H4.07A8 8 0 0 1 11 4.07V5a1 1 0 0 1 2 0v.07A8 8 0 0 1 19.93 13H19a1 1 0 0 1 0-2h.93A8 8 0 0 1 13 16.93z" />
            </svg>
          </div>
          <span className="text-neutral-900 dark:text-white font-semibold tracking-tight">EdgeAuto</span>
        </div>

        {/* Top nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {topLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
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
              className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 ${
                theme === 'dark' ? 'bg-neutral-500' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 ml-56">
        <Outlet />
      </div>
    </div>
  );
}
