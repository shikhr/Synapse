import { Outlet } from 'react-router-dom';
import BottomBar from '../../components/Navigation/BottomBar';
import MobileBar from '../../components/Navigation/MobileBar';
import Sidebar from '../../components/Navigation/Sidebar';
import FollowSuggestions from '../../components/RightContainer/FollowSuggestions';

const Layout = () => {
  return (
    <div className="bg-background-dark min-h-screen h-full xs:pb-0 pb-16">
      <div className="isolate mx-auto flex flex-col h-full w-full">
        <div className="flex relative w-full xs:px-2 md:px-4">
          <div className="hidden ml-auto overflow-auto xs:block sticky top-0 h-[100dvh] max-h-full">
            <Sidebar />
          </div>
          <div className="max-w-2xl max-ml:mr-auto min-w-0 w-full max-h-full flex-1 xs:border-r xs:border-l border-text-secondary-dark">
            <Outlet />
          </div>
          <div className="w-80 ml-4 py-4 sticky top-0 h-screen mr-auto hidden ml:block ">
            <FollowSuggestions />
          </div>
        </div>
      </div>
      <div className="z-50 fixed bottom-0 left-0 right-0 border-t border-text-secondary-dark bg-background-dark block xs:hidden">
        <BottomBar />
      </div>
    </div>
  );
};

export default Layout;
