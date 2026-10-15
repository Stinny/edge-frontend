import { Link } from 'react-router-dom'

const stats = [
  { label: 'Sites Monitored', value: '1,240+' },
  { label: 'Controllers Online', value: '8,900+' },
  { label: 'Uptime', value: '99.9%' },
]

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Site Management',
    description: 'Centralized database of all HVAC control sites. Track equipment, configurations, and status across every location.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    title: 'Controller Records',
    description: 'Full CRUD operations for controller inventory. Store firmware versions, network configs, and maintenance history.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    title: 'Status Reporting',
    description: 'At-a-glance operational status for every site. Filter, sort, and export data to support field teams and management.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
      </svg>
    ),
    title: 'Access Control',
    description: 'Role-based access for technicians, managers, and admins. Keep sensitive site data protected with proper permissions.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-neutral-900 dark:text-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-8 uppercase tracking-widest">
          HVAC Controls Management
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-6">
          One dashboard for<br />
          <span className="text-neutral-500 dark:text-neutral-400">every site you control.</span>
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          EdgeAuto gives your team a single source of truth for all HVAC controller data—
          sites, equipment, configs, and status—always up to date.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors text-sm"
          >
            Sign In
          </Link>
          <a
            href="#features"
            className="px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-white font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-sm"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">{s.value}</div>
              <div className="text-sm text-neutral-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">Everything your team needs</h2>
          <p className="text-neutral-500 text-base max-w-md mx-auto">
            Built around the day-to-day workflows of HVAC controls engineers and project managers.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 mb-4">
                {f.icon}
              </div>
              <h3 className="text-neutral-900 dark:text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Ready to get started?</h2>
          <p className="text-neutral-500 mb-8 max-w-sm mx-auto text-sm">
            Sign in to access the EdgeAuto site management portal.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors text-sm"
          >
            Sign In to Portal
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 dark:text-neutral-600 text-xs">
          <span>© 2026 EdgeAuto. All rights reserved.</span>
          <span>HVAC Controls Management System</span>
        </div>
      </footer>
    </div>
  )
}
