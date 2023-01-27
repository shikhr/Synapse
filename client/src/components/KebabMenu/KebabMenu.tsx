import React, { ReactElement } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import useOuterClick from '../../hooks/useOuterClick';
import { motion, AnimatePresence } from 'framer-motion';
import Overlay from '../UI/Overlay';
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
      <AnimatePresence>
        {isComponentVisible && (
          <>
            <div
              className="fixed inset-0 bg-transparent z-30 cursor-default"
              onClick={() => setIsComponentVisible(false)}
            ></div>
            <motion.div
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'tween', duration: 0.2 }}
              ref={innerRef}
              className="z-30 origin-top-right overflow-hidden absolute rounded-lg right-0 top-0 w-40 border border-text-secondary-dark bg-background-dark"
            >
              {React.cloneElement(children, {
                closeMenu: () => setIsComponentVisible(false),
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default KebabMenu;
