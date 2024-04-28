import React, { useState, useEffect } from 'react';
import TableCustom from '../../Components/Table/TableCustom';
import UseDataTable from '../../Components/Table/UseDataTable';
import Pagination from '../../Components/Table/_Pagination';
import Search from '../../Components/Table/_Search';
import ItemsPerPageSelector from '../../Components/Table/_itemPerPage';

const DataTable = ({ onEdit, onDelete }) => {
    const [data, setData] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState('');
    const headers = ["DATA", "CONSULTANT", "NUME CLIENT"];

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
            .then(data => {
                console.log("Fetched data:", data); // Log fetched data
                setData(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const {
        searchQuery,
        currentPage,
        itemsPerPage,
        handleRowClick,
        handleSearch,
        handleItemsPerPageChange,
        handlePageChange,
        filteredData,
        currentItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        expandedRow
    } = UseDataTable(data);

    const handleConsultantChange = (event) => {
        setSelectedConsultant(event.target.value);
    };

    const generateTableBody = () => {
        return currentItems.map((item, index) => (
            <React.Fragment key={index}>
                <tr onClick={() => handleRowClick(index)} className="cursor-pointer text-[14px]">
                    <td className="p-2">{item["DATA"]}</td>
                    <td className="p-2">{item['CONSULTANT']}</td>
                    <td className="p-2">{item['NUME CLIENT']}</td>
                </tr>
                {expandedRow === index && (
                    <tr>
                        <td colSpan={headers.length} className="p-2 border">
                            <div>
                                <p>Data: {item.data}</p>
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
        ));
    };

    return (
        <div>
            {data.length === 0 && <div>Loading...</div>}
            {data.length > 0 && (
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div className='flex flex-row gap-4 items-end'>
                            <ItemsPerPageSelector
                                itemsPerPage={itemsPerPage}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                            <span className='text-sm'>Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} results</span>

                        </div>
                        <div>
                            <div className=' flex gap-2 justify-center items-center'>
                                <label htmlFor="consultantSelect">Select Consultant:</label>
                                <select id="consultantSelect" value={selectedConsultant} onChange={handleConsultantChange}>
                                    <option value="">All Consultants</option>
                                    {/* Map over unique consultant names and create options */}
                                    {Array.from(new Set(data.map(item => item['CONSULTANT']))).map((consultant, index) => (
                                        <option key={index} value={consultant}>{consultant}</option>
                                    ))}
                                </select>
                                <Search searchQuery={searchQuery} onSearch={handleSearch} />
                            </div>
                        </div>


                    </div>

                    <div>
                        <TableCustom headers={headers} body={generateTableBody()} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
