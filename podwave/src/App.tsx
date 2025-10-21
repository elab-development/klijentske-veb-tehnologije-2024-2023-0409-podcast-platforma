import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './pages/Home';
import Podcasts from './pages/Podcasts';
import PodcastDetails from './pages/PodcastDetails';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/podcasts' element={<Podcasts />} />
        <Route path='/podcasts/:podcastId' element={<PodcastDetails />} />
        <Route path='/favorites' element={<Favorites />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}