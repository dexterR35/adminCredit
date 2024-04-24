import React from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import DataTable from '../../Components/Table/CustomTable';

const UserDataPage = () => {
  const { customerData, updateCustomer, deleteCustomer } = FetchCustomersData();

  // Define edit handler
  const handleEdit = (id) => {
    // Define the data to update
    const updatedData = { status: "Updated" };
    updateCustomer(id, updatedData);
  };

  // Define delete handler
  const handleDelete = (id) => {
    deleteCustomer(id);
  };

  return (
    <div>
      <h2 className='text-start'>Clienti Site</h2>
      <DataTable
        dataProps={customerData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserDataPage;
