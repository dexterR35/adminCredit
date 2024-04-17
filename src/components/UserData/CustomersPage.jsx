

import React, { useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';

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

  ];
  console.log("Columns:", COLUMNS);
  console.log("Customer Data:", customerData);

  const ROW_PROPS = {
    onClick: handleExpand,
  };

  const ROW_OPTIONS = {
    renderAfterRow: (item) => (
      ids.includes(item.id) && (
        <tr className='flex' style={{ gridColumn: '1 / -1' }}>
          <td className='flex-1 bg-[#f0f0f0] px-3'>
            <div className='flex-col'>
              <div><span>D.angajarii:</span> <span>{item.selectedDate}</span></div>
              <div><span>Despre noi:</span> <span>{item.aboutUs}</span></div>
              <div><span>Email:</span> <span>{item.email}</span></div>
            </div>
          </td>
          <td className='flex-1 bg-[#f0f0f0] px-3'>
            <div className='flex-col'>
              <div><span>Banci:</span> <span>{item.banks}</span></div>
              <div><span>Ifn:</span> <span>{item.ifn}</span></div>
              <div><span>Diverse:</span> <span>{item.others}</span></div>
            </div>
          </td>
        </tr>
      )
    ),
  };

  return (
    <>
      <h2 className="text-xl font-semibold">Clienti ObtineCredit</h2>
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
