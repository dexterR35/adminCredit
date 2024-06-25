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
        backgroundColor: '#D8E2DC', 
        color: '#333', 
        textTransform:'uppercase',
        fontSize:'0.9em',

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
   <div className="flex justify-between items-center">
      <div >
        <h2 className="text-start m-0">{title}</h2>
        <p className="text-sm text-gray-500  mb-2">Info: <a href={linkTable} target="_blank" className=" text-blue-500" rel="noopener noreferrer">{linkTable.replace("https://", "")}</a></p>
      </div>
        <MRT_GlobalFilterTextField table={table} />
      </div>
      <hr />
      <br />
      <MaterialReactTable table={table} />
      <Dialog open={showDeleteModal} onClose={cancelDelete}>
        <h4 className="text-center mt-4 mb-[-10px] font-bold text-xl">{deleteDialogTitle}</h4>
        <div className="py-6 px-4">
          <p>{deleteDialogContent}</p>
        </div>
        <div className="flex items-center w-full justify-end gap-2 p-2">
          <CustomButton onClick={confirmDelete} text="yes" buttonType="success" additionalClasses="w-20 justify-center !p-1.5" />
          <CustomButton onClick={cancelDelete} text="Cancel" buttonType="error" additionalClasses="w-20 justify-center !p-1.5" />
        </div>
      </Dialog>
    </>
  );
};

export default DynamicTable;
