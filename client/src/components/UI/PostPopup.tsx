import { ReactElement } from 'react';

interface PostPopupProps {
  children: ReactElement;
  closePopup: () => void;
}

const PostPopup = ({ children, closePopup }: PostPopupProps) => {
  return (
    <div>
      <div
        onClick={closePopup}
        className="fixed z-30 top-0 left-0 bottom-0 right-0 bg-transparent"
      ></div>
      <div className="z-40 overflow-hidden absolute rounded-lg right-0 top-0 w-40 border border-text-secondary-dark bg-background-dark">
        {children}
      </div>
    </div>
  );
};

export default PostPopup;
