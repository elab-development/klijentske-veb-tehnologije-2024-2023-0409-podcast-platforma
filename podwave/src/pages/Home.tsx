import { Link } from 'react-router-dom';
import { FaPodcast, FaHeart } from 'react-icons/fa';

export default function Home() {
  return (
    <main className='relative flex flex-col items-center justify-center min-h-[80vh] overflow-hidden px-6 text-center'>
      <div className='absolute inset-0 bg-gradient-to-b from-red-900/30 via-transparent to-black' />
      <div className='absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-700/20 blur-[180px]' />

      <section className='relative z-10 max-w-2xl'>
        <h1 className='text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text drop-shadow-md'>
          PodWave
        </h1>

        <p className='text-gray-300 text-lg sm:text-xl leading-relaxed mb-10'>
          Dive into the world of podcasts — discover, explore, and save your
          favorite episodes straight from{' '}
          <span className='text-red-500 font-semibold'>YouTube</span>.
        </p>

        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <Link
            to='/podcasts'
            className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 transition-all text-lg shadow-md'
          >
            <FaPodcast className='text-xl' /> Explore Podcasts
          </Link>

          <Link
            to='/favorites'
            className='inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neutral-800 border border-neutral-700 text-gray-200 hover:bg-neutral-700 hover:-translate-y-0.5 transition-all text-lg shadow-md'
          >
            <FaHeart className='text-xl text-red-400' /> My Favorites
          </Link>
        </div>
      </section>
    </main>
  );
}
