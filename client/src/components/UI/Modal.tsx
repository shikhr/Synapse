import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
interface ModalProps {
  children: ReactElement;
}

const Modal = ({ children }: ModalProps) => {
  return createPortal(
    <div className="w-full h-full z-modal md:max-w-2xl md:h-[90vh] md:rounded-lg bg-background-dark fixed inset-0 md:position-center">
      {children}
    </div>,
    document.getElementById('modal-root') as HTMLDivElement
  );
};

export default Modal;
