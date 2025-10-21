import { Link } from 'react-router-dom';
import type { PodcastVideo } from '../types/youtube';
import { FaRegClock, FaEye, FaPlay, FaHeart } from 'react-icons/fa';
import { favorites } from '../lib/favorites';
import { useEffect, useState } from 'react';

type Props = {
  video: PodcastVideo;
};

export default function PodcastCard({ video }: Props) {
  const [fav, setFav] = useState(favorites.has(video.id));

  useEffect(() => {
    const unsub = favorites.subscribe(() => setFav(favorites.has(video.id)));
    return unsub;
  }, [video.id]);

  const toggle = () => {
    const nowIn = favorites.toggle(video);
    setFav(nowIn);
  };

  return (
    <article className='rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700'>
      <div className='relative'>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target='_blank'
          rel='noreferrer'
          className='block'
          title={video.title}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className='w-full h-48 object-cover'
          />
        </a>

        <span className='absolute bottom-2 right-2 text-xs bg-black/80 text-white px-2 py-1 rounded'>
          {video.duration ?? '—'}
        </span>

        <button
          onClick={toggle}
          className={`absolute top-2 right-2 p-2 rounded-md transition ${
            fav ? 'bg-red-600 text-white' : 'bg-black/70 text-gray-200'
          } hover:bg-red-700`}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FaHeart />
        </button>
      </div>

      <div className='p-3'>
        <h2 className='text-sm font-semibold mb-1 line-clamp-2'>
          {video.title}
        </h2>

        <p className='text-xs text-gray-300 line-clamp-2'>
          {video.channelTitle}
        </p>
        <p className='text-[11px] text-gray-500 mb-2 break-all'>
          ID: {video.channelId}
        </p>

        <div className='flex items-center justify-between text-xs text-gray-400'>
          <div className='flex items-center gap-1'>
            <FaRegClock />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
          <div className='flex items-center gap-1'>
            <FaEye />
            <span>{video.viewCount?.toLocaleString() ?? '—'}</span>
          </div>
        </div>

        <div className='mt-3'>
          <Link
            to={`/podcasts/${video.id}`}
            className='inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition'
          >
            <FaPlay /> Details
          </Link>
        </div>
      </div>
    </article>
  );
}