import React, { useState } from "react";
import DynamicTable from "../../Components/Table/DynimicTable";
import { FetchCustomersData } from "../../services/Hooks";
import Badge from "../../Components/Badge/Badge";
import EditCustomer from "../../Components/Customer/EditCustomer";

const ClientsTable = () => {
    const { customerData, loading, deleteCustomer, updateCustomer } = FetchCustomersData();
    const [editingCustomer, setEditingCustomer] = useState(null);
    
    // Dynamic column configuration with badge support
    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            size: 120,
            Cell: ({ row }) => <span className="capitalize text-white font-medium">{row.original.name}</span>,
        },
        { 
            accessorKey: "phone", 
            header: "Phone", 
            size: 100,
            Cell: ({ row }) => <span className="text-gray-300">{row.original.phone || "—"}</span>,
        },
        { 
            accessorKey: "banks", 
            header: "Banks", 
            size: 120,
            Cell: ({ row }) => <span className="text-gray-300">{row.original.banks || "—"}</span>,
        },
        { 
            accessorKey: "ifn", 
            header: "IFN", 
            size: 120,
            Cell: ({ row }) => <span className="text-gray-300">{row.original.ifn || "—"}</span>,
        },
        { 
            accessorKey: "bankHistory", 
            header: "Bank History", 
            size: 120,
            badge: {
                getVariant: (value) => {
                    if (!value) return "default";
                    const val = String(value).toLowerCase();
                    // "No bank history" = good (green), "Bank history" = bad (red)
                    if (val.includes("no bank history")) return "green";
                    if (val.includes("bank history") && !val.includes("no")) return "red";
                    return "default";
                },
                formatter: (value) => {
                    if (!value) return "—";
                    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
                },
                size: "sm",
            },
        },
        { 
            accessorKey: "bankStatus", 
            header: "Bank Status", 
            size: 120,
            badge: {
                getVariant: (value) => {
                    if (!value) return "default";
                    const val = String(value).toLowerCase();
                    // "No raport status" = good (green), "Negativ Raport" = bad (red)
                    if (val.includes("no raport status")) return "green";
                    if (val.includes("negativ raport")) return "red";
                    return "default";
                },
                formatter: (value) => {
                    if (!value) return "—";
                    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
                },
                size: "sm",
            },
        },
        { 
            accessorKey: "others", 
            header: "Others", 
            size: 120,
            Cell: ({ row }) => <span className="text-gray-300">{row.original.others || "—"}</span>,
        },
        { 
            accessorKey: "selectedDate", 
            header: "Job Date", 
            size: 100,
            Cell: ({ row }) => <span className="text-gray-300">{row.original.selectedDate || "—"}</span>,
        },
        { 
            accessorKey: "email", 
            header: "Email", 
            size: 150,
            Cell: ({ row }) => <span className="text-gray-300">{row.original.email || "—"}</span>,
        },
        { 
            accessorKey: "timestamp", 
            header: "Date", 
            size: 120,
            Cell: ({ row }) => <span className="text-gray-300">{row.original.timestamp || "—"}</span>,
        },
        { 
            accessorKey: "status", 
            header: "Status", 
            size: 100,
            badge: {
                variantMap: {
                    "active": "green",
                    "inactive": "red",
                    "pending": "warning",
                    "new": "info",
                    "completed": "green",
                    "cancelled": "red",
                },
                getVariant: (value) => {
                    if (!value) return "default";
                    const val = String(value).toLowerCase();
                    if (val === "active" || val === "completed" || val === "approved") return "green";
                    if (val === "inactive" || val === "cancelled" || val === "rejected") return "red";
                    if (val === "pending") return "warning";
                    if (val === "new") return "info";
                    return "default";
                },
                formatter: (value) => value ? String(value).charAt(0).toUpperCase() + String(value).slice(1) : "—",
            },
        },
    ];

    const actions = [
        {
            label: "Edit",
            onClick: (client) => {
                setEditingCustomer(client);
            },
        },
        {
            label: "Delete",
            onClick: (client) => {
                console.log("Deleting client:", client.id);
                deleteCustomer(client.id);
            },
        },
        {
            label: "Contact",
            onClick: (client) => {
                console.log("Contacting:", client.name);
                handleContactClients(client);
            },
        },
    ];
    const handleContactClients = (client) => {
        alert(`Contacting ${client.name} at ${client.phone}`);
        window.open(`tel:${client.phone}`);
      };
    return (
        <div className="animate-fade-in">
            <EditCustomer
                customer={editingCustomer}
                isOpen={!!editingCustomer}
                onClose={() => setEditingCustomer(null)}
                onUpdate={() => {
                    setEditingCustomer(null);
                }}
                updateCustomer={updateCustomer}
            />
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-700 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-gray-300 font-medium">Loading clients...</p>
                    </div>
                </div>
            ) : (
                <DynamicTable
                    columns={columns}
                    data={customerData}
                    onDelete={deleteCustomer}
                    actions={actions}
                    title=""
                    linkTable="https://obtinecredit.ro"
                    deleteDialogTitle="Confirm Delete"
                    deleteDialogContent="Are you sure you want to delete this client?"
                    handleContact={handleContactClients}
                />
            )}
        </div>
    );
};

export default ClientsTable;
