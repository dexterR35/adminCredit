import React, { useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';

const CustomerEditModal = ({ isOpen, customer, onSave, onClose }) => {
    const [editedCustomer, setEditedCustomer] = useState(customer);

    const handleSave = () => {
        onSave(editedCustomer);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
                <h2>Edit Customer</h2>
                <TextField
                    label="Name"
                    value={editedCustomer.name}
                    onChange={(e) => setEditedCustomer({ ...editedCustomer, name: e.target.value })}
                    margin="normal"
                    fullWidth
                />
                {/* Include other fields as necessary */}
                <Button onClick={handleSave} variant="contained">Save</Button>
                <Button onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</Button>
            </div>
        </Modal>
    );
};
export default CustomerEditModal