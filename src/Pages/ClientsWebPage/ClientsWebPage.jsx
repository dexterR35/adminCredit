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
            size: 120,
            Cell: ({ row }) => <span style={{ textTransform: 'capitalize' }}>{row.original.name}</span>,
        },
        { accessorKey: "phone", header: "Phone", size: 100 },
        { accessorKey: "banks", header: "banks", size: 120 },
        { accessorKey: "ifn", header: "ifn", size: 120 },
        { accessorKey: "bankHistory", header: "bank History", size: 70 },
        { accessorKey: "bankStatus", header: "bank Status", size: 70 },
        { accessorKey: "others", header: "others", size: 120 },
        { accessorKey: "selectedDate", header: "jobDate", size: 70 },
        { accessorKey: "email", header: "email", size: 100 },
        { accessorKey: "timestamp", header: "Date", size: 120 },
        { accessorKey: "status", header: "status", size: 50 },
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
