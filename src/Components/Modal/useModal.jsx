import { useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return { isOpen, openModal, closeModal };
};

const Modal = ({ isOpen, onClose, children ,title="title not found" }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-wrapper fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
      <div className="modal-overlay absolute top-0 w-full h-full bg-black opacity-50"></div>
      <div className="modal bg-white p-5 w-[600px] m-w-full z-10 rounded-md flex flex-col relative">
        <div className="flex flex-row justify-center ">
        <h3 className="mb-0 text-start w-full">{title}</h3>
        <button
          onClick={onClose}
          className="modal-close-btn right-0 top-[-10px] m-5 absolute "
        >
          x
        </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export { useModal, Modal };
