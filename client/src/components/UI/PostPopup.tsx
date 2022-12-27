import { ReactElement } from 'react';

interface PostPopupProps {
  children: ReactElement;
}

const PostPopup = ({ children }: PostPopupProps) => {
  return (
    <>
      <div className="z-dropdown overflow-hidden absolute rounded-lg right-0 top-0 w-40 border border-text-secondary-dark bg-background-dark">
        {children}
      </div>
    </>
  );
};

export default PostPopup;
