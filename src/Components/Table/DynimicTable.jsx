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
import {CustomButton} from "../Buttons/Buttons"
const DynamicTable = ({
    columns,
    data,
    loading,
    onDelete,
    onEdit,
    actions,
    title = "Default title", 
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
    onDelete(deleteContractId); // Call onDelete passed from props
    setShowDeleteModal(false);
    setDeleteContractId(null);
    console.log("2");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteContractId(null);
    console.log("3");
  };

  const handleContact = (contract) => {
    const { firstName, lastName, phone } = contract;
    alert(`Contacting ${firstName} ${lastName} at ${phone}`);
    window.open(`tel:${phone}`);
    console.log("4");
    console.log(`Contacting ${firstName} ${lastName} at ${phone}`);
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
      sx: { minWidth: "300px" },
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 30],
      shape: "rounded",
      variant: "outlined",
    },
    renderTopToolbar: ({ table }) => (
      <Box className="flex justify-between gap-2 my-2 py-2">
        <MRT_GlobalFilterTextField table={table} />

        <Box className="flex gap-2">
        {actions.map((action, index) => (
            <CustomButton
              key={index}
              text={(action.label)}
              buttonType={action.label === "Delete" ? "delete" : (action.label === "Contact" ? "info" : "default")}
              disabled={!table.getIsSomeRowsSelected()}
              variant="contained"
              onClick={() =>
                table.getSelectedRowModel().flatRows.forEach((row) => {
                  if (action.label === "Delete") {
                    handleDelete(row.original.id);
                  } else if (action.label === "Contact") {
                    handleContact(row.original);
                  } else {
                    action.onClick(row.original);
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
  <h2 className="text-start m-2 mx-0">{title}</h2>
      <MaterialReactTable table={table} />
      <Dialog open={showDeleteModal} onClose={cancelDelete}>
        <h4 className="text-center mt-4 mb-[-10px] font-bold text-xl">{deleteDialogTitle}</h4>
        <div className="py-6 px-4">
          <p>{deleteDialogContent}</p>
        </div>
        <div className="flex items-center w-full justify-end gap-2 p-2">
          <CustomButton onClick={confirmDelete} text="yes" buttonType="success" additionalClasses="w-20 justify-center !p-1.5"/>
          <CustomButton onClick={cancelDelete} text="Cancel" buttonType="error" additionalClasses="w-20 justify-center !p-1.5"/>
        </div>
      </Dialog>
    </>
  );
};

export default DynamicTable;
