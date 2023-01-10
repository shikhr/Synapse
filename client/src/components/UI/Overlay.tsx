import { createPortal } from 'react-dom';

interface OverlayProps {
  closeModal: () => void;
  className?: string;
}
const Overlay = ({ closeModal, className }: OverlayProps) => {
  return createPortal(
    <div
      onClick={closeModal}
      className={`fixed z-overlay top-0 left-0 bottom-0 right-0 bg-white bg-opacity-20 ${className}`}
    ></div>,
    document.getElementById('overlay-root') as HTMLDivElement
  );
};
export default Overlay;
