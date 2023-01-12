import React, { ReactElement } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import useOuterClick from '../../hooks/useOuterClick';

interface KebabMenuProps {
  children: ReactElement;
}

const KebabMenu = ({ children }: KebabMenuProps) => {
  const { innerRef, isComponentVisible, setIsComponentVisible } =
    useOuterClick<HTMLDivElement>();

  return (
    <div
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      className="relative"
    >
      <div
        onClick={() => setIsComponentVisible(true)}
        className=" text-text-secondary-dark text-lg p-2 rounded-full duration-300 hover:bg-background-overlay-dark"
      >
        <BsThreeDots />
      </div>
      {isComponentVisible && (
        <div
          ref={innerRef}
          className="z-dropdown overflow-hidden absolute rounded-lg right-0 top-0 w-40 border border-text-secondary-dark bg-background-dark"
        >
          {React.cloneElement(children, {
            closeMenu: () => setIsComponentVisible(false),
          })}
        </div>
      )}
    </div>
  );
};
export default KebabMenu;
