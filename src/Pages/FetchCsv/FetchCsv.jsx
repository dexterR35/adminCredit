import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../../Components/Dialog/ConfirmDialog'; // Import the confirmation dialog

const DataTable = ({ onEdit, onDelete }) => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);

    const headers = ["DATA", "CONSULTANT", "NUME CLIENT", "STATUS", "Deadline"];

    useEffect(() => {
        fetch('/src/test6.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Received content is not JSON");
                }
                return response.json();
            })
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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

    // const handleEdit = (id) => {
    //     setConfirmOpen(true);
    //     setConfirmMessage(`Are you sure you want to edit the record with ID ${id}?`);
    //     setConfirmAction(() => {
    //         onEdit(id);
    //         setConfirmOpen(false);
    //     });
    // };

    // const handleDelete = (id) => {
    //     setConfirmOpen(true);
    //     setConfirmMessage(`Are you sure you want to delete the record with ID ${id}?`);
    //     setConfirmAction(() => {
    //         onDelete(id);
    //         setConfirmOpen(false);
    //     });
    // };

    const filteredData = data.filter(
        (item) => item['NUME CLIENT'].toLowerCase().includes(searchQuery) ||
            item['CONSULTANT'].toLowerCase().includes(searchQuery)
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
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border p-1"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by consultant or client name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="p-2 border rounded"
                />
            </div>

            <div className='overflow-auto'>
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="p-2">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr
                                    onClick={() => handleRowClick(index)}
                                    className={`cursor-pointer ${expandedRow === index ? 'bg-gray-200' : ''}`}
                                >
                                    <td className="p-2">{item['DATA']}</td>
                                    <td className="p-2">{item['CONSULTANT']}</td>
                                    <td className="p-2">{item['NUME CLIENT']}</td>
                                    <td className="p-2">{item['STATUS']}</td>
                                    <td className="p-2">{item['Deadline']}</td>
                                </tr>
                                {expandedRow === index && (
                                    <tr>
                                        <td colSpan={headers.length} className="p-2 border">
                                            <div>
                                                <p>Informatii aditionale: {item['Informatii aditionale']}</p>
                                                <p>Suma Salariu: {item['Suma Salariu']}</p>
                                                <p>Data angajare: {item['Data angajare']}</p>
                                                <p>Link BC sau Cod SR: {item['Link BC sau Cod SR']}</p>
                                            </div>
                                            {/* <button className="bg-blue-300 p-1 rounded" onClick={() => handleEdit(item['NUME CLIENT'])}>Edit</button>
                                            <button className="bg-red-300 p-1 rounded" onClick={() => handleDelete(item['NUME CLIENT'])}>Delete</button> */}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4 flex-wrap">
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

DataTable.propTypes = {
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default DataTable;
