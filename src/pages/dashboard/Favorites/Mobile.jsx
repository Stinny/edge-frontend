import { Star } from 'react-feather';

export default function FavoritesMobile() {
  return (
    <main className="p-5">
      <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-0.5">Favorites</h1>
      <p className="text-neutral-500 text-sm mb-6">Your saved sites will appear here.</p>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-20 flex flex-col items-center justify-center gap-2">
        <Star size={16} className="text-neutral-400 dark:text-neutral-600" />
        <p className="text-neutral-400 dark:text-neutral-600 text-sm">Favorite sites coming soon!</p>
      </div>
    </main>
  );
}
