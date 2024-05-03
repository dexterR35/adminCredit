import React, { useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks'
import Pagination from '../../Components/Table/_Pagination';
import Search from '../../Components/Table/_Search';
import ItemsPerPageSelector from '../../Components/Table/_itemPerPage';
import UseDataTable from '../../Components/Table/UseDataTable';
import TableCustom from '../../Components/Table/TableCustom';
import { CustomButton } from "../../Components/Buttons/Buttons";

const CustomersPage = () => {
  const headers = ["name", "bank status", "bank history", "phone", "timestamp"];
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
          <td >{item.bankStatus}</td>
          <td >{item.bankHistory}</td>
          <td >{item.phone}</td>
          <td >{item.timestamp}</td>

        </tr>
        {expandedRow === index && (
          <>
            <tr>
              <td colSpan={headers.length} className="border">
                <div className='flex flex-row justify-between items-center'>
                  <div className='flex-row flex gap-10'>
                    <div>
                      <p>Status: {item.status}</p>
                      <p>Email: {item.email}</p>
                      <p className='capitalize'>About Us: {item.aboutUs}</p>
                    </div>
                    <div>
                      <p className='flex gap-2'>IFN:{item.ifn}</p>
                      <p className='flex gap-2'>BANKS:{item.banks}</p>
                      <p className='flex gap-2 capitalize'>Others:{item.others}</p>
                      <p className='flex gap-2'>JobDate: {item.selectedDate}</p>
                    </div>
                  </div>

                  <p className='space-x-2'>
                    <CustomButton onClick={() => handleEdit(contract.id)} buttonType='edit' text="edit" additionalClasses='w-16' />
                    <CustomButton onClick={() => handleDelete(contract.id)} buttonType='delete' text='delete' additionalClasses='w-16' />
                  </p>
                </div>
              </td>

            </tr>



          </>
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