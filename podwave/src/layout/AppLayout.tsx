import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AppLayout() {
  return (
    <div className='flex flex-col min-h-screen bg-neutral-900 text-white'>
      <Navbar />
      <main className='flex-1 p-4 md:p-6'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
