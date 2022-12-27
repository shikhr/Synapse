import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { SidebarLinks } from '../../utils/links';
import Avatar from '../Avatar/Avatar';
import { BsThreeDots } from 'react-icons/bs';
import Button from '../UI/Button';
import useOuterClick from '../../hooks/useOuterClick';

const Sidebar = () => {
  const { user, logoutUser } = useAppContext();
  const { innerRef, isComponentVisible, setIsComponentVisible } =
    useOuterClick<HTMLDivElement>();

  return (
    <div className="flex flex-col h-full lx:w-64 py-4 text-text-primary-dark">
      <div className="flex flex-col gap-0">
        {SidebarLinks.map((link, i) => (
          <NavLink
            end={true}
            key={i}
            to={link.path}
            children={({ isActive }) => (
              <div className="group pr-2">
                <div className="flex justify-center lx:justify-start w-12 max-lx:aspect-square lx:w-fit items-center gap-4 px-4 py-3 rounded-full group-hover:bg-background-overlay-dark transition-colors ease-linear duration-200">
                  <div className="text-2xl">
                    {isActive ? <link.iconActive /> : <link.icon />}
                  </div>
                  <div
                    className={`${
                      isActive && 'font-bold'
                    } text-xl hidden lx:block`}
                  >
                    {link.title}
                  </div>
                </div>
              </div>
            )}
          />
        ))}
      </div>

      <div className="relative w-full mt-auto cursor-pointer pr-2">
        <div
          onClick={() => setIsComponentVisible(!isComponentVisible)}
          className="p-1 aspect-square lx:aspect-auto lx:py-2 lx:px-3 rounded-full duration-300 hover:bg-background-overlay-dark flex items-center justify-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 lx:w-11 aspect-square text-4xl">
              <Avatar sourceId={user?.avatarId} />
            </div>
            <div className="flex-col hidden lx:flex">
              <span className="font-semibold text-lg">{user?.username}</span>
              <span className="text-text-secondary-dark text-sm">
                @{user?.displayName}
              </span>
            </div>
          </div>
          <div className="ml-auto hidden lx:block">
            <BsThreeDots />
          </div>
        </div>
        {isComponentVisible && (
          <div ref={innerRef}>
            <div className="absolute px-6 z-40 w-64 lx:w-auto lx:right-2 flex justify-center items-center py-6 left-0 -top-28 cursor-pointer rounded-lg border  border-text-secondary-dark bg-background-dark shadow-text-gray">
              <Button variant="primary" onClick={logoutUser}>
                Logout
              </Button>
              <div className="absolute left-4 lx:left-1/2 lx:-translate-x-1/2 z-50 -bottom-0 translate-y-[.525rem] origin-center w-4 h-4 rotate-45 bg-background-dark border-text-secondary-dark border-r border-b "></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
