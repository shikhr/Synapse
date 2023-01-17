import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
interface OverlayProps {
  closeModal: () => void;
  className?: string;
}
const Overlay = ({ closeModal, className }: OverlayProps) => {
  return createPortal(
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, type: 'tween' }}
      onClick={closeModal}
      className={`fixed z-overlay top-0 left-0 bottom-0 right-0 bg-white bg-opacity-20 ${className}`}
    ></motion.div>,
    document.getElementById('overlay-root') as HTMLDivElement
  );
};
export default Overlay;
