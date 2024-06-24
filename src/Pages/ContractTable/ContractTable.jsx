import  { useState } from "react";
import DynamicTable from "../../Components/Table/DynimicTable";
import { FetchContractData } from "../../services/Hooks";

const ContractTable = () => {
  const { contracts, loading, onDelete } = FetchContractData();
  // Define columns configuration
  const columns = [
    {
      accessorKey: "firstName",
      header: "First Name",
      size: 100,
      filterable: false,
    },
    { accessorKey: "lastName", header: "Last Name", size: 100 },
    { accessorKey: "phone", header: "Phone", size: 100 },
    {
      accessorKey: "photo",
      header: "Photo",
      size: 100,
      Cell: ({ row }) => (
        <a href={row.original.photo} target="_blank" rel="noopener noreferrer">
          View Photo
        </a>
      ),
    },
    {
      accessorKey: "pdfUrl",
      header: "PDF",
      size: 100,
      Cell: ({ row }) => (
        <a href={row.original.pdfUrl} target="_blank" rel="noopener noreferrer">
          View PDF
        </a>
      ),
    },
    { accessorKey: "timestamp", header: "Date", size: 100 },
  ];

  const actions = [
    {
      label: "Delete",
      onClick: (contract) => {
        console.log("Deleting contract:", contract.id);
        onDelete(contract.id); 
      },
    },
    {
      label: "Contact",
      onClick: (contract) => {
        console.log("Contacting:", contract.firstName, contract.lastName);
      },
    },
  ];

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DynamicTable
          columns={columns}
          data={contracts}
          loading={loading}
          onDelete={onDelete}
          actions={actions}
          title="Contracts"
          deleteDialogTitle="Confirm Delete"
          deleteDialogContent="Are you sure you want to delete"
        />
      )}
    </>
  );
};

export default ContractTable;
