import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/explore" element={<Explore />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppProvider>
      <ReactQueryDevtools />
    </BrowserRouter>
  );
}

export default App;
