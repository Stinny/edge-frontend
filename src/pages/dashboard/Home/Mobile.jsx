import Cookies from 'js-cookie';
import { Users, MapPin, AlertCircle, Clock, BarChart, UserCheck, Activity } from 'react-feather';

const stats = [
  { label: 'Total Customers', value: 'N/A', icon: Users },
  { label: 'Total Sites',     value: 'N/A', icon: MapPin },
  { label: 'Expired SMAs',    value: 'N/A', icon: AlertCircle, highlight: true },
];

export default function DashboardHomeMobile() {
  const currentUser = Cookies.get('currentUser')
    ? JSON.parse(Cookies.get('currentUser'))
    : null;

  return (
    <main className="p-5">
      <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-0.5">
        Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}
      </h1>
      <p className="text-neutral-500 text-sm mb-6">Here's a quick overview on Edge sites.</p>

      <div className="flex flex-col gap-3">
        {stats.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${highlight ? 'bg-red-50 dark:bg-red-950/60' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                <Icon size={15} className={highlight ? 'text-red-500 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'} />
              </div>
              <span className="text-sm text-neutral-500">{label}</span>
            </div>
            <p className={`text-lg font-bold ${highlight ? 'text-red-500 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Recent Activity</h2>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 flex flex-col items-center justify-center gap-2">
          <Activity size={16} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">Coming soon!</p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Active Users</h2>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 flex flex-col items-center justify-center gap-2">
          <UserCheck size={16} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">Coming soon!</p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Most Viewed</h2>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 flex flex-col items-center justify-center gap-2">
          <BarChart size={16} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">Coming soon!</p>
        </div>
      </div>
    </main>
  );
}
