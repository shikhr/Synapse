import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
interface ModalProps {
  children: ReactElement;
}

const Modal = ({ children }: ModalProps) => {
  return createPortal(
    <div className="w-full h-full z-modal md:max-w-2xl md:h-auto md:max-h-[90vh] md:rounded-md overscroll-none overflow-auto bg-background-dark fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      {children}
    </div>,
    document.getElementById('overlay-root') as HTMLDivElement
  );
};

export default Modal;
