import { ReactElement } from 'react';
import { createPortal } from 'react-dom';
interface ModalProps {
  children: ReactElement;
}

const CustomModal = ({ children }: ModalProps) => {
  return createPortal(
    children,
    document.getElementById('modal-root') as HTMLDivElement
  );
};

export default CustomModal;
