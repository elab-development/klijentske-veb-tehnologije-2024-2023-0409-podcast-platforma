import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { YouTubeAPI, parseISODurationToClock } from '../lib/youtube';
import type { YTVideoItem } from '../types/youtube';
import type { PodcastVideo } from '../types/youtube';
import { favorites } from '../lib/favorites';
import {
  FaArrowLeft,
  FaYoutube,
  FaRegClock,
  FaEye,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaHeart,
} from 'react-icons/fa';

type Detail = {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  thumbnail: string;
  duration?: string;
  viewCount?: number;
};

export default function PodcastDetails() {
  const { podcastId } = useParams<{ podcastId: string }>();
  const api = useMemo(() => new YouTubeAPI(), []);
  const [item, setItem] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  const bestThumb = (it?: YTVideoItem) =>
    it?.snippet?.thumbnails?.high?.url ||
    it?.snippet?.thumbnails?.medium?.url ||
    it?.snippet?.thumbnails?.default?.url ||
    '';

  const toPodcastVideo = (d: Detail): PodcastVideo => ({
    id: d.id,
    title: d.title,
    description: d.description,
    channelTitle: d.channelTitle,
    channelId: d.channelId,
    publishedAt: d.publishedAt,
    thumbnail: d.thumbnail,
    duration: d.duration,
    viewCount: d.viewCount,
  });

  useEffect(() => {
    const run = async () => {
      if (!podcastId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.getVideoDetails([podcastId]);
        const v = res.items?.[0];
        if (!v) {
          setError('Video not found.');
          setItem(null);
          return;
        }
        const detail: Detail = {
          id: v.id,
          title: v.snippet.title,
          description: v.snippet.description,
          channelTitle: v.snippet.channelTitle,
          channelId: v.snippet.channelId,
          publishedAt: v.snippet.publishedAt,
          thumbnail: bestThumb(v),
          duration: parseISODurationToClock(v.contentDetails?.duration),
          viewCount: v.statistics?.viewCount
            ? Number(v.statistics.viewCount)
            : undefined,
        };
        setItem(detail);
        setIsFav(favorites.has(detail.id));
      } catch (e: any) {
        setError(e?.message || 'Failed to load podcast details.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [podcastId]);

  useEffect(() => {
    const unsub = favorites.subscribe(() => {
      if (item) setIsFav(favorites.has(item.id));
    });
    return unsub;
  }, [item]);

  const toggleFavorite = () => {
    if (!item) return;
    const pv = toPodcastVideo(item);
    const nowIn = favorites.toggle(pv);
    setIsFav(nowIn);
  };

  return (
    <main className='mx-auto max-w-5xl'>
      <div className='mb-4 flex items-center justify-between gap-2'>
        <Link
          to='/podcasts'
          className='inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white'
        >
          <FaArrowLeft /> Back to Podcasts
        </Link>
        <div className='flex items-center gap-2'>
          {item && (
            <button
              onClick={toggleFavorite}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md transition ${
                isFav
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700 border border-neutral-700'
              }`}
              title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <FaHeart />
              {isFav ? 'Remove Favorite' : 'Add to Favorites'}
            </button>
          )}
          {item && (
            <a
              href={`https://www.youtube.com/watch?v=${item.id}`}
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition'
              title='Open on YouTube'
            >
              <FaYoutube /> Watch on YouTube
            </a>
          )}
        </div>
      </div>

      {loading && <p className='text-gray-400'>Loading…</p>}
      {error && <p className='text-red-400'>{error}</p>}

      {item && (
        <section className='grid gap-6 md:grid-cols-2'>
          <div className='rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700'>
            <img src={item.thumbnail} className='w-full h-64 object-cover' />
          </div>

          <div className='rounded-lg bg-neutral-800 border border-neutral-700 p-4'>
            <h1 className='text-xl font-semibold mb-2'>{item.title}</h1>

            <div className='text-sm text-gray-300 mb-1'>
              Channel: <span className='font-medium'>{item.channelTitle}</span>
            </div>
            <div className='text-xs text-gray-500 mb-3 break-all'>
              Channel ID: {item.channelId}
            </div>

            <div className='flex flex-wrap gap-4 text-xs text-gray-300 mb-4'>
              <div className='inline-flex items-center gap-1'>
                <FaCalendarAlt />
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className='inline-flex items-center gap-1'>
                <FaRegClock />
                <span>{item.duration ?? '—'}</span>
              </div>
              <div className='inline-flex items-center gap-1'>
                <FaEye />
                <span>{item.viewCount?.toLocaleString() ?? '—'}</span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${item.id}`}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-1 text-red-400 hover:text-red-300'
                title='Open on YouTube'
              >
                <FaExternalLinkAlt /> Open
              </a>
            </div>

            <div className='text-sm text-gray-300 whitespace-pre-line'>
              {item.description || 'No description.'}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}