import { IconType } from 'react-icons';
import {
  BsHouse,
  BsHouseFill,
  BsBookmarkStar,
  BsBookmarkStarFill,
} from 'react-icons/bs';
import {
  IoSearchOutline,
  IoSearch,
  IoSettings,
  IoSettingsOutline,
  IoNotificationsOutline,
  IoNotifications,
} from 'react-icons/io5';
import { HiOutlineUserCircle, HiUserCircle } from 'react-icons/hi';
import { RiSearchLine, RiSearchFill } from 'react-icons/ri';

interface Link {
  title: string;
  icon: IconType;
  iconActive: IconType;
  path: string;
  end?: boolean;
}

const AllLinks: Record<string, Link> = {
  home: {
    title: 'Home',
    icon: BsHouse,
    iconActive: BsHouseFill,
    path: '',
  },
  explore: {
    title: 'Explore',
    icon: RiSearchLine,
    iconActive: RiSearchFill,
    path: 'explore',
  },
  notifications: {
    title: 'Notifications',
    icon: IoNotificationsOutline,
    iconActive: IoNotifications,
    path: 'notifications',
  },
  profile: {
    title: 'Profile',
    icon: HiOutlineUserCircle,
    iconActive: HiUserCircle,
    path: 'profile/me',
    end: false,
  },
  bookmarks: {
    title: 'Bookmarks',
    icon: BsBookmarkStar,
    iconActive: BsBookmarkStarFill,
    path: 'bookmarks',
  },
  settings: {
    title: 'Settings',
    icon: IoSettingsOutline,
    iconActive: IoSettings,
    path: 'settings',
    end: false,
  },
};

const SidebarLinks: Link[] = [
  AllLinks.home,
  AllLinks.explore,
  AllLinks.notifications,
  AllLinks.profile,
  AllLinks.bookmarks,
  AllLinks.settings,
];
const BottomBarLinks: Link[] = [
  AllLinks.home,
  AllLinks.explore,
  AllLinks.notifications,
  AllLinks.profile,
  AllLinks.bookmarks,
];

interface IProfileLink {
  title: string;
  path: string;
  end?: boolean;
  mobileHidden?: boolean;
}

const ProfileLinks: IProfileLink[] = [
  { title: 'Posts', path: '' },
  { title: 'Comments', path: 'comments' },
];

const MobileBarLinks: Link[] = [AllLinks.settings, AllLinks.notifications];

export { AllLinks, SidebarLinks, BottomBarLinks, MobileBarLinks, ProfileLinks };
