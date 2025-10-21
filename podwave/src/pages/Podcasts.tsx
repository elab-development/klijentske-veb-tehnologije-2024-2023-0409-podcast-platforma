import { useEffect, useMemo, useState } from 'react';
import { YouTubeAPI } from '../lib/youtube';
import type { PodcastVideo } from '../types/youtube';
import PodcastCard from '../components/PodcastCard';
import { FaSearch } from 'react-icons/fa';

export default function Podcasts() {
  const api = useMemo(() => new YouTubeAPI(), []);
  const [query, setQuery] = useState('podcast');
  const [channel, setChannel] = useState('');
  const [quality, setQuality] = useState<'any' | 'high' | 'standard'>('any');

  const [items, setItems] = useState<PodcastVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [prevToken, setPrevToken] = useState<string | undefined>();
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.searchPodcastVideosNormalized({
        q: query.trim() || 'podcast',
        pageToken,
        maxResults: 24,
        order: 'relevance',
        channelId: channel || undefined,
        videoDefinition: quality,
      });
      setItems(data.items);
      setNextToken(data.nextPageToken);
      setPrevToken(data.prevPageToken);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch podcasts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageToken]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageToken(undefined);
    fetchData();
  };

  return (
    <main className='mx-auto max-w-6xl'>
      <h1 className='text-2xl font-semibold mb-4'>Podcasts</h1>

      <form
        onSubmit={onSubmit}
        className='mb-4 flex flex-col sm:flex-row gap-3'
      >
        <input
          className='flex-1 rounded-md bg-neutral-800 text-white px-3 py-2 placeholder-gray-400 outline-none border border-neutral-700 focus:border-red-600'
          placeholder='Search podcasts...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={quality}
          onChange={(e) =>
            setQuality(e.target.value as 'any' | 'high' | 'standard')
          }
          className='rounded-md bg-neutral-800 text-white px-3 py-2 border border-neutral-700 focus:border-red-600'
        >
          <option value='any'>Any quality</option>
          <option value='high'>HD only</option>
          <option value='standard'>Standard only</option>
        </select>

        <input
          className='rounded-md bg-neutral-800 text-white px-3 py-2 placeholder-gray-400 outline-none border border-neutral-700 focus:border-red-600'
          placeholder='Channel ID (optional)'
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        />

        <button
          type='submit'
          className='px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition inline-flex items-center gap-2'
        >
          <FaSearch /> Search
        </button>
      </form>

      {loading && <p className='text-gray-400 mb-4'>Loading…</p>}
      {error && <p className='text-red-400 mb-4'>{error}</p>}

      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map((v) => (
          <PodcastCard key={v.id} video={v} />
        ))}
      </div>

      <div className='flex justify-center gap-3 mt-6'>
        <button
          disabled={!prevToken || loading}
          onClick={() => setPageToken(prevToken)}
          className={`px-3 py-2 rounded-md border ${
            prevToken
              ? 'border-neutral-700 text-gray-200 hover:bg-neutral-800'
              : 'border-neutral-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Prev
        </button>
        <button
          disabled={!nextToken || loading}
          onClick={() => setPageToken(nextToken)}
          className={`px-3 py-2 rounded-md border ${
            nextToken
              ? 'border-neutral-700 text-gray-200 hover:bg-neutral-800'
              : 'border-neutral-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
}
