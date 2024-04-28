import React, { useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks'
import Pagination from '../../Components/Table/_Pagination';
import Search from '../../Components/Table/_Search';
import ItemsPerPageSelector from '../../Components/Table/_itemPerPage';
import UseDataTable from '../../Components/Table/UseDataTable';
import TableCustom from '../../Components/Table/TableCustom';

const CustomersPage = () => {
  const headers = ["name", "history", "phone", "timestamp", "status"];
  const { customerData } = FetchCustomersData();
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
  } = UseDataTable(customerData);


  const handleEditClick = (id) => {

  };

  const handleDeleteClick = (id) => {

  };
  const generateTableBody = () => {
    return currentItems.map((item, index) => (
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
    ))
  }
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div className='flex flex-row gap-4 items-stretch'>
          <ItemsPerPageSelector
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
          <span className='text-sm'>Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} results</span>
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


export default CustomersPage;