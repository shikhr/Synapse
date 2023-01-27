import { ReactElement } from 'react';

interface PopupItemProps {
  children: ReactElement;
  onClick: () => any;
}

const PopupItem = ({ children, onClick }: PopupItemProps) => {
  return (
    <div
      className="px-2 py-1 hover:bg-background-overlay-dark duration-300"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default PopupItem;
