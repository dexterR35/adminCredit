import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmDialog from '../../Components/Dialog/ConfirmDialog'; // Confirmation dialog
import { FetchContractData } from '../../services/Hooks';

const headers = ["First Name", "Last Name", "Phone", "ID", "Actions"];

const ContractPage = () => {
    const { contracts, onEdit, onDelete } = FetchContractData();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');


    const navigate = useNavigate();




    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleViewContract = (contract) => {
        setSelectedContract(contract);
        navigate(`?id=${contract.id}`);
    };

    const handleDelete = (id) => {
        setConfirmOpen(true);
        setConfirmMessage(`Are you sure you want to delete contract with ID ${id}?`);
        setConfirmAction(() => () => {
            onDelete(id); // Correct function call
            setConfirmOpen(false);
        });
    };

    const handleEdit = (id, updatedData) => {
        setConfirmOpen(true);
        setConfirmMessage(`Do you want to update contract with ID ${id}?`);
        setConfirmAction(() => () => {
            onEdit(id, updatedData); // Correct function call
            setConfirmOpen(false);
        });
    };

    const filteredContracts = contracts.filter(
        contract =>
            contract.firstName.toLowerCase().includes(searchQuery) ||
            contract.lastName.toLowerCase().includes(searchQuery) ||
            contract.phone.toLowerCase().includes(searchQuery) ||
            contract.id.toLowerCase().includes(searchQuery)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredContracts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`p-2 m-1 ${i === currentPage ? 'bg-green-300' : 'bg-white'}`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div>
            <h2 className="text-start mb-4">Contract Clienti</h2>

            <div className="flex justify-between items-end mb-2">
                <select value={itemsPerPage} onChange={e => setItemsPerPage(parseInt(e.target.value, 10))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by name, phone, or ID"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="p-2 border rounded"
                />
            </div>

            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="p-2">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((contract, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td>{contract.firstName}</td>
                                    <td>{contract.lastName}</td>
                                    <td>{contract.phone}</td>
                                    <td>{contract.id}</td>
                                    <td>
                                        <button className="bg-blue-300 p-1" onClick={() => handleEdit(contract.id)}>Edit</button>
                                        <button className="bg-red-300 p-1" onClick={() => handleDelete(contract.id)}>Delete</button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                {renderPageNumbers()}
            </div>

            <ConfirmDialog
                open={confirmOpen}
                message={confirmMessage}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmAction}
            />


        </div>
    );
};

export default ContractPage;
