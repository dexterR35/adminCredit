import React, { useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
} from "material-react-table";
import {
  Dialog,
  Box,
} from "@mui/material";
import { CustomButton } from "../Buttons/Buttons"
const DynamicTable = ({
  columns,
  data,
  loading,
  onDelete,
  onEdit,
  actions,
  title = "Default title",
  linkTable = "",
  deleteDialogContent = "Are you sure you want to delete",
  deleteDialogTitle = "Confirm Delete",
}) => {
  const [deleteContractId, setDeleteContractId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = (contractId) => {
    setDeleteContractId(contractId);
    setShowDeleteModal(true);
    console.log("1");
  };

  const confirmDelete = () => {
    onDelete(deleteContractId);
    setShowDeleteModal(false);
    setDeleteContractId(null);
    console.log("2");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteContractId(null);
    console.log("3");
  };

  const handleContact = (list) => {
    const { phone } = list;
    alert(`Contacting at ${phone}`);
    window.open(`tel:${phone}`);
    console.log("4");

  };

  const table = useMaterialReactTable({
    columns,
    data,
    updateData: onEdit,
    enableRowSelection: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    initialState: {
      showGlobalFilter: true,
    },
    
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      placeholder: "Search",
      sx: { minWidth: "100px" },
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 30],
      shape: "rounded",
      variant: "outlined",
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#374151',
        color: '#f9fafb',
        fontWeight: 600,
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '2px solid #4b5563',
      }
    },
    muiTableBodyCellProps: {
      sx: {
        borderBottom: '1px solid #4b5563',
        backgroundColor: '#1f2937',
        color: '#f3f4f6',
      }
    },
    muiTableBodyRowProps: {
      sx: {
      }
    },
    renderTopToolbar: ({ table }) => (
      <Box className="flex justify-end">
        <Box className="flex gap-2 mb-4">
          {actions.map((action, index) => (
            <CustomButton
              key={index}
              text={(action.label)}
              buttonType={
                action.label === "Delete" ? "delete" :
                action.label === "Contact" ? "info" :
                action.label === "Edit" ? "edit" :
                action.label === "Send" ? "info" :
                "default" // This is the default case if none of the above conditions are met
              }
              disabled={!table.getIsSomeRowsSelected()}
              variant="contained"
              onClick={() =>
                table.getSelectedRowModel().flatRows.forEach((row) => {
                  switch (action.label) {
                    case "Delete":
                      handleDelete(row.original.id);
                      break;
                    case "Contact":
                      handleContact(row.original);
                      break;
                    case "Edit":
                      // handleEdit(row.original); // You need to define handleEdit function
                      break;
                      case "Send":
                        // handleEdit(row.original); // You need to define handleEdit function
                        break;
                    default:
                      action.onClick(row.original);
                      break;
                  }
                })
              }

            >
              {action.label}
            </CustomButton>
          ))}
        </Box>
      </Box>
    ),
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
        {/* Header Section */}
        {title && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
              {linkTable && (
                <p className="text-sm text-gray-400">
                  Info: <a href={linkTable} target="_blank" className="text-indigo-400 font-medium" rel="noopener noreferrer">
                    {linkTable.replace("https://", "")}
                  </a>
                </p>
              )}
            </div>
            <div className="w-full sm:w-auto">
              <MRT_GlobalFilterTextField table={table} />
            </div>
          </div>
        )}
        {!title && (
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 mb-6">
            <div className="w-full sm:w-auto">
              <MRT_GlobalFilterTextField table={table} />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <MaterialReactTable table={table} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteModal} 
        onClose={cancelDelete}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxWidth: '400px',
            width: '100%',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
          }
        }}
      >
        <div className="p-6 bg-gray-800">
          <h4 className="text-xl font-bold text-white mb-2">{deleteDialogTitle}</h4>
          <p className="text-gray-300 mb-6">{deleteDialogContent}</p>
          <div className="flex items-center justify-end gap-3">
            <CustomButton 
              onClick={cancelDelete} 
              text="Cancel" 
              buttonType="error" 
              additionalClasses="px-6 py-2 rounded-lg shadow-sm" 
            />
            <CustomButton 
              onClick={confirmDelete} 
              text="Yes, Delete" 
              buttonType="success" 
              additionalClasses="px-6 py-2 rounded-lg shadow-sm" 
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DynamicTable;
