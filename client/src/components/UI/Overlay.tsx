interface OverlayProps {
  closeModal: () => void;
}
const Overlay = ({ closeModal }: OverlayProps) => {
  return (
    <div
      onClick={closeModal}
      className="fixed z-40 top-0 left-0 bottom-0 right-0 bg-white bg-opacity-20"
    ></div>
  );
};
export default Overlay;
