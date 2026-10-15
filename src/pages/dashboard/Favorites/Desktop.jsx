import { Star } from 'react-feather';

export default function FavoritesDesktop() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">Favorites</h1>
      <p className="text-neutral-500 text-sm mb-8">Your saved sites will appear here.</p>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-28 flex flex-col items-center justify-center gap-2">
        <Star size={18} className="text-neutral-400 dark:text-neutral-600" />
        <p className="text-neutral-400 dark:text-neutral-600 text-sm">Favorite sites coming soon!</p>
      </div>
    </main>
  );
}
