import { useEffect, useState } from 'react';
import { favorites } from '../lib/favorites';
import PodcastCard from '../components/PodcastCard';

export default function Favorites() {
  const [items, setItems] = useState(favorites.list());

  useEffect(() => {
    const unsub = favorites.subscribe(() => setItems(favorites.list()));
    return unsub;
  }, []);

  return (
    <main className='mx-auto max-w-6xl'>
      <div className='mb-4'>
        <h1 className='text-2xl font-semibold'>
          Favorites{' '}
          <span className='text-gray-400 text-base'>({items.length})</span>
        </h1>
      </div>

      {items.length === 0 ? (
        <p className='text-gray-400'>No favorites yet.</p>
      ) : (
        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((v) => (
            <PodcastCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </main>
  );
}