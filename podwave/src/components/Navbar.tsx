import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { FaPodcast, FaBars, FaTimes, FaHeart, FaHome } from 'react-icons/fa';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? 'bg-red-600 text-white'
        : 'text-gray-300 hover:bg-red-700 hover:text-white'
    }`;

  return (
    <nav className='bg-black border-b border-red-800'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center gap-2 text-red-500 font-bold text-lg'
        >
          <FaPodcast className='text-2xl' />
          PodWave
        </Link>

        {/* Desktop menu */}
        <div className='hidden md:flex items-center gap-4'>
          <NavLink to='/' className={linkClasses}>
            <FaHome className='inline mr-1' /> Home
          </NavLink>
          <NavLink to='/podcasts' className={linkClasses}>
            <FaPodcast className='inline mr-1' /> Podcasts
          </NavLink>
          <NavLink to='/favorites' className={linkClasses}>
            <FaHeart className='inline mr-1' /> Favorites
          </NavLink>
        </div>

        {/* Mobile menu button */}
        <button
          className='md:hidden text-gray-300 hover:text-white'
          onClick={toggleMenu}
        >
          {open ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className='md:hidden bg-black border-t border-red-800'>
          <div className='flex flex-col items-start px-4 py-3 space-y-2'>
            <NavLink to='/' className={linkClasses} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to='/podcasts' className={linkClasses} onClick={closeMenu}>
              Podcasts
            </NavLink>
            <NavLink
              to='/favorites'
              className={linkClasses}
              onClick={closeMenu}
            >
              Favorites
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
