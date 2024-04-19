

import React, { useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';
import SearchInput from '../utils/_Search';

const UserDataPage = () => {
  const { customerData } = FetchCustomersData();
  const dataCustomers = { nodes: customerData };

  const theme = useTheme(getTheme());

  const [ids, setIds] = useState([]);

  const handleExpand = (item) => {
    setIds(ids.includes(item.id) ? ids.filter(id => id !== item.id) : ids.concat(item.id));
  };

  const pagination = usePagination(dataCustomers, {
    state: {
      page: 1,
      size: 10, // Adjust based on your needs
    },
    onChange: (action, state) => {
      console.log(action, state);
    },
  });

  const COLUMNS = [
    { label: 'Nume', renderCell: (item) => item.name },
    { label: 'Telefon', renderCell: (item) => item.phone },
    { label: 'Istoric', renderCell: (item) => item.bankHistory },
    { label: 'Data inscrierii', renderCell: (item) => item.timestamp },
    // { label: 'Status', renderCell: (item) => item.status },

  ];
  console.log("Columns:", COLUMNS);
  console.log("Customer Data:", customerData);

  const ROW_PROPS = {
    onClick: handleExpand,
  };
  const searchProducts = async (searchTerm) => {
    // Filtrarea locală sau interogarea unui API
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  const ROW_OPTIONS = {
    renderAfterRow: (item) => (
      ids.includes(item.id) && (
        <tr className='flex' style={{ gridColumn: '1 / -1' }}>
          <td className='flex-1 bg-[#f0f0f0] px-3'>
            <div className='flex-col'>
              <div className=' px-0  mb-2 text-end'> Id: {item.id}</div>

              <div>Data angajarii: {item.selectedDate}</div>
              <div>Email: {item.email}</div>
              <div>Despre noi: {item.aboutUs}</div>
              <div className='bg-blue-300 p-1 px-0 mt-2'>Status: {item.status}</div>
            </div>
          </td>
          <td className='flex-1 bg-[#f0f0f0] px-3'>
            <div className='flex-col'>
              <div className='flex flex-wrap space-x-1'>BANCA: {item.banks}</div>
              <div className='flex flex-wrap space-x-1'>IFN: {item.ifn}</div>
              <div className='flex flex-wrap space-x-1'>Diverse: {item.others}</div>

            </div>
          </td>
        </tr>
      )
    ),
  };

  return (
    <>
      <h2 className='text-start'>Clients Site</h2>
      <div>
        <SearchInput onSearch={searchProducts} />
      </div>
      <div className="container p-2 w-full overflow-auto">
        <CompactTable
          columns={COLUMNS}
          data={dataCustomers}
          theme={theme}
          pagination={pagination}
          rowProps={ROW_PROPS}
          rowOptions={ROW_OPTIONS}
        />

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <span>Total Pages: {pagination.state.getTotalPages(dataCustomers.nodes)}</span>
          <div>
            Page:&nbsp;
            {pagination.state.getPages(dataCustomers.nodes).map((_, index) => (
              <button
                key={index}
                className={`px-2 py-1 ${pagination.state.page === index ? 'font-bold' : 'font-normal'}`}
                onClick={() => pagination.fns.onSetPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDataPage;
