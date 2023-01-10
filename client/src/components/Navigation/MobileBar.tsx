import { createPortal } from 'react-dom';
import { MobileBarLinks } from '../../utils/links';
import Overlay from '../UI/Overlay';

const MobileBar = () => {
  return (
    <div className="fixed top-0 animate-slidefromleft transition-all left-0 w-72 z-50 bg-background-dark h-screen ">
      <div>mobile</div>
    </div>
  );
};

export default MobileBar;
