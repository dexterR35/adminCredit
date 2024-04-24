import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../Dialog/ConfirmDialog'; // Import the new component

const headers = ["Nume", "Istoric", "Telefon", "DataEntry", "Status"];

const DataTable = ({ dataProps, onEdit, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // State for managing confirmation dialog
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    const handleRowClick = (index) => {
        setExpandedRow(index === expandedRow ? null : index);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(1); // Reset page when searching
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1); // Reset page when changing items per page
    };

    const handleEditClick = (id, itemName) => {
        if (id) {
            setConfirmOpen(true);
            setConfirmMessage(`Are you sure you want to update ${itemName}?`);
            setConfirmAction(() => () => {
                onEdit(id);
                setConfirmOpen(false);
            });
        } else {
            console.error("Invalid ID for editing");
        }
    };

    const handleDeleteClick = (id, itemName) => {
        if (id) {
            setConfirmOpen(true);
            setConfirmMessage(`Are you sure you want to delete ${itemName}?`);
            setConfirmAction(() => () => {
                onDelete(id);
                setConfirmOpen(false);
            });
        } else {
            console.error("Invalid ID for deletion");
        }
    };

    // Filtering and pagination logic
    const filteredData = dataProps.filter(
        (item) => item.name.toLowerCase().includes(searchQuery) || item.phone.toLowerCase().includes(searchQuery)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`p-2 m-1 ${i === currentPage ? 'bg-green-300' : 'bg-white'}`}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <div className='space-x-2'>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="border p-1">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>
                    <span>
                        Showing {indexOfFirstItem + 1} - {indexOfLastItem} of {filteredData.length} results
                    </span>
                </div>

                <input
                    type="text"
                    placeholder="Search by name or phone"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="p-2 border rounded mb-2"
                />
            </div>

            <div className='overflow-auto'>
                <table className="w-full border-collapse">
                    <thead >
                        <tr className='static'>
                            {headers.map((header) => (
                                <th key={header} className="p-2 w-[20%]">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='overflow-auto'>
                        {currentItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr onClick={() => handleRowClick(index)} className="cursor-pointer">
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">{item.bankHistory}</td>
                                    <td className="p-2">{item.phone}</td>
                                    <td className="p-2">{item.timestamp}</td>
                                    <td className="p-2">{item.status}</td>
                                </tr>
                                {expandedRow === index && (
                                    <tr>
                                        <td colSpan={headers.length} className="p-2 border">
                                            <div>
                                                <p>Email: {item.email}</p>
                                                <p>Phone: {item.phone}</p>
                                                <p>About Us: {item.aboutUs}</p>
                                                <h4>Additional Details for {item.name}</h4>
                                            </div>
                                            <button className="bg-blue-300 p-1 rounded" onClick={() => handleEditClick(item.id)}>Edit</button>
                                            <button className="bg-red-300 p-1 rounded" onClick={() => handleDeleteClick(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls with page numbers */}
            <div className="flex justify-center mt-4">
                {renderPageNumbers()}
            </div>

            {/* ConfirmDialog component for confirmation */}
            <ConfirmDialog
                open={confirmOpen}
                message={confirmMessage}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmAction}
            />
        </div>
    );
};

DataTable.propTypes = {
    dataProps: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default DataTable;
