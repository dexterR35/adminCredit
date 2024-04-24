import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Pagination from './_Pagination';
import Search from './_Search';
import ItemsPerPageSelector from './_itemPerPage';
import ConfirmDialog from '../Dialog/ConfirmDialog';

const headers = ["Name", "History", "Phone", "Timestamp", "Status"];

const DataTable = ({ dataProps, onEdit, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');

    const handleRowClick = (index) => setExpandedRow(index === expandedRow ? null : index);

    const filteredData = dataProps.filter(
        (item) => item.name.toLowerCase().includes(searchQuery) ||
            item.phone.toLowerCase().includes(searchQuery)
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleEditClick = (id, itemName) => {
        setConfirmOpen(true);
        setConfirmMessage(`Are you sure you want to update ${itemName}?`);
        setConfirmAction(() => {
            onEdit(id);
            setConfirmOpen(false);
        });
    };

    const handleDeleteClick = (id, itemName) => {
        setConfirmOpen(true);
        setConfirmMessage(`Are you sure you want to delete ${itemName}?`);
        setConfirmAction(() => {
            onDelete(id);
            setConfirmOpen(false);
        });
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <ItemsPerPageSelector
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
                <span>Showing {indexOfFirstItem + 1} - {indexOfLastItem} of {filteredData.length} results</span>
                <Search searchQuery={searchQuery} onSearch={setSearchQuery} />
            </div>

            <div className='overflow-auto'>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="p-2 w-[20%]">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
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
                                                <p>About Us: {item.aboutUs}</p>
                                                <h4>Additional Details for {item.name}</h4>
                                            </div>
                                            <button
                                                className="bg-blue-300 p-1 rounded"
                                                onClick={() => handleEditClick(item.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-300 p-1 rounded"
                                                onClick={() => handleDeleteClick(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

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