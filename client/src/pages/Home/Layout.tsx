import { Outlet } from 'react-router-dom';
import BottomBar from '../../components/Navigation/BottomBar';
import Sidebar from '../../components/Navigation/Sidebar';
import FollowSuggestions from '../../components/RightContainer/FollowSuggestions';

const Layout = () => {
  return (
    <div className="bg-background-dark flex flex-col">
      <div className="isolate mx-auto flex flex-col min-h-screen h-full w-full">
        <div className="flex  flex-1 relative w-full xs:px-2 md:px-4">
          <div className="hidden ml-auto xs:block sticky top-0 h-screen">
            <Sidebar />
          </div>
          <div className="max-w-2xl max-ml:mr-auto w-full flex-1 xs:border-r xs:border-l border-text-secondary-dark">
            <Outlet />
          </div>
          <div className="w-80 ml-4 py-4 sticky mr-auto hidden ml:block ">
            <FollowSuggestions />
          </div>
        </div>
        <div className="sticky z-50 bottom-0 border-t border-text-secondary-dark bg-background-dark block xs:hidden">
          <BottomBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
