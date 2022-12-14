import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Routes, Route, useLocation } from 'react-router-dom';
import EditProfileForm from './components/Forms/EditProfileForm';
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
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="explore" element={<Explore />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />}>
            <Route path="profile" element={<EditProfileForm />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        {background && (
          <Routes>
            <Route path="/settings" element={<Settings />}>
              <Route path="profile" element={<EditProfileForm />} />
            </Route>
          </Routes>
        )}
      </AppProvider>
      <ReactQueryDevtools />
    </div>
  );
}

export default App;
