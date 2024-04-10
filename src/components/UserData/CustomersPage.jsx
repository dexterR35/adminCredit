import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MaterialReactTable } from 'material-react-table';
import { FetchCustomersData, FormatTimestamp } from "../../services/Hooks";
import { createCustomer, updateCustomer, deleteCustomer } from "../../services/Hooks";
import openEditCustomerModal from "../CustomModal"

const UserDataPage = () => {
  const { customerData, refetch } = FetchCustomersData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
    }
  };

  const columns = React.useMemo(() => [
    {
      accessorKey: 'customer_info.formData.name',
      header: 'Nume',
      grow: false,
      size: 20,
      minSize: 100,
    },
    {
      accessorKey: 'customer_info.formData.phone',
      header: 'Telefon',
      grow: false,
      size: 20,
    },
    {
      id: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <Box>
          <IconButton onClick={() => handleEdit(row.original)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ], [handleEdit, handleDelete]);
  const renderDetailPanel = ({ row }) => (
    <Box sx={{ display: 'grid', margin: 'auto', gridTemplateColumns: '1fr 1fr', width: '100%' }}>
      <Box>
        {Array.isArray(row.original.customer_info.banking_info.ifn) && row.original.customer_info.banking_info.ifn.length > 0 && (
          <Typography>Banci: {row.original.customer_info.banking_info.ifn.join(', ')}</Typography>
        )}
        {Array.isArray(row.original.customer_info.banking_info.others) && row.original.customer_info.banking_info.others.length > 0 && (
          <Typography>Diverse: {row.original.customer_info.banking_info.others.join(', ')}</Typography>
        )}
        <Typography>Istoric Bancar: {row.original.customer_info.banking_info.bankHistory ? 'Are Istoric' : 'Nu are Istoric'}</Typography>
        <Typography>D.angajarii: {row.original.customer_info.formData.selectedDate}</Typography>
        <Typography>Despre noi: {row.original.customer_info.formData.aboutUs}</Typography>
        <Typography>D.Aplicarii: {FormatTimestamp(row.original.timestamp)}</Typography>
        <Typography>Email: {row.original.customer_info.formData.email}</Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <h2>Clienti ObtineCredit</h2>
      <div className="">
        <MaterialReactTable
          columns={columns}
          data={customerData}
          getRowId={row => row.id}
          renderDetailPanel={renderDetailPanel}
        />
      </div>
    </>
  );
};

export default UserDataPage;
