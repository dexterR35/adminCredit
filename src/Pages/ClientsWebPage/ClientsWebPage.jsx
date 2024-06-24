import { useState } from "react";
import DynamicTable from "../../Components/Table/DynimicTable";
import { FetchCustomersData } from "../../services/Hooks";

const ContractTable = () => {
    const { customerData, loading, deleteCustomer } = FetchCustomersData();
    // console.log(customerData, "fasfa")
    // Define columns configuration
    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            size: 100,
            Cell: ({ row }) => <span style={{ textTransform: 'capitalize' }}>{row.original.name}</span>,
        },
        { accessorKey: "phone", header: "Phone", size: 100 },
        { accessorKey: "banks", header: "banks", size: 100 },
        { accessorKey: "ifn", header: "ifn", size: 100 },
        { accessorKey: "bankHistory", header: "bank History", size: 100 },
        { accessorKey: "bankStatus", header: "bank Status", size: 100 },
        { accessorKey: "others", header: "others", size: 100 },
        { accessorKey: "selectedDate", header: "jobDate", size: 100 },
        {
            accessorKey: "email", header: "email", size: 10, cellStyle: {
                maxWidth: 20,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
        },
        { accessorKey: "timestamp", header: "Date", size: 100 },
        { accessorKey: "status", header: "status", size: 100 },
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
                    data={customerData}
                    //   loading={loading}
                    onDelete={deleteCustomer}
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
