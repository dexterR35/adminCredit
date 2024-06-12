import React, { useEffect, useState } from 'react';
import { fetchRaportNew } from "../../services/Hooks";
import Pagination from '../../Components/Table/_Pagination';
import Search from '../../Components/Table/_Search';
import ItemsPerPageSelector from '../../Components/Table/_itemPerPage';
import UseDataTable from '../../Components/Table/UseDataTable';
import TableCustom from "../../Components/Table/TableCustom";
// Make sure this import is correct

const HomeRaportTable = () => {
    const headers = ["name", "bank status", "bank history", "phone", "timestamp"];
    const [raportTable, setRaportTable] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRaportNew();
                setRaportTable(data);
            } catch (error) {
                console.error('Error fetching raport data:', error);
            }
        };

        fetchData();
    }, []);

    const {
        searchQuery,
        currentPage,
        itemsPerPage,
        handleRowClick,
        handleSearch,
        handleItemsPerPageChange,
        handlePageChange,
        currentItems,
        totalPages,
        expandedRow
    } = UseDataTable(raportTable);

    const handleEdit = (id) => {
        // Implement edit functionality
        console.log("Edit", id);
    };

    const handleDelete = (id) => {
        // Implement delete functionality
        console.log("Delete", id);
    };

    const generateTableBody = () => {
        return currentItems.map((item, index) => (
            <React.Fragment key={item.id || index}>
                <tr onClick={(e) => { e.stopPropagation(); handleRowClick(index); }} className="cursor-pointer">
                    <td>{item.firstName} {item.lastName}</td>
                    {/* Render other cells based on item data */}
                </tr>
                {expandedRow === index && (
                    <tr key={`expanded-${item.id || index}`}>
                        <td colSpan={headers.length} className="border">
                            <div className='flex flex-row justify-between items-center'>
                                <div className='flex-row flex gap-10'>
                                    <div>
                                        <p>Email: {item.email}</p>
                                        <p>Phone: {item.phone}</p>
                                        {/* Render other details as needed */}
                                    </div>
                                </div>
                                <div className='space-x-2 flex flex-row gap-1'>
                                    <CustomButton onClick={() => handleEdit(item.id)} buttonType='edit' text="Edit" additionalClasses='w-16' />
                                    <CustomButton onClick={() => handleDelete(item.id)} buttonType='delete' text='Delete' additionalClasses='w-16' />
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        ));
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <div className='flex flex-row gap-4 items-stretch'>
                    <ItemsPerPageSelector
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
                <Search searchQuery={searchQuery} onSearch={handleSearch} />
            </div>
            <div className='overflow-auto'>
                <TableCustom headers={headers} body={generateTableBody()} />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default HomeRaportTable;
