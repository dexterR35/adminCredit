import DynamicTable from "../../Components/Table/DynimicTable";
import { useFetchRaportNew } from "../../services/Hooks";

const NewRaportTable = () => {
    const { raports, loading, onDelete } = useFetchRaportNew();
    const columns = [
        {
            accessorKey: "firstName", 
            header: "Name",
  
            Cell: ({ row }) => <span style={{ textTransform: 'capitalize' }}>{`${row.original.firstName} ${row.original.lastName}`}</span>,
        },
        {
            accessorKey: "todayDate",
            header: "date",
        },
        {
            accessorKey: "phone",
            header: "phone",
        },
        {
            accessorKey: "userCNP",
            header: "CNP",
        },
   
    ];

    const actions = [
      
        {
            label: "send to Consultant",
            onClick: (client) => {
                console.log("Contacting:", client.name);
                // handleContactClients(client);
            },
        },
    
        {
            label: "Contact",
            onClick: (client) => {
                console.log("Contacting:", client.name);
                handleContactClients(client);
            },
        },
        {
            label: "Edit",
            onClick: (client) => {
                console.log("Edit client:", client.id);
                // onDelete(client.id);
            },
            IconButtonProps: {
                color: 'primary',
            },
        },
   
        {
            label: "Delete",
            onClick: (client) => {
                console.log("Deleting client:", client.id);
                onDelete(client.id);
            },
        },
        
    ];
    const handleContactClients = (client) => {
        alert(`Contacting ${client.name} at ${client.phone}`);
        window.open(`tel:${client.phone}`);
      };
    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-700 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-gray-300 font-medium">Loading reports...</p>
                    </div>
                </div>
            ) : (
                <DynamicTable
                    columns={columns}
                    data={raports}
                    onDelete={onDelete}
                    actions={actions}
                    title=""
                    linkTable=""
                    deleteDialogTitle="Confirm Delete"
                    deleteDialogContent="Are you sure you want to delete this report?"
                    handleContact={handleContactClients}
                />
            )}
        </>
    );
};

export default NewRaportTable;
