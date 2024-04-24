import React from 'react';
import { FetchCustomersData } from '../../services/Hooks';
import DataTable from '../../Components/Table/CustomTable';
import { useTranslation } from 'react-i18next';
const UserDataPage = () => {
  const { t } = useTranslation();
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
      <h2 className='text-start'>{t('hello')}</h2>
      <DataTable
        dataProps={customerData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserDataPage;
