import Cookies from 'js-cookie';
import { Users, MapPin, AlertCircle, Clock, BarChart } from 'react-feather';

const stats = [
  {
    label: 'Total Customers',
    value: 'N/A',
    icon: Users,
  },
  {
    label: 'Total Sites',
    value: 'N/A',
    icon: MapPin,
  },
  {
    label: 'Expired SMAs',
    value: 'N/A',
    icon: AlertCircle,
    highlight: true,
  },
];

export default function DashboardHome() {
  const currentUser = Cookies.get('currentUser')
    ? JSON.parse(Cookies.get('currentUser'))
    : null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
        Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}
      </h1>
      <p className="text-neutral-500 text-sm mb-8">
        Here's a quick overview on Edge sites.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                {label}
              </span>
              <div className={`p-1.5 rounded-lg ${highlight ? 'bg-red-50 dark:bg-red-950/60' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                <Icon
                  size={14}
                  className={highlight ? 'text-red-500 dark:text-red-400' : 'text-neutral-500 dark:text-neutral-400'}
                />
              </div>
            </div>
            <p className={`text-xl font-bold ${highlight ? 'text-red-500 dark:text-red-400' : 'text-neutral-900 dark:text-white'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Most Viewed
        </h2>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-28 flex flex-col items-center justify-center gap-2">
          <BarChart size={18} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">Coming soon!</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Recently Viewed
        </h2>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-28 flex flex-col items-center justify-center gap-2">
          <Clock size={18} className="text-neutral-400 dark:text-neutral-600" />
          <p className="text-neutral-400 dark:text-neutral-600 text-sm">Coming soon!</p>
        </div>
      </div>
    </main>
  );
}
