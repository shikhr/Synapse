import { BsThreeDots } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { MobileBarLinks } from '../../utils/links';
import Avatar from '../Avatar/Avatar';
import Button from '../UI/Button';

interface MobileBarProps {
  closeMobileBar: () => void;
}

const MobileBar = ({ closeMobileBar }: MobileBarProps) => {
  const { user, logoutUser } = useAppContext();

  return (
    <div className="overflow-auto text-text-primary-dark flex flex-col h-full max-h-full bg-background-dark">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="font-semibold">Account Info</div>
        <div
          onClick={closeMobileBar}
          className="p-2 text-xl bg-background-dark text-text-secondary-dark hover:text-text-primary-dark hover:bg-background-overlay-dark aspect-square flex items-center justify-center cursor-pointer rounded-full"
        >
          <FaTimes />
        </div>
      </div>

      {/* user pic and name */}
      <Link
        to="/profile/me"
        className="flex items-center px-4 cursor-pointer py-3"
      >
        <div className="flex w-full items-center gap-4">
          <div className="w-12 aspect-square text-4xl">
            <Avatar sourceId={user?.avatarId} />
          </div>
          <div className="flex-col flex overflow-hidden">
            <span className="font-semibold text-lg overflow-hidden overflow-ellipsis">
              {user?.displayName}
            </span>
            <span className="text-text-secondary-dark text-sm">
              @{user?.username}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-0 ">
        {MobileBarLinks.map((link, i) => (
          <NavLink
            end={true}
            key={i}
            to={link.path}
            children={({ isActive }) => (
              <div className="flex justify-start items-center gap-4 px-4 py-3 hover:bg-background-overlay-dark transition-colors ease-linear duration-200">
                <div className="text-2xl">
                  {isActive ? <link.iconActive /> : <link.icon />}
                </div>
                <div className={`${isActive && 'font-bold'} text-xl `}>
                  {link.title}
                </div>
              </div>
            )}
          />
        ))}
      </div>
      <div className="px-8 mt-auto mb-4">
        <Button variant="primary" onClick={logoutUser}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default MobileBar;
