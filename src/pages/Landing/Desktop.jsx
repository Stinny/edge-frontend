import { Link } from 'react-router-dom'
import { FileText } from 'react-feather'

const features = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5ZM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
      </svg>
    ),
    title: 'Hosted Site Info',
    description: 'Scan QR codes to access site info — no more printed sheets.',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
      </svg>
    ),
    title: 'Mobile Access',
    description: 'Mobile UI for when you\'re on the go.',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Improved Speeds',
    description: 'Much faster load times when accessing data.',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: 'Auto Backups',
    description: 'Automatic backups of all site data.',
  },
]

export default function Landing() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col overflow-hidden">

      {/* Nav */}
      <header className="shrink-0 flex items-center justify-between px-8 h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
        <div className="flex items-center gap-2.5">
          <FileText size={22} className="text-neutral-900 dark:text-white shrink-0" />
          <div className="flex flex-col">
            <span className="text-neutral-900 dark:text-white font-semibold tracking-tight leading-tight">Edge Automation</span>
            <span className="text-xs text-neutral-400 dark:text-neutral-600 leading-tight">Site Information DB</span>
          </div>
        </div>
        <Link
          to="/login"
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-12">

        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-5 uppercase tracking-widest">
            Site Information Database
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
            One dashboard for<br />
            <span className="text-neutral-400 dark:text-neutral-500">every site we control.</span>
          </h1>
          <p className="text-neutral-500 text-base max-w-md mx-auto mb-6">
            A single source of truth for all our HVAC controller data — sites, equipment, and credentials, always up to date.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors text-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-2.5 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">{f.title}</p>
                <p className="text-xs text-neutral-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-8 h-12 flex items-center justify-between">
        <span className="text-xs text-neutral-400 dark:text-neutral-600">Version 1.0</span>
        <span className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          Online
        </span>
      </footer>

    </div>
  )
}
