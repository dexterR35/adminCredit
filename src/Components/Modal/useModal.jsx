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
      <div className="modal bg-slate-800 border border-slate-700/50 p-6 w-[600px] max-w-full z-10 rounded-xl flex flex-col relative shadow-2xl backdrop-blur-sm">
        <div className="flex flex-row justify-center items-center mb-5">
          <h3 className="mb-0 text-start w-full text-slate-100 text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="modal-close-btn right-0 top-0 text-slate-400 hover:text-slate-100 text-2xl font-light w-8 h-8 flex items-center justify-center rounded transition-colors"
          >
            ×
          </button>
        </div>
        <div className="text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export { useModal, Modal };
