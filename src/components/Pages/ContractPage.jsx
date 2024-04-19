// ContractPage.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomModal from "./ModalPage";
import SearchInput from "../utils/_Search"
import { FetchContractData } from '../../services/Hooks';

Modal.setAppElement('#root'); // Set the root element for accessibility

const ContractPage = () => {
    const { contracts } = FetchContractData();
    const [selectedContract, setSelectedContract] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Helper function to parse query string
    const getQueryParam = (param) => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get(param);
    };
    const searchProducts = async (searchTerm) => {
        // Filtering the contracts array based on the search term
        return contracts.filter(contract =>
            contract.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    useEffect(() => {
        const contractId = getQueryParam('id');
        if (contractId) {
            const contract = contracts.find(c => c.id === contractId);
            if (contract) {
                setSelectedContract(contract);
            }
        }
    }, [location.search, contracts]);

    const handleViewContract = (contract) => {
        navigate(`?id=${contract.id}`); // Change the URL, which triggers the useEffect
    };

    const closeModal = () => {
        setSelectedContract(null);
        navigate('?'); // Navigate back without any query parameters
    };

    return (
        <div className=' mx-auto'>
            <h2 className='text-start mb-4'>Contract Clienti</h2>

            <SearchInput onSearch={searchProducts} />
            <div className='grid grid-cols-3 2xl:grid-cols-4 xl:grid-cols-3 gap-4 w-full'>
                {contracts.map((contract) => (
                    <div key={contract.id} className="border border-gray-100 shadow-md w-full bg-gray-50 mx-auto p-2 mb-4 rounded-md relative">
                        <p className='relative text-[10px] text-gray-700 mb-2'>ID / Contract / {contract.id}</p>
                        <div className='flex flex-row items-center justify-between mb-2'>
                            <div>
                                <p className='font-bold text-md capitalize'>{contract.firstName} {contract.lastName}</p>
                                <p className='text-gray-700 text-[12px]'>Tel:{contract.phone}</p>
                                <p className='text-gray-700 text-[12px]'>Data:22.04.2024</p>
                            </div>
                            <div className='cursor-pointer flex flex-col justify-center self-end'>
                                <button className="p-2 mx-auto font-normal text-sm underline text-blue-700" onClick={() => handleViewContract(contract)}>detalii</button>
                                <p className='bg-green-500 p-1 rounded-full w-[12px] h-[12px] absolute right-2 top-2'></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <CustomModal
                isOpen={selectedContract !== null}
                onRequestClose={closeModal}
                id="contractDetails"
                data={selectedContract}
            />
        </div>
    );
};

export default ContractPage;
