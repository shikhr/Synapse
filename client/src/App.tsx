import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import EditProfile from './components/Forms/EditProfile';
import FullPost from './components/Post/FullPost';
import Account from './components/Settings/Account';
import ChangePassword from './components/Settings/ChangePassword';
import DeleteAccount from './components/Settings/DeleteAccount';
import UserComments from './components/UserProfile/UserComments';
import UserFollowList from './components/UserProfile/UserFollowList';
import UserPosts from './components/UserProfile/UserPosts';
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
  OAuthParams,
  Settings,
  Notifications,
} from './pages';

function App() {
  const location = useLocation();
  const background = location.state;

  return (
    <div className="bg-background-dark w-full h-full">
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
              <Route path="profile/:userId" element={<Profile />}>
                <Route index element={<UserPosts />} />
                <Route path="comments" element={<UserComments />} />
                <Route
                  path="followers"
                  element={<UserFollowList type="followers" />}
                />
                <Route
                  path="following"
                  element={<UserFollowList type="following" />}
                />
              </Route>
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="explore" element={<Explore />} />
              <Route path="settings" element={<Settings />}>
                <Route index element={<Account />} />
                <Route path="delete-account" element={<DeleteAccount />} />
                <Route path="password" element={<ChangePassword />} />
                <Route path="profile" element={<EditProfile />} />
              </Route>
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/authParams" element={<OAuthParams />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* when settings route is opened from a link with a background state location */}
          {background && (
            <Routes>
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              >
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
