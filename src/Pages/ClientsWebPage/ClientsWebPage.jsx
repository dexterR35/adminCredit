import DynamicTable from "../../Components/Table/DynimicTable";
import { FetchCustomersData } from "../../services/Hooks";

const ClientsTable = () => {
    const { customerData, loading, deleteCustomer } = FetchCustomersData();
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
