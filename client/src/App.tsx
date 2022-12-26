import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import EditProfile from './components/Forms/EditProfile';
import FullPost from './components/Post/FullPost';
import AppProvider from './context/AppContext';

import {
  Bookmarks,
  Explore,
  Home,
  Layout,
  NotFound,
  Profile,
  ProtectedRoute,
  Register,
} from './pages';
import Settings from './pages/Settings';

function App() {
  const location = useLocation();
  const background = location.state;

  return (
    <div className="bg-background-dark w-full h-screen">
      <AppProvider>
        <SkeletonTheme baseColor="#1B2730" highlightColor="#23323c">
          <Routes location={background || location}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="post/:postId" element={<FullPost />} />
              <Route path="profile/:userId" element={<Profile />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="explore" element={<Explore />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Settings />}>
              <Route path="profile" element={<EditProfile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          {background && (
            <Routes>
              <Route path="/settings" element={<Settings />}>
                <Route path="profile" element={<EditProfile />} />
              </Route>
            </Routes>
          )}
        </SkeletonTheme>
      </AppProvider>
      <ReactQueryDevtools />
    </div>
  );
}

export default App;
