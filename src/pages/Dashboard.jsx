import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = Cookies.get('currentUser')
    ? JSON.parse(Cookies.get('currentUser'))
    : null;

  const handleLogout = () => {
    Cookies.remove('currentUser');
    Cookies.remove('aToken');
    Cookies.remove('rToken');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 bg-black px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 11H5a1 1 0 0 1 0 2H4.07A8 8 0 0 1 11 4.07V5a1 1 0 0 1 2 0v.07A8 8 0 0 1 19.93 13H19a1 1 0 0 1 0-2h.93A8 8 0 0 1 13 16.93z" />
            </svg>
          </div>
          <span className="text-white font-semibold tracking-tight text-lg">EdgeAuto</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 rounded text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-700 text-neutral-400 text-xs font-medium mb-8 uppercase tracking-widest">
          Dashboard
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome{currentUser?.name ? `, ${currentUser.name}` : ''}
        </h1>
        <p className="text-neutral-500 text-base max-w-md mx-auto">
          You're signed in as <span className="text-neutral-300">{currentUser?.email}</span>. Dashboard content coming soon.
        </p>
      </main>
    </div>
  );
}
