
import { useEffect, useMemo, useState } from 'react';
import { YouTubeAPI } from '../lib/youtube';
import type { PodcastVideo } from '../types/youtube';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlay, FaRegClock, FaEye } from 'react-icons/fa';

export default function Podcasts() {
  const api = useMemo(() => new YouTubeAPI(), []);
  const [query, setQuery] = useState('podcast');
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

      <form onSubmit={onSubmit} className='mb-4'>
        <div className='flex gap-2'>
          <input
            className='flex-1 rounded-md bg-neutral-800 text-white px-3 py-2 placeholder-gray-400 outline-none border border-neutral-700 focus:border-red-600'
            placeholder='Search podcasts...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type='submit'
            className='px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition inline-flex items-center gap-2'
          >
            <FaSearch /> Search
          </button>
        </div>
      </form>

      {loading && <p className='text-gray-400 mb-4'>Loading…</p>}
      {error && (
        <p className='text-red-400 mb-4'>
          {error} (Check your VITE_YT_API_KEY)
        </p>
      )}

      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map((v) => (
          <article
            key={v.id}
            className='rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700'
          >
            <div className='relative'>
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target='_blank'
                rel='noreferrer'
                className='block'
                title={v.title}
              >
                <img src={v.thumbnail} className='w-full h-48 object-cover' />
              </a>
              <span className='absolute bottom-2 right-2 text-xs bg-black/80 text-white px-2 py-1 rounded'>
                {v.duration ?? '—'}
              </span>
            </div>

            <div className='p-3'>
              <h2 className='text-sm font-semibold mb-1 line-clamp-2'>
                {v.title}
              </h2>
              <p className='text-xs text-gray-400 mb-2 line-clamp-2'>
                {v.channelTitle}
              </p>

              <div className='flex items-center justify-between text-xs text-gray-400'>
                <div className='flex items-center gap-1'>
                  <FaRegClock />
                  <span>{new Date(v.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <FaEye />
                  <span>{v.viewCount?.toLocaleString() ?? '—'}</span>
                </div>
              </div>

              <div className='mt-3'>
                <Link
                  to={`/podcasts/${v.id}`}
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition'
                >
                  <FaPlay /> Details
                </Link>
              </div>
            </div>
          </article>
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
