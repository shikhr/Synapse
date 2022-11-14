import { NavLink } from 'react-router-dom';
import { SidebarLinks } from '../../utils/links';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full lx:w-48 py-4 text-text-primary-dark">
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
    </div>
  );
};
export default Sidebar;
