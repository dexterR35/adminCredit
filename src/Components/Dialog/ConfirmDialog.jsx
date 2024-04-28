import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ConfirmDialog = ({ open, onClose, message, onConfirm }) => {
    const [confirmText, setConfirmText] = useState(''); // Track text input state
    if (!open) {
        return null; // Don't render the dialog if it's not open
    }
    // Check if user typed "delete"
    const isConfirmEnabled = confirmText.toLowerCase() === 'delete';
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg">
                <p className='text-center w-[80%] mx-auto'>{message}</p>

                {/* Text input for confirmation */}
                <div className="mt-2 flex flex-col ">
                    <p className='text-center mb-2'>Type 'delete' to confirm:</p>

                    <label htmlFor="confirm-input"></label>
                    <input
                        type="text"
                        id="confirm-input"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)} // Update text state
                        className="border p-2 rounded"
                    />
                </div>
                <div className="flex justify-start mt-4 space-x-6">
                    <button className="bg-red-300 p-2 rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={`p-2 rounded ${isConfirmEnabled ? 'bg-green-300' : 'bg-gray-300'}`} // Change color based on state
                        onClick={isConfirmEnabled ? onConfirm : null} // Enable only if condition met
                        disabled={!isConfirmEnabled} // Disable if condition not met
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
