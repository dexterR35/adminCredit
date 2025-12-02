import React from "react";
import DynamicTable from "../../Components/Table/DynimicTable";
import { FetchContractData } from "../../services/Hooks";
import Badge from "../../Components/Badge/Badge";

const ContractTable = () => {
  const { contracts, loading, onDelete } = FetchContractData();

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
      size: 120,
      Cell: ({ row }) => {
        const photo = row.original.photo;
        if (!photo || photo === '' || photo === null || photo === undefined) {
          return (
            <Badge variant="error" size="sm">
              No Photo
            </Badge>
          );
        }
        return (
          <a 
            href={photo} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Badge variant="success" size="sm">
              View Photo
            </Badge>
          </a>
        );
      },
    },
    {
      accessorKey: "pdfUrl",
      header: "PDF",
      size: 120,
      Cell: ({ row }) => {
        const pdfUrl = row.original.pdfUrl;
        if (!pdfUrl || pdfUrl === '' || pdfUrl === null || pdfUrl === undefined) {
          return (
            <Badge variant="error" size="sm">
              No PDF
            </Badge>
          );
        }
        return (
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Badge variant="success" size="sm">
              View PDF
            </Badge>
          </a>
        );
      },
    },
    { accessorKey: "timestamp", header: "Date", size: 100 },
  ];

  const actions = [
    {
      label: "Delete",
      onClick: (contract) => {
        console.log("Deleting contract:", contract.id);
        onDelete(contract.id); 
      }
    },
    {
      label: "Contact",
      onClick: (contract) => {
        console.log("Contacting:", contract.firstName, contract.lastName);
      },
    },
  ];

  return (
    <div className="animate-fade-in">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-700 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-gray-300 font-medium">Loading contracts...</p>
          </div>
        </div>
      ) : (
        <DynamicTable
          columns={columns}
          data={contracts}
          loading={loading}
          onDelete={onDelete}
          actions={actions}
          title=""
          linkTable="https://obtinecredit.ro/contract"
          deleteDialogTitle="Confirm Delete"
          deleteDialogContent="Are you sure you want to delete this contract?"
        />
      )}
    </div>
  );
};

export default ContractTable;
