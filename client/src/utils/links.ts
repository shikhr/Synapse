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
    path: '/',
  },
  explore: {
    title: 'Explore',
    icon: RiSearchLine,
    iconActive: RiSearchFill,
    path: '/explore',
  },
  profile: {
    title: 'Profile',
    icon: HiOutlineUserCircle,
    iconActive: HiUserCircle,
    path: '/profile/me',
    end: false,
  },
  bookmarks: {
    title: 'Bookmarks',
    icon: BsBookmarkStar,
    iconActive: BsBookmarkStarFill,
    path: '/bookmarks',
  },
  settings: {
    title: 'Settings',
    icon: IoSettingsOutline,
    iconActive: IoSettings,
    path: '/settings',
    end: false,
  },
};

const SidebarLinks: Link[] = [
  AllLinks.home,
  AllLinks.explore,
  AllLinks.profile,
  AllLinks.bookmarks,
  AllLinks.settings,
];
const BottomBarLinks: Link[] = [
  AllLinks.home,
  AllLinks.explore,
  AllLinks.profile,
  AllLinks.bookmarks,
];

const MobileBarLinks: Link[] = [AllLinks.settings];

export { AllLinks, SidebarLinks, BottomBarLinks, MobileBarLinks };
