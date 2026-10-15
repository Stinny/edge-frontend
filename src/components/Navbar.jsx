import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 11H5a1 1 0 0 1 0 2H4.07A8 8 0 0 1 11 4.07V5a1 1 0 0 1 2 0v.07A8 8 0 0 1 19.93 13H19a1 1 0 0 1 0-2h.93A8 8 0 0 1 13 16.93z"/>
            </svg>
          </div>
          <span className="text-neutral-900 dark:text-white font-semibold tracking-tight text-lg">EdgeAuto</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/login"
            className="ml-2 px-4 py-1.5 rounded text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  )
}
