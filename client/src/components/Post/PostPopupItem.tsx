import { ReactElement } from 'react';

interface PostPopupItemProps {
  children: ReactElement;
  onClick: () => any;
}

const PostPopupItem = ({ children, onClick }: PostPopupItemProps) => {
  return (
    <div
      className="px-2 py-1 hover:bg-background-overlay-dark duration-300"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
export default PostPopupItem;
