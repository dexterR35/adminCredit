import React, { useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks'
import Pagination from '../../Components/Table/_Pagination';
import Search from '../../Components/Table/_Search';
import ItemsPerPageSelector from '../../Components/Table/_itemPerPage';
import UseDataTable from '../../Components/Table/UseDataTable';
import TableCustom from '../../Components/Table/TableCustom';
import { CustomButton } from "../../Components/Buttons/Buttons";

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


  const handleEdit = (id) => {
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    // Add your delete logic here
  };
  const generateTableBody = () => {
    return currentItems.map((item, index) => (
      <React.Fragment key={index}>
        <tr onClick={() => handleRowClick(index)} className="cursor-pointer">
          <td >{item.name}</td>
          <td >{item.bankHistory}</td>
          <td >{item.phone}</td>
          <td >{item.timestamp}</td>
          <td >{item.status}</td>
        </tr>
        {expandedRow === index && (
          <tr>
            <td colSpan={headers.length} className="border">
              <div>
                <p>Email: {item.email}</p>
                <p>About Us: {item.aboutUs}</p>
                <h4>Additional Details for {item.name}</h4>
              </div>
              <CustomButton onClick={() => handleEdit(contract.id)} />
              <CustomButton onClick={() => handleDelete(contract.id)} />
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