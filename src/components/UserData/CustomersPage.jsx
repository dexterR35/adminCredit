

import React, { useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';

const UserDataPage = () => {
  const { customerData } = FetchCustomersData();
  const data = { nodes: customerData };

  const theme = useTheme(getTheme());

  const [ids, setIds] = useState([]);

  const handleExpand = (item) => {
    setIds(ids.includes(item.id) ? ids.filter(id => id !== item.id) : ids.concat(item.id));
  };

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 10, // Adjust based on your needs
    },
    onChange: (action, state) => {
      console.log(action, state);
    },
  });

  const COLUMNS = [
    { label: 'Nume', renderCell: (item) => item.name },
    { label: 'Telefon', renderCell: (item) => item.phone },
  ];

  const ROW_PROPS = {
    onClick: handleExpand,
  };

  const ROW_OPTIONS = {
    renderAfterRow: (item) => (
      ids.includes(item.id) && (
        <tr style={{ display: 'flex', gridColumn: '1 / -1' }}>
          <td style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '10px' }}>
            {/* Additional information here */}
            <div><strong>Banci:</strong> {item.banks}</div>
            <div><strong>Ifn:</strong> {item.ifn}</div>
            <div><strong>Diverse:</strong> {item.others}</div>
            <div><strong>Istoric Bancar:</strong> {item.bankHistory}</div>
            <div><strong>D.angajarii:</strong> {item.selectedDate}</div>
            <div><strong>Despre noi:</strong> {item.aboutUs}</div>
            <div><strong>D.Aplicarii:</strong> {item.timestamp}</div>
            <div><strong>Email:</strong> {item.email}</div>
          </td>
          <td style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '10px' }}>

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
          data={data}
          theme={theme}
          pagination={pagination}
          rowProps={ROW_PROPS}
          rowOptions={ROW_OPTIONS}
        />

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>
          <div>
            Page:&nbsp;
            {pagination.state.getPages(data.nodes).map((_, index) => (
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
