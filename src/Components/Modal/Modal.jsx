import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-wrapper absolute top-0 w-full h-full z-50 flex items-center justify-center">
            <div className="modal-overlay absolute top-0 w-full h-full bg-black opacity-50"></div>
            <div className="modal bg-white p-5 w-[600px] m-w-full z-10 rounded-md relative">
                <button onClick={onClose} className="modal-close-btn absolute right-0 top-0 m-5">Close</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
