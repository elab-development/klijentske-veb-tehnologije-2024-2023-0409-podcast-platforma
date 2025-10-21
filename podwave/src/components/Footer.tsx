export default function Footer() {
  return (
    <footer className='bg-black border-t border-red-800 text-gray-400 text-sm'>
      <div className='max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2'>
        <p>© {new Date().getFullYear()} PodWave. All rights reserved.</p>
        <p className='text-red-500 font-semibold'>Stream the sound of ideas.</p>
      </div>
    </footer>
  );
}
