import React, { useState } from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';
import { usePagination } from '@table-library/react-table-library/pagination';
import SearchInput from '../utils/_Search';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '../utils/_Modal';

const UserDataPage = () => {
  const { customerData, updateCustomer, deleteCustomer } = FetchCustomersData();
  const dataCustomers = { nodes: customerData };

  const theme = useTheme(getTheme());

  const [ids, setIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleExpand = (item) => {
    setIds(ids.includes(item.id) ? ids.filter(id => id !== item.id) : ids.concat(item.id));
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteCustomer(id);
  };

  const pagination = usePagination(dataCustomers, {
    state: {
      page: 1,
      size: 10,
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
    {
      label: 'Actiuni', renderCell: (item) => (
        <div className='flex space-x-4'>
          <button onClick={() => handleEdit(item)} >Edit</button>
          <button onClick={() => handleDelete(item.id)} >Delete</button>
        </div>
      )
    }
  ];

  const ROW_PROPS = {
    onClick: handleExpand,
  };

  const ROW_OPTIONS = {
    renderAfterRow: (item) => (
      ids.includes(item.id) && (
        <tr className='flex' style={{ gridColumn: '1 / span 4' }}>
          <td className='flex-1 bg-gray-200 px-3'>
            <div className='flex-col'>
              <div className='px-0 mb-2 text-start'> Id: {item.id}</div>
              <div>Data angajarii: {item.selectedDate}</div>
              <div>Email: {item.email}</div>
              <div>Despre noi: {item.aboutUs}</div>
              <div className='bg-blue-300 p-1 px-0 mt-2'> <span className='px-0'> Status: {item.status}</span></div>
            </div>
          </td>
          <td className='flex-1  bg-gray-200 px-3'>
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

  const searchCustomers = () => {
    return customerData.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  };

  return (
    <>
      <h2 className='text-start'>Clients Site</h2>
      <div>
        <SearchInput onSearch={setSearchTerm} />
      </div>
      <div className="container p-2 w-full overflow-auto">
        <CompactTable
          columns={COLUMNS}
          data={{ nodes: searchCustomers() }}
          theme={theme}
          pagination={pagination}
          rowProps={ROW_PROPS}
          rowOptions={ROW_OPTIONS}
        />
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
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {/* Your edit modal content */}
          {/* You can use selectedCustomer to pre-fill the form */}
        </Modal>
      )}
    </>
  );
};

export default UserDataPage;
