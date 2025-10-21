import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen bg-black text-center text-white px-4'>
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <p className='text-gray-400 text-lg mb-8'>
        The page you’re looking for doesn’t exist.
      </p>

      <Link
        to='/'
        className='px-6 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-lg'
      >
        Go back home
      </Link>
    </main>
  );
}