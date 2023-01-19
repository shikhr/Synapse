import React from 'react';
import { IconType } from 'react-icons';
import { BsChevronRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const SettingsItem = ({
  children,
  Icon,
  to,
}: {
  children: React.ReactNode;
  Icon: IconType;
  to: string;
}) => {
  return (
    <Link
      to={to}
      className="cursor-pointer group flex gap-6 px-4 xs:px-6 py-5 justify-start items-center text-text-primary-dark border-b border-text-secondary-dark w-full hover:bg-background-overlay-dark duration-300"
    >
      <Icon
        size={20}
        className="text-text-secondary-dark group-hover:text-text-primary-dark duration-300"
      />
      {children}
      <BsChevronRight className="ml-auto text-text-secondary-dark group-hover:text-text-primary-dark duration-300" />
    </Link>
  );
};
export default SettingsItem;
