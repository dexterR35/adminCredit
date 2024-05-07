import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay absolute top-0 w-full h-full z-50 bg-slate-500 opacity-85 flex flex-col items-center justify-center">
            <div className="modal bg-white p-5 w-[600px] m-w-full">
                <button onClick={onClose} className="modal-close-btn">Close</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
