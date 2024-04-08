import React, { useState } from 'react';
import Modal from 'react-modal';
import { FetchContractData } from '../../services/Hooks';

Modal.setAppElement('#root'); // Set the root element for accessibility

const ContractPage = () => {
    const { contracts } = FetchContractData();
    const [selectedContract, setSelectedContract] = useState(null);

    const handleViewContract = (contract) => {
        setSelectedContract(contract);
    };

    const closeModal = () => {
        setSelectedContract(null);
    };

    return (
        <div>
            <div>
                {contracts.map((contract) => (
                    <div key={contract.id} style={{ marginBottom: '20px' }}>
                        <h2>
                            {contract.firstName} {contract.lastName}
                        </h2>
                        <p>Phone: {contract.phone}</p>
                        {/* Button to view contract */}

                        <button onClick={() => handleViewContract(contract)}>View</button>
                    </div>
                ))}
            </div>
            {/* Modal to display contract details */}
            <Modal
                isOpen={selectedContract !== null}
                onRequestClose={closeModal}
                contentLabel="Contract Details"
            >
                {selectedContract && (
                    <div>
                        <h2>
                            {selectedContract.firstName} {selectedContract.lastName}
                        </h2>
                        <p>Phone: {selectedContract.phone}</p>
                        <p>Email: {selectedContract.email}</p>
                        {selectedContract.photo && (
                            <img
                                src={selectedContract.photo}
                                alt="Uploaded"
                                style={{ width: '100px', height: '100px' }}
                            />
                        )}
                        {selectedContract.signature && (
                            <img
                                src={selectedContract.signature}
                                alt="Signature"
                                style={{ width: '200px', height: '100px' }}
                            />
                        )}
                        {/* Add other contract information here */}
                    </div>
                )}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default ContractPage;
