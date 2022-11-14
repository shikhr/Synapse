import { NavLink } from 'react-router-dom';
import { BottomBarLinks } from '../../utils/links';

const BottomBar = () => {
  return (
    <div className="flex w-full justify-around text-text-primary-dark">
      {BottomBarLinks.map((link, i) => (
        <NavLink
          key={i}
          to={link.path}
          end={true}
          className="w-full h-full group"
          children={({ isActive }) => (
            <div className="text-2xl py-2 flex  justify-center items-center">
              <div className="group-hover:bg-background-overlay-dark p-3 rounded-full transition-colors ease-linear duration-200">
                {isActive ? <link.iconActive /> : <link.icon />}
              </div>
            </div>
          )}
        />
      ))}
    </div>
  );
};
export default BottomBar;
